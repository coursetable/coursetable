import React, { useState, useEffect, useCallback } from 'react';
import { loadGapiInsideDOM, loadAuth2 } from 'gapi-script';
import * as Sentry from '@sentry/react';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { StyledBtn } from '../WorksheetCalendarList';
import { Listing } from '../../Providers/FerryProvider';
import { constructCalendarEvent } from './utils';
import { FcGoogle } from 'react-icons/fc';

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const GAPI_CLIENT_NAME = 'client:auth2';

function GoogleCalendarButton({
  courses,
  season_code,
}: {
  courses: Listing[];
  season_code: string;
}): JSX.Element {
  const [gapi, setGapi] = useState<typeof globalThis.gapi | null>(null);
  const [authInstance, setAuthInstance] =
    useState<gapi.auth2.GoogleAuthBase | null>(null);
  const [user, setUser] = useState<gapi.auth2.GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);

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
      Sentry.captureException('gapi not loaded');
      return;
    }
    setLoading(true);

    try {
      // get all previously added classes
      const event_list = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin:
          season_code === '202303'
            ? new Date('2023-08-30').toISOString()
            : new Date('2024-01-16').toISOString(),
        timeMax:
          season_code === '202303'
            ? new Date('2023-09-06').toISOString()
            : new Date('2024-01-23').toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      // delete all previously added classes
      if (event_list.result.items.length > 0) {
        const deletedIds = new Set<string>();
        event_list.result.items.forEach(async (event: any) => {
          if (event.id.startsWith('coursetable')) {
            if (!deletedIds.has(event.recurringEventId)) {
              deletedIds.add(event.recurringEventId);
              await gapi.client.calendar.events.delete({
                calendarId: 'primary',
                eventId: event.recurringEventId,
              });
            }
          }
        });
      }
    } catch (e) {
      console.error('Error syncing user events: ', event);
      console.error(e);
    }

    // add new classes
    if (courses.length > 0) {
      courses.forEach(async (course, colorIndex) => {
        const event = constructCalendarEvent(course, colorIndex);
        if (!event) {
          return;
        }
        try {
          await gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
          });
        } catch (e) {
          console.error('Error adding events to user calendar: ', event);
          console.error(e);
        }
      });
    }

    setLoading(false);
    toast.success('Synced with Google Calendar!');
  }, [courses, gapi, season_code]);

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
          setUser(googleUser);
          syncEvents();
        },
        Sentry.captureException,
      );
    }
  }, [authInstance, user, syncEvents]);

  if (loading) {
    return (
      <StyledBtn>
        <Spinner animation="border" role="status" size="sm" />
      </StyledBtn>
    );
  }

  return (
    <StyledBtn
      id={user ? 'sync' : 'auth'}
      onClick={user ? syncEvents : undefined}
    >
			<FcGoogle className="my-auto pr-2" size={26} />
      Sync with GCal
    </StyledBtn>
  );
}

export default GoogleCalendarButton;
