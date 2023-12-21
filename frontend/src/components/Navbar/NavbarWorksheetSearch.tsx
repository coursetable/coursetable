import React, { useMemo, useState } from 'react';
import { Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { components } from 'react-select';
import { toast } from 'react-toastify';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import { Searchbar } from '../Search/Searchbar';

import { isOption } from '../../contexts/searchContext';
import { breakpoints } from '../../utilities/display';
import { useWorksheet } from '../../contexts/worksheetContext';
import { toSeasonString } from '../../utilities/course';
import { useUser } from '../../contexts/userContext';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';

// Row in navbar search
const StyledRow = styled(Row)`
  width: auto;
  margin-left: auto;
  margin-right: auto;
`;

// Filter group wrapper
const FilterGroup = styled.div``;

// Toggle button group
// Do not pass isTablet prop to ToggleButtonGroup
const StyledToggleButtonGroup = styled(({ isTablet, ...props }) => (
  <ToggleButtonGroup {...props} />
))<{
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
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};
  padding: 0.25rem 0;
  width: 50%;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    color: ${({ theme }) => theme.text[0]};
    border: ${({ theme }) => theme.primaryHover} 2px solid;
  }

  &:active {
    background-color: ${({ theme }) => theme.buttonActive}!important;
    color: ${({ theme }) => theme.text[0]}!important;
  }

  &:focus {
    box-shadow: none !important;
  }

  &.active {
    background-color: ${({ theme }) => theme.primaryHover}!important;
    border-color: ${({ theme }) => theme.primaryHover}!important;
  }
`;

/**
 * Worksheet search form for the desktop in the navbar
 */
export function NavbarWorksheetSearch() {
  const {
    seasonOptions,
    curSeason,
    changeSeason,
    changeWorksheet,
    worksheetNumber,
    person,
    handlePersonChange,
    worksheetView,
    handleWorksheetView,
  } = useWorksheet();

  const worksheetOptions = useMemo(() => {
    const worksheetOptionsTemp = [
      { value: '0', label: 'Main Worksheet' },
      { value: '1', label: 'Worksheet 1' },
      { value: '2', label: 'Worksheet 2' },
      { value: '3', label: 'Worksheet 3' },
    ];
    return worksheetOptionsTemp;
  }, []);

  const selectedSeason = useMemo(() => {
    if (curSeason) {
      return {
        value: curSeason,
        label: toSeasonString(curSeason),
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
  const { user, addFriend, removeFriend, friendRequest, resolveFriendRequest } =
    useUser();

  // Friends names
  const friendInfo = useMemo(
    () => (user.friendWorksheets ? user.friendWorksheets.friendInfo : {}),
    [user.friendWorksheets],
  );

  // List of friend options. Initialize with me option
  const friendOptions = useMemo(() => {
    const friendOptionsTemp = [];
    // Add friend to dropdown if they have worksheet courses in the current
    // season
    for (const friend of Object.keys(friendInfo)) {
      friendOptionsTemp.push({
        value: friend,
        label: friendInfo[friend].name,
      });
    }
    // Sort friends in alphabetical order
    friendOptionsTemp.sort((a, b) =>
      a.label.localeCompare(b.label, 'en-US', { sensitivity: 'base' }),
    );
    return friendOptionsTemp;
  }, [friendInfo]);

  const selectedPerson = useMemo(() => {
    if (person === 'me' || !friendInfo[person]) return null;
    return {
      value: person,
      label: friendInfo[person].name,
    };
  }, [person, friendInfo]);

  // Friends names
  const friendRequestInfo = useMemo(
    () => (user.friendRequests ? user.friendRequests : []),
    [user.friendRequests],
  );

  // Friend requests variables
  const friendRequestOptions = useMemo(() => {
    const friendRequestOptionsTemp = [];
    // Add friend to dropdown if they have worksheet courses in the current
    // season
    for (const friend of friendRequestInfo) {
      friendRequestOptionsTemp.push({
        value: friend.netId,
        label: friend.name,
      });
    }
    // Sort friends in alphabetical order
    friendRequestOptionsTemp.sort((a, b) =>
      a.label.localeCompare(b.label, 'en-US', { sensitivity: 'base' }),
    );
    return friendRequestOptionsTemp;
  }, [friendRequestInfo]);

  const { isTablet } = useWindowDimensions();

  const [currentFriendNetID, setCurrentFriendNetID] = useState('');

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
              value={worksheetView.view}
              onChange={(val: 'calendar' | 'list') =>
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
                onChange={(selectedOption) => {
                  if (isOption(selectedOption))
                    changeSeason(selectedOption.value);
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
                onChange={(selectedOption) => {
                  if (isOption(selectedOption))
                    changeWorksheet(selectedOption.value);
                }}
              />
            </Popout>
            {/* Friends' Courses Dropdown */}
            <Popout
              buttonText="Friends' courses"
              type="friend"
              selectOptions={selectedPerson}
              onReset={() => {
                handlePersonChange('me');
              }}
            >
              <Searchbar
                components={{
                  Control: (props) => (
                    // TODO
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      onClick={() => {
                        setRemoving(1 - removing);
                      }}
                    >
                      <components.Control {...props} />
                    </div>
                  ),
                }}
                hideSelectedOptions={false}
                value={selectedPerson}
                options={friendOptions}
                placeholder={
                  removing === 0
                    ? 'Selecting friends (click to switch to remove mode)'
                    : 'Removing friends (click to switch to select mode)'
                }
                isSearchable={false}
                onChange={async (selectedOption) => {
                  if (removing === 0) {
                    // Cleared friend
                    if (!selectedOption) handlePersonChange('me');
                    // Selected friend
                    else if (isOption(selectedOption))
                      handlePersonChange(selectedOption.value);
                  } else if (selectedOption && isOption(selectedOption)) {
                    await Promise.all([
                      removeFriend(selectedOption.value, user.netId),
                      removeFriend(user.netId, selectedOption.value),
                    ]);
                    toast.info(`Removed friend: ${selectedOption.value}`);
                    window.location.reload();
                  }
                }}
                isDisabled={false}
              />
            </Popout>

            {/* Friend Requests Dropdown */}
            <Popout
              buttonText="Friend requests"
              type="friend reqs"
              onReset={() => {
                handlePersonChange('me');
              }}
            >
              <Searchbar
                components={{
                  Control: (props) => (
                    // TODO
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <div
                      onClick={() => {
                        setDeleting(1 - deleting);
                      }}
                    >
                      <components.Control {...props} />
                    </div>
                  ),
                }}
                hideSelectedOptions={false}
                value={null}
                isSearchable={false}
                options={friendRequestOptions}
                placeholder={
                  deleting === 0
                    ? 'Accepting requests (click to switch to decline mode)'
                    : 'Declining requests (click to switch to accept mode)'
                }
                onChange={async (selectedOption) => {
                  if (selectedOption && isOption(selectedOption)) {
                    await resolveFriendRequest(selectedOption.value);
                    if (deleting === 0) {
                      await Promise.all([
                        addFriend(selectedOption.value, user.netId),
                        addFriend(user.netId, selectedOption.value),
                      ]);
                      toast.info(`Added friend: ${selectedOption.value}`);
                    } else if (deleting === 1) {
                      toast.info(
                        `Declined friend request: ${selectedOption.value}`,
                      );
                    }
                    window.location.reload();
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
                  Menu: () => null,
                }}
                placeholder="Enter your friend's NetID (hit enter to add): "
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    await friendRequest(currentFriendNetID);
                    toast.info(`Sent friend request: ${currentFriendNetID}`);
                  }
                }}
                onInputChange={(e) => {
                  setCurrentFriendNetID(e);
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
