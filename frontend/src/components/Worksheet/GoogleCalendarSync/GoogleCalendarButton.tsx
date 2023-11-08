import React from 'react';
import { loadGapiInsideDOM, loadAuth2 } from 'gapi-script';
import { StyledBtn } from '../WorksheetCalendarList';
import { toast } from 'react-toastify';

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const GAPI_CLIENT_NAME = 'client:auth2';

import { Listing } from '../../Providers/FerryProvider';
import { Spinner } from 'react-bootstrap';
import { constructCalendarEvent } from './utils';

interface Props {
  courses: Listing[];
  season_code: string;
}

function GoogleCalendarButton({ courses, season_code }: Props): JSX.Element {
  const [gapi, setGapi] = React.useState<any>(null);
  const [authInstance, setAuthInstance] = React.useState<any>(null); // Hack - why is it never?
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Load gapi client after gapi script loaded
  const loadGapiClient = (gapiInstance: any) => {
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
  React.useEffect(() => {
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
  }, [gapi]);

  const syncEvents = React.useCallback(async () => {
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

  React.useEffect(() => {
    if (!authInstance) {
      return;
    }
    if (authInstance.isSignedIn.get()) {
      setUser(authInstance.currentUser.get());
    } else {
      const signInButton = document.getElementById('auth');
      authInstance.attachClickHandler(signInButton, {}, (googleUser: any) => {
        setUser(googleUser);
        syncEvents();
      });
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
    <>
      {user ? (
        <StyledBtn id="sync" onClick={syncEvents}>
          Sync with GCal
        </StyledBtn>
      ) : (
        <StyledBtn id="auth">Sync with GCal</StyledBtn>
      )}
    </>
  );
}

export default GoogleCalendarButton;
