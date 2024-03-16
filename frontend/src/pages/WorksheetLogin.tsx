import React from 'react';
import Authentication from '../images/authentication.svg';

import { API_ENDPOINT } from '../config';

function WorksheetLogin() {
  return (
    <div className="text-center py-5">
      <h3>
        Please{' '}
        <a
          href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/worksheet`}
        >
          log in
        </a>
      </h3>
      <div>A valid Yale NetID is required to access worksheet information.</div>
      <img
        alt="Not logged in"
        className="py-5"
        src={Authentication}
        style={{ width: '25%' }}
      />
    </div>
  );
}

export default WorksheetLogin;
