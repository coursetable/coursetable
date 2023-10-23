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
    season_options,
    cur_season,
    changeSeason,
    changeWorksheet,
    worksheet_number,
    fb_person,
    handleFBPersonChange,
    worksheet_view,
    handleWorksheetView,
  } = useWorksheet();

  const worksheet_options = useMemo(() => {
    const worksheet_options_temp = [
      { value: '0', label: 'Main Worksheet' },
      { value: '1', label: 'Worksheet 1' },
      { value: '2', label: 'Worksheet 2' },
      { value: '3', label: 'Worksheet 3' },
    ];
    return worksheet_options_temp;
  }, []);

  const selected_season = useMemo(() => {
    if (cur_season) {
      return {
        value: cur_season,
        label: toSeasonString(cur_season)[0],
      };
    }
    return null;
  }, [cur_season]);

  const selected_worksheet = useMemo(() => {
    if (worksheet_number) {
      return {
        value: worksheet_number,
        label:
          worksheet_number === '0'
            ? 'Main Worksheet'
            : `Worksheet ${worksheet_number}`,
      };
    }
    return null;
  }, [worksheet_number]);

  // Fetch user context data
  const { user } = useUser();

  // FB Friends names
  const friendInfo = useMemo(() => {
    return user.fbWorksheets
      ? user.fbWorksheets.friendInfo
      : {};
  }, [user.fbWorksheets]);

  // List of FB friend options. Initialize with me option
  const friend_options = useMemo(() => {
    const friend_options_temp = [];
    // Add FB friend to dropdown if they have worksheet courses in the current season
    for (const friend in friendInfo) {
      friend_options_temp.push({
        value: friend,
        label: friendInfo[friend].name,
      });
    }
    // Sort FB friends in alphabetical order
    friend_options_temp.sort((a, b) => {
      return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1;
    });
    return friend_options_temp;
  }, [friendInfo]);

  const selected_fb = useMemo(() => {
    return {
      value: fb_person,
      label: 'Connect FB',
    };

    if (fb_person === 'me') {
      return null;
    }
    return {
      value: fb_person,
      label: friendInfo[fb_person].name,
    };
  }, [fb_person, friendInfo]);

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
                worksheet_view.view === 'expanded calendar'
                  ? 'calendar'
                  : worksheet_view.view
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
              select_options={selected_season}
              clearIcon={false}
            >
              <PopoutSelect
                isClearable={false}
                hideSelectedOptions={false}
                value={selected_season}
                options={season_options}
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
              select_options={selected_worksheet}
              clearIcon={false}
            >
              <PopoutSelect
                isClearable={false}
                hideSelectedOptions={false}
                value={selected_worksheet}
                options={worksheet_options}
                placeholder="Main Worksheet"
                onChange={(selectedOption: ValueType<Option, boolean>) => {
                  if (isOption(selectedOption)) {
                    changeWorksheet(selectedOption.value);
                    //console.log(worksheet_number);
                  }
                }}
              />
            </Popout>
            {/* Facebook Dropdown */}
              <Popout
                buttonText="Friends' courses"
                type="facebook"
                select_options={selected_fb}
                onReset={() => {
                  handleFBPersonChange('me');
                }}
                isDisabled={false}
                disabledButtonText="Connect FB"
              >
                <PopoutSelect
                  hideSelectedOptions={false}
                  value={selected_fb}
                  options={friend_options}
                  placeholder="Friends' courses"
                  onChange={(selectedOption: ValueType<Option, boolean>) => {
                    // Cleared FB friend
                    if (!selectedOption) handleFBPersonChange('me');
                    // Selected FB friend
                    else if (isOption(selectedOption))
                      handleFBPersonChange(selectedOption.value);
                  }}
                  isDisabled={false}
                />
              </Popout>
          </FilterGroup>
        </StyledRow>
      </Form>
    </>
  );
}
