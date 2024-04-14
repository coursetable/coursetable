import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function LoadSpinner() {
  return (
    <div className="d-flex justify-content-center">
      <Spinner className="m-auto" animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
}
