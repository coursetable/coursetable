/* eslint-disable */
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import CannyBoard, { boards } from './canny/CannyBoard';

import Authentication from '../images/authentication.svg';
import { API_ENDPOINT } from '../config';
import { useUser } from '../user';

const Canny: React.VFC = () => {
  // User context data
  const { user } = useUser();

  // Determine if user is logged in
  const isLoggedIn = Boolean(user.worksheet != null);

  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <div className="text-center py-5">
        <h3>
          Please{' '}
          <a
            href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/feedback`}
          >
            log in
          </a>
        </h3>
        <div>A valid Yale NetID is required to view and submit feedback.</div>
        <img
          alt="Not logged in"
          className="py-5"
          src={Authentication}
          style={{ width: '25%' }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 m-4 p-4 bg-light"
      style={{ borderRadius: '16px' }}
    >
      <div
        className="btn-group mb-4"
        role="group"
        aria-label="Select feedback board"
      >
        {Object.entries(boards).map(([boardName, board]) => {
          let isActive = [
            `/feedback/${boardName}/`,
            `/feedback/${boardName}`,
          ].includes(location.pathname);

          // highlight default board
          if (boardName === 'features') {
            isActive =
              isActive ||
              [`/feedback/`, `/feedback`].includes(location.pathname);
          }

          return (
            // use HTML links instead of react-router ones to force the Canny widget to reload
            <a
              role="button"
              className={`btn  ${
                isActive ? 'btn-primary' : 'btn-outline-primary'
              }`}
              key={board.token}
              href={`/feedback/${boardName}`}
            >
              {board.label}
            </a>
          );
        })}
      </div>
      <Switch>
        {Object.entries(boards).map(([boardName, board]) => (
          <Route
            exact
            path={`/feedback/${boardName}`}
            render={(props) => <CannyBoard board={board} />}
          />
        ))}
        {/* Fallback route */}
        <Route
          exact
          path={`/feedback`}
          render={(props) => <CannyBoard board={boards.features} />}
        />
      </Switch>
    </div>
  );
};

export default Canny;
