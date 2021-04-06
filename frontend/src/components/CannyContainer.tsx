/* eslint-disable */
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CannyBoard from './CannyBoard';

export const boards = {
  features: {
    value: 'features',
    label: 'Feature requests',
    token: '1ce2e740-4310-1893-6927-1e2edad7785e',
  },
  bugs: {
    value: 'bugs',
    label: 'Bugs',
    token: 'e550a33f-5bad-b6e4-14c4-67875166064c',
  },
};

const CannyContainer: React.VFC = () => {
  return (
    <div className="min-vh-100 m-4">
      <div
        className="btn-group mb-4"
        role="group"
        aria-label="Select feedback board"
      >
        {Object.entries(boards).map(([boardName, board]) => (
          // use HTML links instead of react-router ones to force the Canny widget to reload
          <a href={`/feedback/${boardName}`}>
            <button
              type="button"
              className="btn btn-secondary mr-2"
              key={board.token}
            >
              {board.label}
            </button>
          </a>
        ))}
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

export default CannyContainer;
