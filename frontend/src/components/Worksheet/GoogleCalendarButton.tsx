import { useState, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { hasGrantedAnyScopeGoogle, useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import Spinner from '../../components/Spinner';
import { academicCalendars } from '../../config';
import GCalIcon from '../../images/gcal.svg';
import { useStore } from '../../store';
import { getCalendarEvents } from '../../utilities/calendar';
import { toSeasonString } from '../../utilities/course';

const RATE_LIMIT_RETRIES = 4;
const RATE_LIMIT_BASE_DELAY_MS = 400;

type GCalClientError = {
  status?: number;
  body?: string;
  result?: {
    error?: {
      errors?: { reason?: string }[];
    };
  };
};

function getGCalErrorReasons(err: unknown): string[] {
  if (!err || typeof err !== 'object') return [];
  const gcalErr = err as GCalClientError;
  const reasons = new Set<string>();

  for (const item of gcalErr.result?.error?.errors ?? [])
    if (item.reason) reasons.add(item.reason);

  if (typeof gcalErr.body === 'string') {
    try {
      const parsed = JSON.parse(gcalErr.body) as GCalClientError['result'];
      for (const item of parsed?.error?.errors ?? [])
        if (item.reason) reasons.add(item.reason);
    } catch {
      // Ignore malformed error bodies from gapi.
    }
  }

  return [...reasons];
}

function isGCalRateLimitError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  if ((err as GCalClientError).status !== 403) return false;
  const reasons = getGCalErrorReasons(err);
  return (
    reasons.includes('rateLimitExceeded') ||
    reasons.includes('userRateLimitExceeded')
  );
}

function isGCalAuthError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  return (err as GCalClientError).status === 403 && !isGCalRateLimitError(err);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function withRateLimitRetry<T>(
  operation: () => PromiseLike<T>,
): Promise<T> {
  for (let attempt = 0; attempt < RATE_LIMIT_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (err) {
      if (!isGCalRateLimitError(err) || attempt === RATE_LIMIT_RETRIES - 1)
        throw err;

      await delay(RATE_LIMIT_BASE_DELAY_MS * 2 ** attempt);
    }
  }
  throw new Error('Google Calendar rate limit retries exhausted');
}

function GoogleCalendarButton(): React.JSX.Element {
  const [exporting, setExporting] = useState(false);
  const gapi = useStore((s) => s.gapi);
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
      // Get all previously added classes
      const eventList = await withRateLimitRetry(() =>
        gapi.client.calendar.events.list({
          calendarId: 'primary',
          // TODO: this is UTC date, which shouldn't matter, but we want
          // America/New_York. This is easily fixable once we use Temporal
          timeMin: new Date(
            Date.UTC(
              semester.start[0],
              semester.start[1] - 1,
              semester.start[2],
            ),
          ).toISOString(),
          timeMax: new Date(
            Date.UTC(semester.end[0], semester.end[1] - 1, semester.end[2]),
          ).toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        }),
      );

      // Delete previously added classes sequentially to avoid quota spikes
      if (eventList.result.items.length > 0) {
        const recurringEventIds = [
          ...new Set(
            eventList.result.items.flatMap((event) => {
              if (event.id.startsWith('coursetable') && event.recurringEventId)
                return [event.recurringEventId];

              return [];
            }),
          ),
        ];
        for (const eventId of recurringEventIds) {
          await withRateLimitRetry(() =>
            gapi.client.calendar.events.delete({
              calendarId: 'primary',
              eventId,
            }),
          );
        }
      }

      const events = getCalendarEvents('gcal', courses, viewedSeason);
      let failedCount = 0;
      for (const event of events) {
        try {
          await withRateLimitRetry(() =>
            gapi.client.calendar.events.insert({
              calendarId: 'primary',
              resource: event,
            }),
          );
        } catch (err) {
          failedCount += 1;
          Sentry.addBreadcrumb({
            category: 'gcal',
            message: `Inserting GCal event ${JSON.stringify(event)}`,
            level: 'info',
          });
          Sentry.captureException(err);
        }
      }

      if (failedCount === 0) {
        toast.success('Exported to Google Calendar!');
      } else if (failedCount === events.length) {
        toast.error('Failed to export events to Google Calendar');
      } else {
        toast.error(
          `Failed to export ${failedCount} of ${events.length} events to Google Calendar`,
        );
      }
    } catch (err) {
      // Auth expired/revoked — not the same as a rate-limit 403
      if (isGCalAuthError(err)) {
        gapi.client.setToken(null);
        setExporting(false);
        toast.info('Google Calendar access expired. Please sign in again.');
        loginAndExportEvents();
        return;
      }

      Sentry.addBreadcrumb({
        category: 'gcal',
        message: 'Exporting GCal events',
        level: 'info',
      });
      Sentry.captureException(err);
      toast.error(
        isGCalRateLimitError(err)
          ? 'Google Calendar rate limit hit. Please try again in a moment.'
          : 'Error exporting Google Calendar events',
      );
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
