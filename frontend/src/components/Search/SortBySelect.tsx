import React from 'react';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import styled from 'styled-components';
import clsx from 'clsx';
import styles from './SortBySelect.module.css';
import CustomSelect from './CustomSelect';
import {
  isOption,
  useSearch,
  sortByOptions,
} from '../../contexts/searchContext';

// Toggle sort order button
const StyledSortBtn = styled.div`
  &:hover {
    background-color: ${({ theme }) => theme.banner};
  }
`;

export default function SortBySelect() {
  const {
    filters: { selectSortBy, sortOrder },
  } = useSearch();

  return (
    <>
      {/* Sort By Select */}
      <div className={styles.sortByContainer}>
        <CustomSelect
          value={selectSortBy.value}
          options={Object.values(sortByOptions)}
          menuPortalTarget={document.body}
          onChange={(options): void => {
            if (isOption(options)) selectSortBy.set(options);
          }}
        />
      </div>
      {/* Toggle sort order button */}
      <StyledSortBtn
        className={clsx(styles.sortBtn, 'my-auto')}
        onClick={() => sortOrder.set((o) => (o === 'asc' ? 'desc' : 'asc'))}
      >
        {!selectSortBy.value.numeric ? (
          // Sorting by letters
          sortOrder.value === 'asc' ? (
            <FcAlphabeticalSortingAz className={styles.sortIcon} size={20} />
          ) : (
            <FcAlphabeticalSortingZa className={styles.sortIcon} size={20} />
          )
        ) : // Sorting by numbers
        sortOrder.value === 'asc' ? (
          <FcNumericalSorting12 className={styles.sortIcon} size={20} />
        ) : (
          <FcNumericalSorting21 className={styles.sortIcon} size={20} />
        )}
      </StyledSortBtn>
    </>
  );
}
