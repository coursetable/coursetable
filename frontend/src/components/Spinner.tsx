import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Spinner } from 'react-bootstrap';

const delay = 300;

export default function LoadSpinner(
  props: React.ComponentProps<typeof Spinner> & {
    readonly message: string | undefined;
  },
) {
  // Optimization: avoid showing a spinner if the content can be loaded quickly
  // This makes the UI feel more responsive
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    timer.current = setTimeout(() => setShow(true), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  });
  if (!show) return null;
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
