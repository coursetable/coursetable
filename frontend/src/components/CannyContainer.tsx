/* eslint-disable */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import CannyBoard from './CannyBoard';

const boards = {
  features: {
    label: 'Feature requests',
    token: '1ce2e740-4310-1893-6927-1e2edad7785e',
  },
  bugs: { label: 'Bugs', token: 'e550a33f-5bad-b6e4-14c4-67875166064c' },
};

const CannyContainer: React.VFC = () => {
  const [selectedBoard, setSelectedBoard] = useState(boards.features);

  const params = useParams();

  console.log(params);

  return (
    <div className="m-4">
      <div
        className="btn-group mb-4"
        role="group"
        aria-label="Select feedback board"
      >
        {Object.entries(boards).map(([_, board]) => (
          <button
            type="button"
            className="btn btn-secondary"
            key={board.token}
            onClick={() => {
              setSelectedBoard(board);
            }}
          >
            {board.label}
          </button>
        ))}
      </div>
      <CannyBoard boardToken={selectedBoard.token} />
    </div>
  );
};

export default CannyContainer;
