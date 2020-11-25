import React from 'react';
import ServerError from '../images/server_error.svg';

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="text-center m-auto">
      <h3>{message}</h3>
      <div>
        Please file a{' '}
        <a target="_blank" href="/feedback">
          report
        </a>{' '}
        to let us know. You can also{' '}
        <a href="#!" onClick={() => window.location.reload()}>
          reload the page
        </a>{' '}
        to try again.
      </div>
      <img
        alt="Error"
        className="py-5"
        src={ServerError}
        style={{ width: '25%' }}
      ></img>
    </div>
  );
}

export default ErrorPage;
