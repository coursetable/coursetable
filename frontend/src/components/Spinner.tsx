import React from 'react';
import clsx from 'clsx';
import { Spinner } from 'react-bootstrap';

export default function LoadSpinner(
  props: React.ComponentProps<typeof Spinner> & {
    readonly message: string | undefined;
  },
) {
  const spinner = (
    // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
    <Spinner
      {...props}
      className={clsx(props.className, 'm-auto')}
      animation="border"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
  if (!props.message) return spinner;
  return (
    <div className="d-flex justify-content-center flex-column">
      {spinner}
      <p className="text-center mt-3">{props.message}</p>
    </div>
  );
}
