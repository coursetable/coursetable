import { useState } from 'react';
import clsx from 'clsx';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import {
  useSearch,
  type Option,
  type SortKeys,
} from '../../contexts/searchContext';
import styles from './ResultsColumnSort.module.css';

const isNumeric: { [key in SortKeys]: boolean } = {
  course_code: false,
  title: false,
  friend: true,
  overall: true,
  average_professor_rating: true,
  workload: true,
  average_gut_rating: true,
  enrollment: true,
  time: true,
  locations_summary: false,
};

function ResultsColumnSort({
  selectOption,
  renderActive = true,
}: {
  readonly selectOption: Option<SortKeys>;
  readonly renderActive?: boolean;
}) {
  const {
    filters: { selectSortBy, sortOrder },
  } = useSearch();
  const isActive = selectSortBy.value.value === selectOption.value;
  const [localSortOrder, setLocalSortOrder] = useState(
    isActive ? sortOrder.value : 'asc',
  );
  // eslint-disable-next-line no-useless-assignment
  const Icon = isNumeric[selectOption.value]
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
