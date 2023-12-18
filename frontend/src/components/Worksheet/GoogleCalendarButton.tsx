import React, { useState, useEffect, useCallback } from 'react';
import { loadGapiInsideDOM, loadAuth2 } from 'gapi-script';
import * as Sentry from '@sentry/react';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { academicCalendars } from '../../config';
import { useWorksheet } from '../../contexts/worksheetContext';
import { getCalendarEvents } from '../../utilities/calendar';
import { toSeasonString } from '../../utilities/courseUtilities';
import GCalIcon from '../../images/gcal.svg';

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const GAPI_CLIENT_NAME = 'client:auth2';

function GoogleCalendarButton(): JSX.Element {
  const [gapi, setGapi] = useState<typeof globalThis.gapi | null>(null);
  const [authInstance, setAuthInstance] =
    useState<gapi.auth2.GoogleAuthBase | null>(null);
  const [user, setUser] = useState<gapi.auth2.GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { curSeason, hiddenCourses, courses } = useWorksheet();

  // Load gapi client after gapi script loaded
  const loadGapiClient = (gapiInstance: typeof globalThis.gapi) => {
    gapiInstance.load(GAPI_CLIENT_NAME, () => {
      gapiInstance.client.init({
        apiKey: import.meta.env.VITE_DEV_GCAL_API_KEY,
        clientId: import.meta.env.VITE_DEV_GCAL_CLIENT_ID,
        scope: SCOPES,
      });
      gapiInstance.client.load('calendar', 'v3');
    });
  };

  // Load gapi script and client
  useEffect(() => {
    async function loadGapi() {
      const newGapi = await loadGapiInsideDOM();
      loadGapiClient(newGapi);
      const newAuth2 = await loadAuth2(
        newGapi,
        import.meta.env.VITE_DEV_GCAL_CLIENT_ID,
        SCOPES,
      );
      setGapi(newGapi);
      setAuthInstance(newAuth2);
      setLoading(false);
    }
    loadGapi();
  }, []);

  const syncEvents = useCallback(async () => {
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
    setLoading(true);

    try {
      // get all previously added classes
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

      // delete all previously added classes
      if (eventList.result.items.length > 0) {
        const deletedIds = new Set<string>();
        const promises = eventList.result.items.map((event) => {
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
        });
        await Promise.all(promises);
      }
      const events = getCalendarEvents(
        'gcal',
        courses,
        curSeason,
        hiddenCourses,
      );
      const promises = events.map(async (event) => {
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
      });
      await Promise.all(promises);
      toast.success('Exported to Google Calendar!');
    } catch (e) {
      Sentry.captureException(
        new Error('[GCAL]: Error syncing user events', { cause: e }),
      );
      toast.error('Error exporting Google Calendar Events');
    } finally {
      setLoading(false);
    }
  }, [courses, gapi, curSeason, hiddenCourses]);

  useEffect(() => {
    if (!authInstance) {
      return;
    }
    if (authInstance.isSignedIn.get()) {
      setUser(authInstance.currentUser.get());
    } else {
      const signInButton = document.getElementById('auth');
      authInstance.attachClickHandler(
        signInButton,
        {},
        (googleUser) => {
          if (signInButton && signInButton.id == 'auth') {
            setUser(googleUser);
            syncEvents();
            signInButton.id = 'sync';
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
    }
  }, [authInstance, user, syncEvents]);

  return (
    <div
      id={user ? 'sync' : 'auth'}
      onClick={user && !loading ? syncEvents : undefined}
    >
      {loading ? (
        <Spinner animation="border" role="status" size="sm" />
      ) : (
        <img style={{ height: '2rem' }} src={GCalIcon} alt="" />
      )}
      &nbsp;&nbsp;Export to Google Calendar
    </div>
  );
}

export default GoogleCalendarButton;
