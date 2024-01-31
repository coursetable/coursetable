import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { components } from 'react-select';
import { toast } from 'react-toastify';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import { Searchbar } from '../Search/Searchbar';

import { isOption, type Option } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { toSeasonString } from '../../utilities/course';
import { useUser } from '../../contexts/userContext';
import type { NetId, Season } from '../../utilities/common';
import styles from './NavbarWorksheetSearch.module.css';

/**
 * Worksheet search form for the desktop in the navbar
 */
export function NavbarWorksheetSearch() {
  const {
    seasonCodes,
    curSeason,
    changeSeason,
    changeWorksheet,
    worksheetNumber,
    worksheetOptions,
    person,
    handlePersonChange,
    worksheetView,
    handleWorksheetView,
  } = useWorksheet();

  const selectedSeason = useMemo(() => {
    if (curSeason) {
      return {
        value: curSeason,
        label: toSeasonString(curSeason),
      };
    }
    return null;
  }, [curSeason]);

  // Fetch user context data
  const { user, addFriend, removeFriend, requestAddFriend } = useUser();

  // List of friend options. Initialize with me option
  const friendOptions = useMemo(() => {
    if (!user.friends) return [];
    return Object.entries(user.friends)
      .map(
        ([friendNetId, { name }]): Option => ({
          value: friendNetId as NetId,
          label: name,
        }),
      )
      .sort((a, b) =>
        a.label.localeCompare(b.label, 'en-US', { sensitivity: 'base' }),
      );
  }, [user.friends]);

  const selectedPerson = useMemo(() => {
    if (person === 'me' || !user.friends?.[person]) return null;
    return {
      value: person,
      label: user.friends[person]!.name,
    };
  }, [person, user.friends]);

  // Friend requests variables
  const friendRequestOptions = useMemo(() => {
    if (!user.friendRequests) return [];
    return user.friendRequests
      .map((friend) => ({
        value: friend.netId,
        label: friend.name,
      }))
      .sort((a, b) =>
        a.label.localeCompare(b.label, 'en-US', { sensitivity: 'base' }),
      );
  }, [user.friendRequests]);

  const [currentFriendNetID, setCurrentFriendNetID] = useState('');

  const [deleting, setDeleting] = useState(0);
  const [removing, setRemoving] = useState(0);

  return (
    <>
      {/* Filters Form */}
      <Form className="px-0" data-tutorial="">
        <Row className={styles.row}>
          <div className="d-flex align-items-center">
            {/* Worksheet View Toggle */}
            <ToggleButtonGroup
              name="worksheet-view-toggle"
              type="radio"
              value={worksheetView.view}
              onChange={(val: 'calendar' | 'list') =>
                handleWorksheetView({ view: val, mode: '' })
              }
              className={clsx(styles.toggleButtonGroup, 'ml-2 mr-3')}
              data-tutorial="worksheet-2"
            >
              <ToggleButton className={styles.toggleButton} value="calendar">
                Calendar
              </ToggleButton>
              <ToggleButton className={styles.toggleButton} value="list">
                List
              </ToggleButton>
            </ToggleButtonGroup>
            {/* Season Filter Dropdown */}
            <Popout
              buttonText="Season"
              displayOptionLabel
              maxDisplayOptions={1}
              selectedOptions={selectedSeason}
              clearIcon={false}
            >
              <PopoutSelect<Option<Season>, false>
                isClearable={false}
                hideSelectedOptions={false}
                value={selectedSeason}
                options={seasonCodes.map((seasonCode) => ({
                  value: seasonCode,
                  label: toSeasonString(seasonCode),
                }))}
                placeholder="Last 5 Years"
                onChange={(selectedOption) => {
                  if (isOption(selectedOption))
                    changeSeason(selectedOption.value as Season | null);
                }}
              />
            </Popout>
            {/* Worksheet Choice Filter Dropdown */}
            <Popout
              buttonText="Worksheet"
              displayOptionLabel
              selectedOptions={worksheetOptions[worksheetNumber]}
              clearIcon={false}
            >
              <PopoutSelect
                isClearable={false}
                hideSelectedOptions={false}
                value={worksheetOptions[worksheetNumber]}
                options={worksheetOptions}
                onChange={(selectedOption) => {
                  if (isOption(selectedOption))
                    changeWorksheet(selectedOption.value);
                }}
              />
            </Popout>
            {/* Friends' Courses Dropdown */}
            <Popout
              buttonText="Friends' courses"
              displayOptionLabel
              selectedOptions={selectedPerson}
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
                onChange={(selectedOption) => {
                  if (removing === 0) {
                    // Cleared friend
                    if (!selectedOption) handlePersonChange('me');
                    // Selected friend
                    else if (isOption(selectedOption))
                      handlePersonChange(selectedOption.value as NetId);
                  } else if (selectedOption && isOption(selectedOption)) {
                    void removeFriend(selectedOption.value as NetId);
                  }
                }}
                isDisabled={false}
              />
            </Popout>

            {/* Friend Requests Dropdown */}
            <Popout
              buttonText="Friend requests"
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
                onChange={(selectedOption) => {
                  if (selectedOption && isOption(selectedOption)) {
                    if (deleting === 0) {
                      void addFriend(selectedOption.value as NetId);
                    } else if (deleting === 1) {
                      // TODO actually decline it (remove from database)
                      toast.info(
                        `Declined friend request: ${selectedOption.value}`,
                      );
                    }
                  }
                }}
                isDisabled={false}
              />
            </Popout>

            {/* Add Friend Dropdown */}

            <Popout buttonText="Add Friend">
              <Searchbar
                hideSelectedOptions={false}
                components={{
                  Menu: () => null,
                }}
                placeholder="Enter your friend's NetID (hit enter to add): "
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void requestAddFriend(currentFriendNetID as NetId);
                  }
                }}
                onInputChange={(e) => {
                  setCurrentFriendNetID(e);
                }}
                isDisabled={false}
              />
            </Popout>
          </div>
        </Row>
      </Form>
    </>
  );
}
