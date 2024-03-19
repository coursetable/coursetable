import React from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { IoFlaskOutline } from 'react-icons/io5';
import { useSearch, type Filters } from '../../contexts/searchContext';
import styles from './Toggle.module.css';

const labels = {
  searchDescription: 'Include descriptions in search',
  enableQuist: (
    <>
      Enable <IoFlaskOutline color="var(--color-primary-hover)" />
      <Link to="/releases/quist">Quist</Link>
    </>
  ),
  hideCancelled: 'Hide cancelled courses',
  hideConflicting: 'Hide courses with conflicting times',
  hideFirstYearSeminars: 'Hide first-year seminars',
  hideGraduateCourses: 'Hide graduate courses',
  hideDiscussionSections: 'Hide discussion sections',
  justFirstYearSeminars: 'Just first-year seminars',
  justGraduateCourses: 'Just graduate courses',
  justDiscussionSections: 'Just discussion sections',
};

export default function Toggle({
  handle,
}: {
  readonly handle: {
    [K in keyof Filters]: Filters[K] extends boolean ? K : never;
  }[keyof Filters];
}) {
  const { filters, setStartTime } = useSearch();
  return (
    <Form.Check type="switch" className={styles.check}>
      <Form.Check.Input
        className={styles.input}
        checked={filters[handle].value}
        onChange={() => {}} // Dummy handler to remove warning
      />
      <Form.Check.Label
        className={styles.label}
        onClick={() => {
          filters[handle].set((x) => !x);
          setStartTime(Date.now());
        }}
      >
        {labels[handle]}
      </Form.Check.Label>
    </Form.Check>
  );
}
