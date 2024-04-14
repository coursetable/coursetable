import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import Authentication from '../images/authentication.svg';

import { API_ENDPOINT } from '../config';

function NeedsLogin({
  redirect,
  message,
}: {
  readonly redirect: string;
  readonly message: string;
}) {
  const { authStatus, user } = useUser();
  return (
    <div className="text-center py-5">
      <h3>No access</h3>
      <div>
        To access {message}, you need to be a fully verified user. Please{' '}
        {authStatus === 'unauthenticated' ? (
          <a
            href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}${redirect}`}
          >
            log in
          </a>
        ) : !user.hasEvals ? (
          <Link to="/challenge">complete the challenge</Link>
        ) : (
          <button type="button" onClick={() => window.location.reload()}>
            refresh the page
          </button>
        )}
        .
      </div>
      <img
        alt="Not logged in"
        className="py-5"
        src={Authentication}
        style={{ width: '25%' }}
      />
    </div>
  );
}

export default NeedsLogin;
