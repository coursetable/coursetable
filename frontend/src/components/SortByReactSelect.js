import React, { useState, useEffect } from 'react';

import { sortbyOptions } from '../queries/Constants';
import styles from './SortbyReactSelect.module.css';
import search_styles from '../pages/Search.module.css';
import CustomSelect from './CustomSelect';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import styled from 'styled-components';

const StyledSortBtn = styled.div`
  &:hover {
    background-color: ${({ theme }) => theme.banner};
  }
`;

/**
 * Render expanded worksheet list after maximize button is clicked
 * @prop setOrdering - function to set ordering of courses
 */

const SortByReactSelect = ({ setOrdering }) => {
  // State that controls sortby select
  const [select_sortby, setSelectSortby] = useState(sortbyOptions[0]);
  // State that determines sort order
  const [sort_order, setSortOrder] = useState('asc');

  // Handle changing the sort order
  const handleSortOrder = () => {
    if (sort_order === 'asc') setSortOrder('desc');
    else setSortOrder('asc');
  };

  // Set ordering in parent element whenever sortby or order changes
  useEffect(() => {
    let sortParams = select_sortby.value;
    let ordering = null;
    if (sortParams === 'course_code') {
      ordering = { course_code: sort_order };
    } else if (sortParams === 'course_title') ordering = { title: sort_order };
    else if (sortParams === 'course_number') ordering = { number: sort_order };
    else if (sortParams === 'rating') ordering = { average_rating: sort_order };
    else if (sortParams === 'workload')
      ordering = { average_workload: sort_order };
    else if (sortParams === 'professor')
      ordering = { average_professor: `${sort_order}_nulls_last` };
    else if (sortParams === 'gut')
      ordering = { average_gut_rating: `${sort_order}_nulls_last` };
    else console.error('unknown sort order - ', sortParams);
    setOrdering(ordering);
  }, [select_sortby, sort_order]);

  return (
    <>
      <div className={`${styles.sortby_container}`}>
        {/* Sort By Select */}
        <CustomSelect
          value={select_sortby}
          options={sortbyOptions}
          menuPortalTarget={document.body}
          onChange={(options) => {
            setSelectSortby(options);
          }}
        />
      </div>
      <StyledSortBtn
        className={search_styles.sort_btn + ' my-auto'}
        onClick={handleSortOrder}
      >
        {select_sortby.value === 'course_code' ||
        select_sortby.value === 'course_title' ? (
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
