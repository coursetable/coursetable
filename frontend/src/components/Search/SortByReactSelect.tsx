import React from 'react';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import styled from 'styled-components';
import clsx from 'clsx';
import { sortbyOptions } from '../../utilities/constants';
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
  const {
    filters: { selectSortby, sortOrder },
  } = useSearch();

  return (
    <>
      {/* Sort By Select */}
      <div className={styles.sortby_container}>
        <CustomSelect
          value={selectSortby.value}
          options={sortbyOptions}
          menuPortalTarget={document.body}
          onChange={(options) => {
            if (options && 'value' in options) selectSortby.set(options);
          }}
        />
      </div>
      {/* Toggle sort order button */}
      <StyledSortBtn
        className={clsx(styles.sort_btn, 'my-auto')}
        onClick={() => sortOrder.set((o) => (o === 'asc' ? 'desc' : 'asc'))}
      >
        {!selectSortby.value.numeric ? (
          // Sorting by letters
          sortOrder.value === 'asc' ? (
            <FcAlphabeticalSortingAz className={styles.sort_icon} size={20} />
          ) : (
            <FcAlphabeticalSortingZa className={styles.sort_icon} size={20} />
          )
        ) : // Sorting by numbers
        sortOrder.value === 'asc' ? (
          <FcNumericalSorting12 className={styles.sort_icon} size={20} />
        ) : (
          <FcNumericalSorting21 className={styles.sort_icon} size={20} />
        )}
      </StyledSortBtn>
    </>
  );
}

export default SortByReactSelect;
