import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { IoFlaskOutline } from 'react-icons/io5';
import {
  useSearch,
  filterLabels,
  type BooleanFilters,
} from '../../contexts/searchContext';
import styles from './Toggle.module.css';

export default function Toggle<K extends BooleanFilters>({
  handle: handleName,
}: {
  readonly handle: K;
}) {
  const { filters, setStartTime } = useSearch();
  const label = filterLabels[handleName];
  const handle = filters[handleName];
  return (
    <Form.Check type="switch" className={styles.check}>
      <Form.Check.Input
        aria-label={label}
        className={styles.input}
        checked={handle.value}
        onChange={() => {
          handle.set(!handle.value);
          setStartTime(Date.now());
        }}
      />
      <Form.Check.Label
        className={styles.label}
        onClick={() => {
          handle.set(!handle.value);
          setStartTime(Date.now());
        }}
      >
        {handleName === 'enableQuist' ? (
          <>
            Enable <IoFlaskOutline color="var(--color-primary)" />
            <Link to="/releases/quist">Quist</Link>
          </>
        ) : (
          filterLabels[handleName]
        )}
      </Form.Check.Label>
    </Form.Check>
  );
}
