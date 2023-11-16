/* eslint-disable guard-for-in */
import React, { useMemo, useState } from 'react';
import { Form, Row, ToggleButton, ToggleButtonGroup, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { ValueType } from 'react-select/src/types';
import { components } from 'react-select';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import { Searchbar } from '../Search/Searchbar';

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

// Reset button
const StyledDeleteButton = styled(Button)`
  padding: 0.25rem 0.375rem;
  font-size: 12px;
  ${breakpoints('font-size', 'px', [{ 1320: 10 }])};
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
    worksheet_options,
    person,
    handlePersonChange,
    worksheet_view,
    handleWorksheetView,
  } = useWorksheet();

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
        label: worksheet_options[parseInt(worksheet_number)].label
      };
    }
    return null;
  }, [worksheet_number, worksheet_options]);

  // Fetch user context data
  const {
    user,
    changeWorksheetName,
    addWorksheet,
    deleteWorksheet,
    addFriend,
    removeFriend,
    friendRequest,
    resolveFriendRequest,
    friendReqRefresh,
    friendRefresh,
  } = useUser();

  // FB Friends names
  const friendInfo = useMemo(() => {
    return user.friendWorksheets ? user.friendWorksheets.friendInfo : {};
  }, [user.friendWorksheets]);

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

  const selected_person = useMemo(() => {
    if (person === 'me') {
      return null;
    }
    return {
      value: person,
      label: friendInfo[person].name,
    };
  }, [person, friendInfo]);

  // FB Friends names
  const friendRequestInfo = useMemo(() => {
    return user.friendRequests ? user.friendRequests : [];
  }, [user.friendRequests]);

  // friend requests variables
  const friend_request_options = useMemo(() => {
    const friend_request_options_temp = [];
    // Add FB friend to dropdown if they have worksheet courses in the current season
    for (const friend of friendRequestInfo) {
      friend_request_options_temp.push({
        value: friend.netId,
        label: friend.name,
      });
    }
    // Sort FB friends in alphabetical order
    friend_request_options_temp.sort((a, b) => {
      return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1;
    });
    return friend_request_options_temp;
  }, [friendRequestInfo]);

  const { isTablet } = useWindowDimensions();

  const [currentFriendNetID, setCurrentFriendNetID] = useState('');

  const [selectedWorksheetName, setSelectedWorksheetName] = useState('');

  const [newWorksheetName, setNewWorksheetName] = useState('');

  const [addWorksheetPlaceHolder, setAddWorksheetPlaceHolder] = useState(
    worksheet_options.length >= 20 ? 
    'Reached maximum number of worksheets':
    'Add worksheet'
  );

  const [boolWorksheetsNumber, setBoolWorksheetsNumber] = useState(
    worksheet_options.length >= 20?
    true:
    false
  );

  const [deleteBool, setDeleteBool] = useState(
    worksheet_number in ['0', '1', '2', '3'] ?
    true :
    false
  )

  const [deleting, setDeleting] = useState(0);
  const [removing, setRemoving] = useState(0);

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
                    if (selectedOption.value in ['0', '1', '2', '3']) {
                      setDeleteBool(true);
                    } else {
                      setDeleteBool(false);
                    }
                    changeWorksheet(selectedOption.value);
                  }
                }}
              />
              
              <Searchbar
                hideSelectedOptions={false}
                components={{
                  Menu: () => <></>,
                }}
                placeholder="Change current worksheet name:"
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    setSelectedWorksheetName(selectedWorksheetName.slice(0, -1));
                  } else if (e.key === 'Enter' && selectedWorksheetName.length > 0) {
                    changeWorksheetName(selectedWorksheetName, worksheet_number);
                  } else if (e.key.length == 1) {
                    setSelectedWorksheetName(selectedWorksheetName + e.key);
                  }
                }}
                onMenuClose={() => setSelectedWorksheetName('')}
                isDisabled={false}
              />
              <Searchbar
                hideSelectedOptions={false}
                components={{
                  Menu: () => <></>,
                }}
                placeholder={addWorksheetPlaceHolder}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    setNewWorksheetName(newWorksheetName.slice(0, -1));
                  } else if (e.key === 'Enter' && newWorksheetName.length > 0) {
                    if (worksheet_options.length < 20) {
                      addWorksheet(newWorksheetName, worksheet_options.length.toString());
                    } else {
                      setAddWorksheetPlaceHolder('Reached maximum number of worksheets');
                      setBoolWorksheetsNumber(false);
                    }
                  } else if (e.key.length == 1) {
                    setNewWorksheetName(newWorksheetName + e.key);
                  }
                }}
                onMenuClose={() => setNewWorksheetName('')}
                isDisabled={boolWorksheetsNumber}
              />
              <div 
              style={
                {paddingBottom: '0.45rem',
                 paddingRight: '0.45rem',
                 paddingLeft: '0.45rem',
                 paddingTop: '0.45rem',
                 display: 'flex',
                 justifyContent: 'flex-end'
                }
              }
              >
              <StyledDeleteButton
                variant="danger"
                onClick={() => {
                  setDeleteBool(true);
                  deleteWorksheet(worksheet_number);
                  changeWorksheet('0');
                }}
                disabled={deleteBool}
              >
                Delete Worksheet
              </StyledDeleteButton>
              </div>
            </Popout>
            {/* Friends' Courses Dropdown */}
            <Popout
              buttonText="Friends' courses"
              type="friend"
              select_options={selected_person}
              onReset={() => {
                handlePersonChange('me');
              }}
            >
              <Searchbar
                components={{
                  Control: (props) => {
                    return (
                      <div
                        onClick={() => {
                          setRemoving(1 - removing);
                        }}
                      >
                        <components.Control {...props} />
                      </div>
                    );
                  },
                }}
                hideSelectedOptions={false}
                value={selected_person}
                options={friend_options}
                placeholder={
                  removing === 0
                    ? 'Selecting friends (click to switch to remove mode)'
                    : 'Removing friends (click to switch to select mode)'
                }
                isSearchable={false}
                onChange={(selectedOption: ValueType<Option, boolean>) => {
                  if (removing === 0) {
                    // Cleared FB friend
                    if (!selectedOption) handlePersonChange('me');
                    // Selected FB friend
                    else if (isOption(selectedOption))
                      handlePersonChange(selectedOption.value);
                  } else if (selectedOption && isOption(selectedOption)) {
                    removeFriend(selectedOption.value, user.netId);
                    removeFriend(user.netId, selectedOption.value);
                  }
                }}
                isDisabled={false}
              />
            </Popout>

            {/* Friend Requests Dropdown */}
            <Popout
              buttonText="Friend requests"
              type="friend reqs"
              // select_options={selected_person}
              onReset={() => {
                handlePersonChange('me');
              }}
            >
              <Searchbar
                components={{
                  Control: (props) => {
                    return (
                      <div
                        onClick={() => {
                          setDeleting(1 - deleting);
                        }}
                      >
                        <components.Control {...props} />
                      </div>
                    );
                  },
                }}
                hideSelectedOptions={false}
                value={null}
                isSearchable={false}
                options={friend_request_options}
                placeholder={
                  deleting === 0
                    ? 'Adding friends (click to switch to delete mode)'
                    : 'Deleting friends (click to switch to add mode)'
                }
                onChange={(selectedOption: ValueType<Option, boolean>) => {
                  if (selectedOption && isOption(selectedOption)) {
                    resolveFriendRequest(selectedOption.value);
                    if (deleting === 0) {
                      addFriend(selectedOption.value, user.netId);
                      addFriend(user.netId, selectedOption.value);
                    }
                    friendReqRefresh(true);
                    friendRefresh(true);
                  }
                }}
                isDisabled={false}
              />
            </Popout>

            {/* Add Friend Dropdown */}

            <Popout buttonText="Add Friend" type="adding friends">
              <Searchbar
                hideSelectedOptions={false}
                components={{
                  Menu: () => <></>,
                }}
                placeholder="Enter your friend's NetID (hit enter to add): "
                onKeyDown={(e) => {
                  if (e.key === 'Backspace') {
                    setCurrentFriendNetID(currentFriendNetID.slice(0, -1));
                  } else if (e.key === 'Enter') {
                    friendRequest(currentFriendNetID);
                  } else if (e.key.length == 1) {
                    setCurrentFriendNetID(currentFriendNetID + e.key);
                  }
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
