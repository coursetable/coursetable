import React, { useEffect, useState } from 'react';

import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import styled, { useTheme } from 'styled-components';
import type { SortByOption } from '../../utilities/constants';
import { useSearch, defaultFilters } from '../../contexts/searchContext';

const StyledSortBtn = styled.div`
  cursor: pointer;
  border-radius: 4px;
  padding: 2px;
  transition: background-color ${({ theme }) => theme.transDur};
  &:hover {
    background-color: ${({ theme }) => theme.buttonActive};
  }
`;

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
    filters: { selectSortby, sortOrder },
  } = useSearch();

  const globalTheme = useTheme();

  // Handle active state and initial sort order
  useEffect(() => {
    if (firstTime) {
      if (selectSortby.value.value === selectOption.value) {
        setLocalSortOrder(sortOrder.value);
        setActive(true);
      }
      setFirstTime(false);
    } else if (!active && selectSortby.value.value === selectOption.value) {
      setActive(true);
    } else if (active && selectSortby.value.value !== selectOption.value) {
      setActive(false);
    }
  }, [firstTime, selectOption, selectSortby, sortOrder, active]);

  return (
    <StyledSortBtn
      style={{ backgroundColor: active ? globalTheme.selectHover : '' }}
      className="ml-1 my-auto"
      onClick={() => {
        // If not sorting by this option previously, start sorting this option
        if (selectSortby.value.value !== selectOption.value) {
          selectSortby.set(selectOption);
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
    </StyledSortBtn>
  );
}

export default ResultsColumnSort;
