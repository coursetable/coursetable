import React, { useMemo } from 'react';
import { Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { ValueType } from 'react-select/src/types';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

// import { sortbyOptions } from '../queries/Constants';
import { isOption, Option } from '../../contexts/searchContext';
import { breakpoints } from '../../utilities';
import { useWorksheet } from '../../contexts/worksheetContext';
import { toSeasonString } from '../../utilities/courseUtilities';
import { useUser } from '../../contexts/userContext';
import FBLoginButton from './FBLoginButton';
import { FaFacebookSquare } from 'react-icons/fa';
import { useWindowDimensions } from '../Providers/WindowDimensionsProvider';
// Row in navbar search
const StyledRow = styled(Row)`
  width: auto;
  margin-left: auto;
  margin-right: auto;
`;

// Filter group wrapper
const FilterGroup = styled.div``;

// Toggle button group
const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{
  isTablet: boolean;
}>`
  width: ${({ isTablet }) => (isTablet ? 140 : 180)}px;
`;

// Toggle button
const StyledToggleButton = styled(ToggleButton)`
  box-shadow: none !important;
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
  background-color: ${({ theme }) => theme.surface[0]};
  color: ${({ theme }) => theme.text[0]};
  border: ${({ theme }) => theme.icon} 2px solid;
  transition:
    border-color ${({ theme }) => theme.trans_dur},
    background-color ${({ theme }) => theme.trans_dur},
    color ${({ theme }) => theme.trans_dur};
  padding: 0.25rem 0;
  width: 50%;

  &:hover {
    background-color: ${({ theme }) => theme.button_hover};
    color: ${({ theme }) => theme.text[0]};
    border: ${({ theme }) => theme.primary_hover} 2px solid;
  }

  &:active {
    background-color: ${({ theme }) => theme.button_active}!important;
    color: ${({ theme }) => theme.text[0]}!important;
  }

  &:focus {
    box-shadow: none !important;
  }

  &.active {
    background-color: ${({ theme }) => theme.primary_hover}!important;
    border-color: ${({ theme }) => theme.primary_hover}!important;
  }
`;

/**
 * Worksheet search form for the desktop in the navbar
 */
export function NavbarWorksheetSearch() {
  // Get search context data
  // const { } = useSearch();

  const {
    seasonOptions,
    curSeason,
    changeSeason,
    changeWorksheet,
    worksheetNumber,
    fbPerson,
    handleFBPersonChange,
    worksheetView,
    handleWorksheetView,
  } = useWorksheet();

  const worksheetOptions = useMemo(
    () => [
      { value: '0', label: 'Main Worksheet' },
      { value: '1', label: 'Worksheet 1' },
      { value: '2', label: 'Worksheet 2' },
      { value: '3', label: 'Worksheet 3' },
    ],
    [],
  );

  const selectedSeason = useMemo(() => {
    if (curSeason) {
      return {
        value: curSeason,
        label: toSeasonString(curSeason)[0],
      };
    }
    return null;
  }, [curSeason]);

  const selectedWorksheet = useMemo(() => {
    if (worksheetNumber) {
      return {
        value: worksheetNumber,
        label:
          worksheetNumber === '0'
            ? 'Main Worksheet'
            : `Worksheet ${worksheetNumber}`,
      };
    }
    return null;
  }, [worksheetNumber]);

  // Fetch user context data
  const { user } = useUser();

  // FB Friends names
  const friendInfo = useMemo(
    () => (user.fbLogin && user.fbWorksheets?.friendInfo) || {},
    [user.fbLogin, user.fbWorksheets],
  );

  // List of FB friend options. Initialize with me option
  const friendOptions = useMemo(() => {
    const tempFriendOptions = [];
    // Add FB friend to dropdown if they have worksheet courses in the current season
    for (const friend of Object.keys(friendInfo)) {
      tempFriendOptions.push({
        value: friend,
        label: friendInfo[friend].name,
      });
    }
    // Sort FB friends in alphabetical order
    tempFriendOptions.sort((a, b) =>
      a.label.toLowerCase().localeCompare(b.label.toLowerCase(), 'en-US'),
    );
    return tempFriendOptions;
  }, [friendInfo]);

  const selectedFb = useMemo(() => {
    if (!user.fbLogin) {
      return {
        value: fbPerson,
        label: 'Connect FB',
      };
    }
    if (fbPerson === 'me') {
      return null;
    }
    return {
      value: fbPerson,
      label: friendInfo[fbPerson].name,
    };
  }, [user.fbLogin, fbPerson, friendInfo]);

  const { isTablet } = useWindowDimensions();

  return (
    <>
      {/* Filters Form */}
      <Form className="px-0" data-tutorial="">
        <StyledRow>
          <FilterGroup className="d-flex align-items-center">
            {/* Worksheet View Toggle */}
            <StyledToggleButtonGroup
              name="worksheet-view-toggle"
              type="radio"
              value={
                worksheetView.view === 'expanded calendar'
                  ? 'calendar'
                  : worksheetView.view
              }
              onChange={(val: string) =>
                handleWorksheetView({ view: val, mode: '' })
              }
              className="ml-2 mr-3"
              data-tutorial="worksheet-2"
              isTablet={isTablet}
            >
              <StyledToggleButton value="calendar">Calendar</StyledToggleButton>
              <StyledToggleButton value="list">List</StyledToggleButton>
            </StyledToggleButtonGroup>
            {/* Season Filter Dropdown */}
            <Popout
              buttonText="Season"
              type="season"
              selectOptions={selectedSeason}
              clearIcon={false}
            >
              <PopoutSelect
                isClearable={false}
                hideSelectedOptions={false}
                value={selectedSeason}
                options={seasonOptions}
                placeholder="Last 5 Years"
                onChange={(selectedOption: ValueType<Option, boolean>) => {
                  if (isOption(selectedOption)) {
                    changeSeason(selectedOption.value);
                  }
                }}
              />
            </Popout>
            {/* Worksheet Choice Filter Dropdown */}
            <Popout
              buttonText="Worksheet"
              type="worksheet"
              selectOptions={selectedWorksheet}
              clearIcon={false}
            >
              <PopoutSelect
                isClearable={false}
                hideSelectedOptions={false}
                value={selectedWorksheet}
                options={worksheetOptions}
                placeholder="Main Worksheet"
                onChange={(selectedOption: ValueType<Option, boolean>) => {
                  if (isOption(selectedOption)) {
                    changeWorksheet(selectedOption.value);
                    //console.log(worksheetNumber);
                  }
                }}
              />
            </Popout>
            {/* Facebook Dropdown */}
            {user.fbLogin ? (
              <>
                <Popout
                  buttonText="Friends' courses"
                  type="facebook"
                  selectOptions={selectedFb}
                  onReset={() => {
                    handleFBPersonChange('me');
                  }}
                  isDisabled={!user.fbLogin}
                  disabledButtonText="Connect FB"
                >
                  <PopoutSelect
                    hideSelectedOptions={false}
                    value={selectedFb}
                    options={friendOptions}
                    placeholder="Friends' courses"
                    onChange={(selectedOption: ValueType<Option, boolean>) => {
                      // Cleared FB friend
                      if (!selectedOption) handleFBPersonChange('me');
                      // Selected FB friend
                      else if (isOption(selectedOption))
                        handleFBPersonChange(selectedOption.value);
                    }}
                    isDisabled={!user.fbLogin}
                  />
                </Popout>
                {!isTablet && (
                  <Row className="ml-2">
                    <FBLoginButton />
                  </Row>
                )}
              </>
            ) : (
              <Row className="ml-2">
                <FaFacebookSquare
                  className="mr-2 my-auto"
                  size={20}
                  color="#007bff"
                />
                <FBLoginButton />
              </Row>
            )}
          </FilterGroup>
        </StyledRow>
      </Form>
    </>
  );
}
