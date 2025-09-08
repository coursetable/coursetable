import { useState, useCallback } from 'react';
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

function GoogleCalendarButton(): React.JSX.Element {
  const [exporting, setExporting] = useState(false);
  const { gapi } = useGapi();
  const { viewedSeason, courses } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      courses: state.courses,
    })),
  );

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
            Sentry.addBreadcrumb({
              category: 'gcal',
              message: `Inserting GCal event ${JSON.stringify(event)}`,
              level: 'info',
            });
            Sentry.captureException(err);
            toast.error('Failed to add event to Google Calendar');
          }
        }),
      );
      toast.success('Exported to Google Calendar!');
    } catch (err) {
      Sentry.addBreadcrumb({
        category: 'gcal',
        message: 'Exporting GCal events',
        level: 'info',
      });
      Sentry.captureException(err);
      console.log(err);
      toast.error('Error exporting Google Calendar events');
    } finally {
      setExporting(false);
    }
  }, [courses, gapi, viewedSeason]);

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
      void exportEvents();
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
