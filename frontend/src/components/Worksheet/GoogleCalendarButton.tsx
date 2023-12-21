import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Sentry from '@sentry/react';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { academicCalendars } from '../../config';
import { useGapi } from '../../contexts/gapiContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { getCalendarEvents } from '../../utilities/calendar';
import { toSeasonString } from '../../utilities/courseUtilities';
import GCalIcon from '../../images/gcal.svg';

function GoogleCalendarButton(): JSX.Element {
  const [exporting, setExporting] = useState(false);
  const { gapi, authInstance, user, setUser } = useGapi();
  const { curSeason, hiddenCourses, courses } = useWorksheet();
  const exportButtonRef = useRef<HTMLDivElement>(null);
  const exportEvents = useCallback(async () => {
    if (!gapi) {
      Sentry.captureException(new Error('gapi not loaded'));
      return;
    }
    const seasonString = toSeasonString(curSeason);
    const semester = academicCalendars[curSeason];
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
      const events = getCalendarEvents(
        'gcal',
        courses,
        curSeason,
        hiddenCourses,
      );
      await Promise.all(
        events.map(async (event) => {
          try {
            await gapi.client.calendar.events.insert({
              calendarId: 'primary',
              resource: event,
            });
          } catch (e) {
            Sentry.captureException(
              new Error('[GCAL]: Error adding events to user calendar: ', {
                cause: e,
              }),
            );
          }
        }),
      );
      toast.success('Exported to Google Calendar!');
    } catch (e) {
      Sentry.captureException(
        new Error('[GCAL]: Error syncing user events', { cause: e }),
      );
      toast.error('Error exporting Google Calendar Events');
    } finally {
      setExporting(false);
    }
  }, [courses, gapi, curSeason, hiddenCourses]);

  useEffect(() => {
    if (!authInstance || user || !exportButtonRef.current) return;

    authInstance.attachClickHandler(
      exportButtonRef.current,
      {},
      (googleUser) => {
        if (!user) {
          setUser(googleUser);
          void exportEvents();
        }
      },
      (error) => {
        Sentry.captureException(
          new Error('[GCAL]: Error signing in to Google Calendar: ', {
            cause: error,
          }),
        );
        toast.error('Error signing in to Google Calendar');
      },
    );
  }, [authInstance, user, setUser, exportEvents]);

  return (
    <div
      ref={exportButtonRef}
      onClick={user && !exporting ? exportEvents : undefined}
    >
      {authInstance && !exporting ? (
        <img style={{ height: '2rem' }} src={GCalIcon} alt="" />
      ) : (
        <Spinner animation="border" role="status" size="sm" />
      )}
      &nbsp;&nbsp;Export to Google Calendar
    </div>
  );
}

export default GoogleCalendarButton;
