import { useState, useEffect, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';
import { academicCalendars } from '../../config';
import { useGapi } from '../../contexts/gapiContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import GCalIcon from '../../images/gcal.svg';
import { getCalendarEvents } from '../../utilities/calendar';
import { toSeasonString } from '../../utilities/course';

function GoogleCalendarButton(): React.JSX.Element {
  const [exporting, setExporting] = useState(false);
  const { gapi, authInstance, user, setUser } = useGapi();
  const { viewedSeason, courses } = useWorksheet();
  const exportButtonRef = useRef<HTMLButtonElement>(null);
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
      toast.error('Error exporting Google Calendar events');
    } finally {
      setExporting(false);
    }
  }, [courses, gapi, viewedSeason]);

  useEffect(() => {
    if (!authInstance || user || !exportButtonRef.current) return;

    authInstance.attachClickHandler(
      exportButtonRef.current,
      {},
      (googleUser) => {
        // TODO: is this needed?
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!user) {
          setUser(googleUser);
          void exportEvents();
        }
      },
      (err) => {
        if ((err as { error?: unknown }).error === 'popup_closed_by_user') {
          toast.error('Google Calendar sign in popup closed');
          return;
        }
        Sentry.addBreadcrumb({
          category: 'gcal',
          message: 'Signing into GCal',
          level: 'info',
        });
        Sentry.captureException(err);
        toast.error('Error signing in to Google Calendar');
      },
    );
  }, [authInstance, user, setUser, exportEvents]);

  return (
    <button
      type="button"
      ref={exportButtonRef}
      onClick={user && !exporting ? exportEvents : undefined}
    >
      {authInstance && !exporting ? (
        <img style={{ height: '2rem' }} src={GCalIcon} alt="" />
      ) : (
        <Spinner message={undefined} />
      )}
      &nbsp;&nbsp;Export to Google Calendar
    </button>
  );
}

export default GoogleCalendarButton;
