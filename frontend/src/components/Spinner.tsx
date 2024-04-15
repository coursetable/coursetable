import React from 'react';
import clsx from 'clsx';
import { Spinner } from 'react-bootstrap';

export default function LoadSpinner(
  props: React.ComponentProps<typeof Spinner>,
) {
  return (
    <div className="d-flex justify-content-center">
      <Spinner
        {...props}
        className={clsx(props.className, 'm-auto')}
        animation="border"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
