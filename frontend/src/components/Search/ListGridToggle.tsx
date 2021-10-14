import React from 'react';
import { FaBars, FaTh } from 'react-icons/fa';
import styled from 'styled-components';

const StyledToggle = styled.div`
  color: ${({ theme }) => theme.text[1]};
  padding: 7.5px;
  border-radius: 15px;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.select};
    color: ${({ theme }) => theme.primary};
  }
`;

/**
 * Toggle button between List and Grid view
 * @prop isList - boolean that holds current view
 * @prop setView - function to switch views
 */

const ListGridToggle: React.VFC<{
  isList: boolean;
  setView: (isList: any) => void;
}> = ({ isList, setView }) => {
  return (
    <StyledToggle
      className="d-flex ml-auto my-auto"
      onClick={() => setView(!isList)}
    >
      {!isList ? (
        <FaBars className="m-auto" size={15} />
      ) : (
        <FaTh className="m-auto" size={15} />
      )}
    </StyledToggle>
  );
};

export default ListGridToggle;
