/* eslint-disable guard-for-in */
import React, { useMemo, useState } from 'react';
import { Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { ValueType } from 'react-select/src/types';
import { components } from 'react-select';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import { Searchbar } from '../Search/Searchbar';

// import { sortbyOptions } from '../queries/Constants';
import { isOption, Option, OptType } from '../../contexts/searchContext';
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
    person,
    handlePersonChange,
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
  const {
    user,
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

  const friendNamesInfo = useMemo(() => {
    return user.allNames
      ? user.allNames
      : [];
  }, [user.allNames]);

  const friend_name_options = useMemo(() => {
    const friend_name_options_temp: OptType = friendNamesInfo.map((x) => {
      const name_option: Option = {
        value: x.netId,
        label: x.first + " " + x.last + " (" + x.college + ")",
      }
      return name_option
    })
    return friend_name_options_temp
  }, [friendNamesInfo])

  const { isTablet } = useWindowDimensions();

  const [currentFriendNetID, setCurrentFriendNetID] = useState('');

  const [currentFriendName, setCurrentFriendName] = useState<Option | undefined>(undefined)

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
                    changeWorksheet(selectedOption.value);
                  }
                }}
              />
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
                  } else {
                    if (selectedOption && isOption(selectedOption)) {
                      removeFriend(selectedOption.value, user.netId);
                      removeFriend(user.netId, selectedOption.value);
                    }
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

            {/* Add friend with search by name test */}
            <div className={`col-md-2 p-0`}>
              <CustomSelect
                isMulti
                value={currentFriendName}
                options={friend_name_options}
                placeholder="Add Friends"
                isSearchable
                // prevent overlap with tooltips
                menuPortalTarget={document.body}
                onChange={(selectedOption: ValueType<Option, boolean>) =>
                  setCurrentFriendName((selectedOption as Option) || {})
                }
              />
            </div>

          </FilterGroup>
        </StyledRow>
      </Form>
    </>
  );
}
