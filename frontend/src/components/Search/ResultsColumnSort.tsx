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

type Props = {
  readonly selectOption: SortByOption;
};

/**
 * Renders column sort toggle button for results
 * @prop selectOption - sortbyOption from Constants to sort by
 */

function ResultsColumnSort({ selectOption }: Props) {
  // Local sort order state
  const [localSortOrder, setLocalSortOrder] = useState(
    defaultFilters.sortOrder,
  );
  // First time state
  const [firstTime, setFirstTime] = useState(true);
  // Whether or not this toggle is actively sorting
  const [active, setActive] = useState(false);

  // Get search context data
  const {
    filters: { selectSortBy, sortOrder },
  } = useSearch();

  // Handle active state and initial sort order
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
    // TODO
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(
        styles.button,
        'ml-1 my-auto',
        active && styles.buttonActive,
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
    >
      {!selectOption.numeric ? (
        // Sorting by letters
        localSortOrder === 'asc' ? (
          <FcAlphabeticalSortingAz className="d-block" size={20} />
        ) : (
          <FcAlphabeticalSortingZa className="d-block" size={20} />
        )
      ) : // Sorting by numbers
      localSortOrder === 'asc' ? (
        <FcNumericalSorting12 className="d-block" size={20} />
      ) : (
        <FcNumericalSorting21 className="d-block" size={20} />
      )}
    </div>
  );
}

export default ResultsColumnSort;
