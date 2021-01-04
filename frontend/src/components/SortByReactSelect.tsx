import React, { useEffect } from 'react';

import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import styled from 'styled-components';
import { sortbyOptions, SortKeys } from '../queries/Constants';
import styles from './SortbyReactSelect.module.css';
import search_styles from '../pages/Search.module.css';
import CustomSelect from './CustomSelect';
import { useSessionStorageState } from '../browserStorage';

const StyledSortBtn = styled.div`
  &:hover {
    background-color: ${({ theme }) => theme.banner};
  }
`;

/**
 * Render expanded worksheet list after maximize button is clicked
 * @prop setOrdering - function to set ordering of courses
 */

const SortByReactSelect = ({
  setOrdering,
}: {
  setOrdering: (
    ordering: {
      [key in SortKeys]?: 'asc' | 'desc';
    }
  ) => void;
}) => {
  // State that controls sortby select
  const [select_sortby, setSelectSortby] = useSessionStorageState<
    typeof sortbyOptions[number]
  >('select_sortby', sortbyOptions[0]);
  // State that determines sort order
  const [sort_order, setSortOrder] = useSessionStorageState<'asc' | 'desc'>(
    'sort_order',
    'asc'
  );

  // Handle changing the sort order
  const handleSortOrder = () => {
    if (sort_order === 'asc') setSortOrder('desc');
    else setSortOrder('asc');
  };

  // Set ordering in parent element whenever sortby or order changes
  useEffect(() => {
    const sortParams = select_sortby.value;
    const ordering: {
      [key in SortKeys]?: 'asc' | 'desc';
    } = {
      [sortParams]: sort_order,
    };
    setOrdering(ordering);
  }, [select_sortby, sort_order, setOrdering]);

  return (
    <>
      <div className={styles.sortby_container}>
        {/* Sort By Select */}
        <CustomSelect
          value={select_sortby}
          options={sortbyOptions}
          menuPortalTarget={document.body}
          onChange={(options) => {
            if (options && 'value' in options) {
              setSelectSortby(options);
            }
          }}
        />
      </div>
      <StyledSortBtn
        className={`${search_styles.sort_btn} my-auto`}
        onClick={handleSortOrder}
      >
        {!select_sortby.numeric ? (
          // Sorting by letters
          sort_order === 'asc' ? (
            <FcAlphabeticalSortingAz
              className={search_styles.sort_icon}
              size={20}
            />
          ) : (
            <FcAlphabeticalSortingZa
              className={search_styles.sort_icon}
              size={20}
            />
          )
        ) : // Sorting by numbers
        sort_order === 'asc' ? (
          <FcNumericalSorting12 className={search_styles.sort_icon} size={20} />
        ) : (
          <FcNumericalSorting21 className={search_styles.sort_icon} size={20} />
        )}
      </StyledSortBtn>
    </>
  );
};

export default SortByReactSelect;
