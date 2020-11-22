import React from 'react';
import ServerError from '../images/server_error.svg';

function ErrorPage({ message }) {
  return (
    <div className="text-center m-auto">
      <img
        alt="Error"
        className="py-5"
        src={ServerError}
        style={{ width: '25%' }}
      ></img>
      <h3>{message}</h3>
      <div>
        Please file a{' '}
        <a target="_blank" href="/feedback">
          report
        </a>{' '}
        to let us know. You can also{' '}
        {/* Reload logic via https://stackoverflow.com/a/23680265/5004662. */}
        <a href="" onClick={() => window.location.reload()}>
          reload the page
        </a>{' '}
        to try again.
      </div>
    </div>
  );
}

export default ErrorPage;
