import React from 'react';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import clsx from 'clsx';
import styles from './SortBySelect.module.css';
import CustomSelect from './CustomSelect';
import {
  isOption,
  useSearch,
  sortByOptions,
} from '../../contexts/searchContext';

export default function SortBySelect() {
  const {
    filters: { selectSortBy, sortOrder },
  } = useSearch();

  return (
    <>
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
      <button
        type="button"
        className={clsx(styles.sortBtn, 'my-auto')}
        onClick={() => sortOrder.set((o) => (o === 'asc' ? 'desc' : 'asc'))}
      >
        {!selectSortBy.value.numeric ? (
          sortOrder.value === 'asc' ? (
            <FcAlphabeticalSortingAz className={styles.sortIcon} size={20} />
          ) : (
            <FcAlphabeticalSortingZa className={styles.sortIcon} size={20} />
          )
        ) : sortOrder.value === 'asc' ? (
          <FcNumericalSorting12 className={styles.sortIcon} size={20} />
        ) : (
          <FcNumericalSorting21 className={styles.sortIcon} size={20} />
        )}
      </button>
    </>
  );
}
