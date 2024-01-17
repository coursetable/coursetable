import React from 'react';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { useSearch, type Filters } from '../../contexts/searchContext';

const StyledCheck = styled(Form.Check)`
  margin: 0.25rem 0;
  user-select: none;
  width: 100%;
`;

const StyledInput = styled(Form.Check.Input)`
  cursor: pointer !important;
`;

const StyledLabel = styled(Form.Check.Label)`
  cursor: pointer !important;
`;

const labels = {
  searchDescription: 'Include descriptions in search',
  hideCancelled: 'Hide cancelled courses',
  hideConflicting: 'Hide courses with conflicting times',
  hideFirstYearSeminars: 'Hide first-year seminars',
  hideGraduateCourses: 'Hide graduate courses',
  hideDiscussionSections: 'Hide discussion sections',
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
    <StyledCheck type="switch">
      <StyledInput
        checked={filters[handle].value}
        onChange={() => {}} // Dummy handler to remove warning
      />
      <StyledLabel
        onClick={() => {
          filters[handle].set((x) => !x);
          setStartTime(Date.now());
        }}
      >
        {labels[handle]}
      </StyledLabel>
    </StyledCheck>
  );
}
