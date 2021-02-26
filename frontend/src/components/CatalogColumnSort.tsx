import React, { useEffect, useState } from 'react';

import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import styled, { useTheme } from 'styled-components';
import {
  useSearch,
  Option,
  defaultFilters,
  SortOrderType,
} from '../searchContext';

const StyledSortBtn = styled.div`
  cursor: pointer;
  border-radius: 4px;
  padding: 2px;
  &:hover {
    background-color: ${({ theme }) => theme.button_active};
  }
`;

type Props = {
  selectOption: Option;
};

/**
 * Renders column sort toggle button on catalog
 * @prop selectOption - sortbyOption from Constants to sort by
 */

const CatalogColumnSort: React.FC<Props> = ({ selectOption }) => {
  // Local sort order state
  const [localSortOrder, setLocalSortOrder] = useState<SortOrderType>(
    defaultFilters.defaultSortOrder
  );
  // First time state
  const [firstTime, setFirstTime] = useState(true);
  // Whether or not this toggle is actively sorting
  const [active, setActive] = useState(false);

  // Get search context data
  const {
    select_sortby,
    sort_order,
    setSelectSortby,
    setSortOrder,
  } = useSearch();

  const globalTheme = useTheme();

  // Handle changing the sort order
  const handleSortOrder = () => {
    // If not sorting by this option previously, start sorting this option
    if (select_sortby.value !== selectOption.value) {
      setSelectSortby(selectOption);
    } else {
      // Toggle sort order
      if (localSortOrder === 'asc') {
        setSortOrder('desc');
        setLocalSortOrder('desc');
      } else {
        setSortOrder('asc');
        setLocalSortOrder('asc');
      }
    }
  };

  // Handle active state and initial sort order
  useEffect(() => {
    if (firstTime && select_sortby.value === selectOption.value) {
      setLocalSortOrder(sort_order);
      setFirstTime(false);
      setActive(true);
    } else if (!active && select_sortby.value === selectOption.value) {
      setActive(true);
    } else if (active && select_sortby.value !== selectOption.value) {
      setActive(false);
    }
  }, [firstTime, selectOption, select_sortby, sort_order, active]);

  return (
    <>
      <StyledSortBtn
        style={{ backgroundColor: active ? globalTheme.select_hover : '' }}
        className="ml-1 my-auto"
        onClick={handleSortOrder}
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
      </StyledSortBtn>
    </>
  );
};

export default CatalogColumnSort;
