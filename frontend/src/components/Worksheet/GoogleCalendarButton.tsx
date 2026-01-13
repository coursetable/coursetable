import { useState, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { hasGrantedAnyScopeGoogle, useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import Spinner from '../../components/Spinner';
import { academicCalendars } from '../../config';
import { useGapi } from '../../contexts/gapiContext';
import GCalIcon from '../../images/gcal.svg';
import { useStore } from '../../store';
import { getCalendarEvents } from '../../utilities/calendar';
import { toSeasonString } from '../../utilities/course';

/**
 * Normalizes Google API errors into proper Error instances for Sentry.
 * Google API errors are plain objects with { body, headers, result, status }.
 */
function normalizeGoogleApiError(
  err: unknown,
  context: string,
): Error & { status?: number; googleError?: unknown } {
  // Check if it's a Google API error object
  if (
    err &&
    typeof err === 'object' &&
    Object.hasOwn(err, 'status') &&
    Object.hasOwn(err, 'result')
  ) {
    const { status, result } = err as {
      status: number;
      result?: {
        error?: {
          message?: string;
          code?: number;
          errors?: { message?: string; reason?: string; domain?: string }[];
        };
      };
    };
    // Extract error message - try message, then errors array details
    const errorMessage =
      result?.error?.message ||
      result?.error?.errors?.[0]?.message ||
      result?.error?.errors?.[0]?.reason ||
      `Google Calendar API error (status: ${status})`;

    const error = new Error(`${context}: ${errorMessage}`) as Error & {
      status?: number;
      googleError?: unknown;
    };
    error.status = status;
    error.googleError = err;
    return error;
  }

  // If it's already an Error, return it
  if (err instanceof Error)
    return err as Error & { status?: number; googleError?: unknown };

  // Otherwise, wrap it in an Error
  return new Error(`${context}: ${String(err)}`) as Error & {
    status?: number;
    googleError?: unknown;
  };
}

function GoogleCalendarButton(): React.JSX.Element {
  const [exporting, setExporting] = useState(false);
  const { gapi } = useGapi();
  const { viewedSeason, courses } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      courses: state.courses,
    })),
  );
  const exportEventsRef = useRef<(() => Promise<void>) | null>(null);

  const loginAndExportEvents = useGoogleLogin({
    onSuccess(tokenResponse) {
      if (!gapi) {
        Sentry.captureException(new Error('gapi not loaded'));
        return;
      }
      const hasAccess = hasGrantedAnyScopeGoogle(
        tokenResponse,
        'https://www.googleapis.com/auth/calendar.events',
      );
      if (!hasAccess) {
        toast.error('You must grant access to export events');
        return;
      }
      gapi.client.setToken({
        access_token: tokenResponse.access_token,
      });
      void exportEventsRef.current?.();
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
    onError(errorResponse) {
      Sentry.addBreadcrumb({
        category: 'gcal',
        message: 'Logging in to GCal',
        level: 'info',
      });
      Sentry.captureException(errorResponse);
      toast.error('Error logging in to Google Calendar');
    },
    onNonOAuthError(nonOAuthError) {
      if (nonOAuthError.type === 'popup_closed') {
        toast.error('Google Calendar sign in popup closed');
        return;
      } else if (nonOAuthError.type === 'popup_failed_to_open') {
        toast.error('Google Calendar sign in popup blocked');
        return;
      }
      Sentry.addBreadcrumb({
        category: 'gcal',
        message: 'Logging in to GCal',
        level: 'info',
      });
      Sentry.captureException(nonOAuthError);
      toast.error('Error logging in to Google Calendar');
    },
  });

  const exportEvents = useCallback(async () => {
    if (!gapi) {
      Sentry.captureException(new Error('gapi not loaded'));
      return;
    }

    const seasonString = toSeasonString(viewedSeason);
    const semester = academicCalendars[viewedSeason];
    if (!semester) {
      toast.error(
        `Can't construct calendar events for ${seasonString} because there is no academic calendar available.`,
      );
      return;
    }
    setExporting(true);

    try {
      // Validate token with a lightweight API call before proceeding
      // This prevents 403 errors by catching expired tokens early
      try {
        await gapi.client.calendar.calendarList.list({
          maxResults: 1,
        });
      } catch (validationErr) {
        const validationError = normalizeGoogleApiError(
          validationErr,
          'Token validation failed',
        );
        // If token is invalid (403), clear it and trigger re-auth
        if (validationError.status === 403) {
          gapi.client.setToken(null);
          setExporting(false);
          toast.info('Please sign in again to continue');
          loginAndExportEvents();
          return;
        }
        // If it's a different error, re-throw to be handled below
        throw validationErr;
      }

      // Get all previously added classes
      const eventList = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        // TODO: this is UTC date, which shouldn't matter, but we want
        // America/New_York. This is easily fixable once we use Temporal
        timeMin: new Date(
          Date.UTC(semester.start[0], semester.start[1] - 1, semester.start[2]),
        ).toISOString(),
        timeMax: new Date(
          Date.UTC(semester.end[0], semester.end[1] - 1, semester.end[2]),
        ).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      // Delete all previously added classes
      if (eventList.result.items.length > 0) {
        const deletedIds = new Set<string>();
        await Promise.all(
          eventList.result.items.map((event) => {
            if (event.id.startsWith('coursetable') && event.recurringEventId) {
              if (!deletedIds.has(event.recurringEventId)) {
                deletedIds.add(event.recurringEventId);
                return gapi.client.calendar.events.delete({
                  calendarId: 'primary',
                  eventId: event.recurringEventId,
                });
              }
            }
            return undefined;
          }),
        );
      }
      const events = getCalendarEvents('gcal', courses, viewedSeason);
      await Promise.all(
        events.map(async (event) => {
          try {
            await gapi.client.calendar.events.insert({
              calendarId: 'primary',
              resource: event,
            });
          } catch (err) {
            const normalizedError = normalizeGoogleApiError(
              err,
              'Failed to insert GCal event',
            );
            Sentry.addBreadcrumb({
              category: 'gcal',
              message: `Inserting GCal event ${JSON.stringify(event)}`,
              level: 'info',
            });
            Sentry.captureException(normalizedError);
            toast.error('Failed to add event to Google Calendar');
          }
        }),
      );
      toast.success('Exported to Google Calendar!');
    } catch (err) {
      const normalizedError = normalizeGoogleApiError(
        err,
        'Error exporting GCal events',
      );

      // Handle 403 Forbidden - token expired or revoked
      if (normalizedError.status === 403) {
        // Clear the token to force re-authentication
        gapi.client.setToken(null);
        setExporting(false);
        toast.info('Google Calendar access expired. Please sign in again.');
        Sentry.addBreadcrumb({
          category: 'gcal',
          message: 'Token expired (403), cleared token for re-authentication',
          level: 'warning',
        });
        // Automatically trigger re-authentication
        loginAndExportEvents();
        return;
      }
      toast.error('Error exporting Google Calendar events');

      Sentry.addBreadcrumb({
        category: 'gcal',
        message: 'Exporting GCal events',
        level: 'info',
      });
      Sentry.captureException(normalizedError);
    } finally {
      setExporting(false);
    }
  }, [courses, gapi, viewedSeason, loginAndExportEvents]);

  // Store exportEvents in ref so loginAndExportEvents can call it
  exportEventsRef.current = exportEvents;

  return (
    <button
      type="button"
      onClick={
        !exporting
          ? () => {
              if (!gapi?.client.getToken()) loginAndExportEvents();
              else void exportEvents();
            }
          : undefined
      }
    >
      {!exporting ? (
        <img style={{ height: '2rem' }} src={GCalIcon} alt="" />
      ) : (
        <Spinner message={undefined} />
      )}
      &nbsp;&nbsp;Export to Google Calendar
    </button>
  );
}

export default GoogleCalendarButton;
