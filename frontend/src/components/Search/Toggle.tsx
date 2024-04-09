import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { IoFlaskOutline } from 'react-icons/io5';
import { useSearch, type Filters } from '../../contexts/searchContext';
import styles from './Toggle.module.css';

const labels = {
  searchDescription: 'Include descriptions in search',
  enableQuist: [
    // eslint-disable-next-line react/jsx-key
    <>
      Enable <IoFlaskOutline color="var(--color-primary)" />
      <Link to="/releases/quist">Quist</Link>
    </>,
    'Enable Quist',
  ],
  hideCancelled: 'Hide cancelled courses',
  hideConflicting: 'Hide courses with conflicting times',
  hideFirstYearSeminars: 'Hide first-year seminars',
  hideGraduateCourses: 'Hide graduate courses',
  hideDiscussionSections: 'Hide discussion sections',
} as const;

export default function Toggle({
  handle,
}: {
  readonly handle: {
    [K in keyof Filters]: Filters[K] extends boolean ? K : never;
  }[keyof Filters];
}) {
  const { filters, setStartTime } = useSearch();
  const label = labels[handle];
  return (
    <Form.Check type="switch" className={styles.check}>
      <Form.Check.Input
        aria-label={typeof label === 'string' ? label : label[1]}
        className={styles.input}
        checked={filters[handle].value}
        onChange={() => {}} // Dummy handler to remove warning
      />
      <Form.Check.Label
        className={styles.label}
        onClick={() => {
          filters[handle].set(!filters[handle].value);
          setStartTime(Date.now());
        }}
      >
        {typeof label === 'string' ? label : label[0]}
      </Form.Check.Label>
    </Form.Check>
  );
}
