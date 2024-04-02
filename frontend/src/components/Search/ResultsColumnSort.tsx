import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import {
  useSearch,
  defaultFilters,
  type SortByOption,
} from '../../contexts/searchContext';
import styles from './ResultsColumnSort.module.css';

function ResultsColumnSort({
  selectOption,
  renderActive = true,
}: {
  readonly selectOption: SortByOption;
  readonly renderActive?: boolean;
}) {
  const [localSortOrder, setLocalSortOrder] = useState(
    defaultFilters.sortOrder,
  );
  const [firstTime, setFirstTime] = useState(true);
  const [active, setActive] = useState(false);

  const {
    filters: { selectSortBy, sortOrder },
  } = useSearch();

  useEffect(() => {
    if (firstTime) {
      if (selectSortBy.value.value === selectOption.value) {
        setLocalSortOrder(sortOrder.value);
        setActive(true);
      }
      setFirstTime(false);
    } else if (!active && selectSortBy.value.value === selectOption.value) {
      setActive(true);
    } else if (active && selectSortBy.value.value !== selectOption.value) {
      setActive(false);
    }
  }, [firstTime, selectOption, selectSortBy, sortOrder, active]);

  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        'ml-1 my-auto',
        renderActive && active && styles.buttonActive,
      )}
      onClick={() => {
        // If not sorting by this option previously, start sorting this option
        if (selectSortBy.value.value !== selectOption.value) {
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
      {!selectOption.numeric ? (
        localSortOrder === 'asc' ? (
          <FcAlphabeticalSortingAz className="d-block" size={20} />
        ) : (
          <FcAlphabeticalSortingZa className="d-block" size={20} />
        )
      ) : localSortOrder === 'asc' ? (
        <FcNumericalSorting12 className="d-block" size={20} />
      ) : (
        <FcNumericalSorting21 className="d-block" size={20} />
      )}
    </button>
  );
}

export default ResultsColumnSort;
