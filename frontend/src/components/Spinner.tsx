import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function LoadSpinner() {
  return (
    <div className="d-flex justify-content-center">
      <Spinner className="m-auto" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
