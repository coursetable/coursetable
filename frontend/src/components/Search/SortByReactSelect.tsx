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
import search_styles from '../../pages/Search.module.css';
import CustomSelect from '../CustomSelect';
import { useSearch } from '../../contexts/searchContext';

// Toggle sort order button
const StyledSortBtn = styled.div`
  &:hover {
    background-color: ${({ theme }) => theme.banner};
  }
`;

function SortByReactSelect() {
  const { selectSortBy, sortOrder, setSelectSortby, setSortOrder } =
    useSearch();

  return (
    <>
      {/* Sort By Select */}
      <div className={styles.sortby_container}>
        <CustomSelect
          value={selectSortBy}
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
        className={`${search_styles.sort_btn} my-auto`}
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        {!selectSortBy.numeric ? (
          // Sorting by letters
          sortOrder === 'asc' ? (
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
        sortOrder === 'asc' ? (
          <FcNumericalSorting12 className={search_styles.sort_icon} size={20} />
        ) : (
          <FcNumericalSorting21 className={search_styles.sort_icon} size={20} />
        )}
      </StyledSortBtn>
    </>
  );
}

export default SortByReactSelect;
