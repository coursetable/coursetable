import React from 'react';
import { FaBars, FaTh } from 'react-icons/fa';
import styled from 'styled-components';

const StyledToggle = styled.div`
  color: ${({ theme }) => theme.text[1]};
  padding: 7.5px;
  border-radius: 15px;
  transition: color ${({ theme }) => theme.transDur};
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.select};
    color: ${({ theme }) => theme.primary};
  }
`;

/**
 * Toggle button between List and Grid view
 * @prop isListView - boolean that holds current view
 * @prop setIsListView - function to switch views
 */

function ListGridToggle({
  isListView,
  setIsListView,
}: {
  readonly isListView: boolean;
  readonly setIsListView: (isList: boolean) => void;
}) {
  return (
    <StyledToggle
      className="d-flex ml-auto my-auto"
      onClick={() => setIsListView(!isListView)}
    >
      {!isListView ? (
        <FaBars className="m-auto" size={15} />
      ) : (
        <FaTh className="m-auto" size={15} />
      )}
    </StyledToggle>
  );
}

export default ListGridToggle;
