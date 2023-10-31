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
}

function GoogleCalendarButton({ courses }: Props): JSX.Element {
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
      let newGapi = await loadGapiInsideDOM();
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
  }, [authInstance, user]);

  const syncEvents = () => {
    setLoading(true);
    courses.forEach(async (course, colorIndex) => {
      const event = constructCalendarEvent(course, colorIndex);
      try {
        await gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        });
      } catch (e) {
        console.error('Error syncing event: ', event);
        console.error(e);
      }
    });
    setLoading(false);
    toast.success('Synced with Google Calendar!');
  };

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
