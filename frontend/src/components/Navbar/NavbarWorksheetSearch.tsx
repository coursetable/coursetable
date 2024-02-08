import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { components } from 'react-select';
import { MdPersonAdd, MdPersonRemove } from 'react-icons/md';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

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
        ([friendNetId, { name }]): Option<NetId> => ({
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
              <PopoutSelect<Option<NetId | 'me'>, false>
                hideSelectedOptions={false}
                menuIsOpen
                placeholder="My worksheets"
                value={selectedPerson}
                options={friendOptions}
                onChange={(selectedOption) => {
                  if (!selectedOption) handlePersonChange('me');
                  else if (isOption(selectedOption))
                    handlePersonChange(selectedOption.value);
                }}
                components={{
                  NoOptionsMessage: () => 'No friends found',
                  Option({ children, ...props }) {
                    if (props.data.value === 'me') {
                      return (
                        <components.Option {...props}>
                          {children}
                        </components.Option>
                      );
                    }
                    return (
                      <components.Option {...props}>
                        {children}
                        <MdPersonRemove
                          className={styles.removeFriendIcon}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePersonChange('me');
                            removeFriend(props.data.value as NetId, false);
                          }}
                          title="Remove friend"
                        />
                      </components.Option>
                    );
                  },
                }}
                isDisabled={false}
              />
            </Popout>
            {/* Add Friend Dropdown */}
            <Popout buttonText="Add Friend">
              <PopoutSelect
                hideSelectedOptions={false}
                menuIsOpen
                placeholder="Enter your friend's NetID (hit enter to add): "
                options={[
                  {
                    label: 'Incoming requests',
                    options: friendRequestOptions,
                  },
                ]}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void requestAddFriend(currentFriendNetID as NetId);
                  }
                }}
                onInputChange={(e) => {
                  setCurrentFriendNetID(e);
                }}
                components={{
                  NoOptionsMessage: () => 'No incoming friend requests',
                  Option({ children, ...props }) {
                    return (
                      <components.Option {...props}>
                        {children}
                        <MdPersonAdd
                          className={styles.addFriendIcon}
                          onClick={(e) => {
                            e.preventDefault();
                            void addFriend(props.data.value);
                          }}
                          title="Accept friend request"
                        />
                        <MdPersonRemove
                          className={styles.removeFriendIcon}
                          onClick={(e) => {
                            e.preventDefault();
                            removeFriend(props.data.value, true);
                          }}
                          title="Decline friend request"
                        />
                      </components.Option>
                    );
                  },
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
