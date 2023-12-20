import React from 'react';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import styled from 'styled-components';
import { sortbyOptions } from '../../queries/Constants';
import styles from './SortbyReactSelect.module.css';
import CustomSelect from '../CustomSelect';
import { useSearch } from '../../contexts/searchContext';

// Toggle sort order button
const StyledSortBtn = styled.div`
  &:hover {
    background-color: ${({ theme }) => theme.banner};
  }
`;

function SortByReactSelect() {
  const { selectSortby, sortOrder, setSelectSortby, setSortOrder } =
    useSearch();

  return (
    <>
      {/* Sort By Select */}
      <div className={styles.sortby_container}>
        <CustomSelect
          value={selectSortby}
          options={sortbyOptions}
          menuPortalTarget={document.body}
          onChange={(options) => {
            if (options && 'value' in options) {
              setSelectSortby(options);
            }
          }}
        />
      </div>
      {/* Toggle sort order button */}
      <StyledSortBtn
        className={`${styles.sort_btn} my-auto`}
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        {!selectSortby.numeric ? (
          // Sorting by letters
          sortOrder === 'asc' ? (
            <FcAlphabeticalSortingAz className={styles.sort_icon} size={20} />
          ) : (
            <FcAlphabeticalSortingZa className={styles.sort_icon} size={20} />
          )
        ) : // Sorting by numbers
        sortOrder === 'asc' ? (
          <FcNumericalSorting12 className={styles.sort_icon} size={20} />
        ) : (
          <FcNumericalSorting21 className={styles.sort_icon} size={20} />
        )}
      </StyledSortBtn>
    </>
  );
}

export default SortByReactSelect;
