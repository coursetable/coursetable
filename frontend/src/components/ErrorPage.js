import React from 'react';

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
        Please file a <NavLink to="/feedback">report</NavLink> to let us know
      </div>
    </div>
  );
}

export default ErrorPage;
