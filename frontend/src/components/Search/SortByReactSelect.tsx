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

/**
 * Sorting select and toggle button
 */

const SortByReactSelect = () => {
  const { select_sortby, sort_order, setSelectSortby, setSortOrder } =
    useSearch();

  // Handle changing the sort order
  const handleSortOrder = () => {
    if (sort_order === 'asc') setSortOrder('desc');
    else setSortOrder('asc');
  };

  return (
    <>
      {/* Sort By Select */}
      <div className={styles.sortby_container}>
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
      {/* Toggle sort order button */}
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
