import React, { useState } from 'react';
import clsx from 'clsx';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import { useSearch, type SortByOption } from '../../contexts/searchContext';
import styles from './ResultsColumnSort.module.css';

function ResultsColumnSort({
  selectOption,
  renderActive = true,
}: {
  readonly selectOption: SortByOption;
  readonly renderActive?: boolean;
}) {
  const {
    filters: { selectSortBy, sortOrder },
  } = useSearch();
  const isActive = selectSortBy.value.value === selectOption.value;
  const [localSortOrder, setLocalSortOrder] = useState(
    isActive ? sortOrder.value : 'asc',
  );
  const Icon = selectOption.numeric
    ? localSortOrder === 'asc'
      ? FcNumericalSorting12
      : FcNumericalSorting21
    : localSortOrder === 'asc'
      ? FcAlphabeticalSortingAz
      : FcAlphabeticalSortingZa;

  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        'ms-1 my-auto',
        renderActive && isActive && styles.buttonActive,
      )}
      onClick={() => {
        // If not sorting by this option previously, start sorting this option
        if (!isActive) {
          selectSortBy.set(selectOption);
          sortOrder.set(localSortOrder);
          return;
        }
        if (localSortOrder === 'asc') {
          sortOrder.set('desc');
          setLocalSortOrder('desc');
        } else {
          sortOrder.set('asc');
          setLocalSortOrder('asc');
        }
      }}
      aria-label={`${selectOption.label} ${localSortOrder === 'asc' ? 'ascending' : 'descending'}`}
    >
      <Icon className="d-block" size={20} />
    </button>
  );
}

export default ResultsColumnSort;
