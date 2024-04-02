import React, { useMemo, useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import {
  components as selectComponents,
  type SingleValueProps,
} from 'react-select';
import { toast } from 'react-toastify';
import { MdPersonAdd, MdPersonRemove } from 'react-icons/md';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import { LinkLikeText } from '../Typography';

import { isOption, type Option } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { toSeasonString } from '../../utilities/course';
import { fetchAllNames } from '../../utilities/api';
import { useUser } from '../../contexts/userContext';
import type { NetId, Season } from '../../utilities/common';
import styles from './NavbarWorksheetSearch.module.css';

type FriendNames = {
  netId: NetId;
  first: string | null;
  last: string | null;
  college: string | null;
}[];

interface OptionType {
  value: NetId;
  label: string;
  type: string;
}

function SeasonDropdown() {
  const { seasonCodes, curSeason, changeSeason } = useWorksheet();

  const selectedSeason = useMemo(() => {
    if (curSeason) {
      return {
        value: curSeason,
        label: toSeasonString(curSeason),
      };
    }
    return null;
  }, [curSeason]);

  return (
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
  );
}

function WorksheetNumDropdown() {
  const { changeWorksheet, worksheetNumber, worksheetOptions } = useWorksheet();

  return (
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
          if (isOption(selectedOption)) changeWorksheet(selectedOption.value);
        }}
      />
    </Popout>
  );
}

function FriendsDropdown({
  removeFriend,
}: {
  readonly removeFriend: (netId: NetId, isRequest: boolean) => void;
}) {
  const { user } = useUser();
  const { person, handlePersonChange } = useWorksheet();

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

  return (
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
          NoOptionsMessage: ({ children, ...props }) => (
            <selectComponents.NoOptionsMessage {...props}>
              No friends found
            </selectComponents.NoOptionsMessage>
          ),
          Option({ children, ...props }) {
            if (props.data.value === 'me') {
              return (
                <selectComponents.Option {...props}>
                  {children}
                </selectComponents.Option>
              );
            }
            return (
              <selectComponents.Option {...props}>
                {children}
                <MdPersonRemove
                  className={styles.removeFriendIcon}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFriend(props.data.value as NetId, false);
                  }}
                  title="Remove friend"
                />
              </selectComponents.Option>
            );
          },
        }}
        isDisabled={false}
      />
    </Popout>
  );
}

function AddFriendDropdown({
  removeFriend,
}: {
  readonly removeFriend: (netId: NetId, isRequest: boolean) => void;
}) {
  const { user, requestAddFriend, addFriend } = useUser();
  const [allNames, setAllNames] = useState<FriendNames>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchNames() {
      const data = await fetchAllNames();
      if (data) setAllNames(data.names as FriendNames);
      setIsLoading(false);
    }
    void fetchNames();
  }, []);
  const isFriend = useMemo(() => {
    const friends = new Set(Object.keys(user.friends ?? {}));
    return (netId: NetId) => friends.has(netId);
  }, [user.friends]);

  const searchResults = useMemo(() => {
    if (searchText.length < 3) return [];
    return allNames
      .filter(
        (name) =>
          name.netId !== user.netId &&
          !isFriend(name.netId) &&
          ((name.first &&
            name.last &&
            `${name.first} ${name.last}`
              .toLowerCase()
              .includes(searchText.toLowerCase())) ||
            name.netId.includes(searchText.toLowerCase())),
      )
      .map((name) => ({
        value: name.netId,
        label: `${name.first ?? '[unknown]'} ${name.last ?? '[unknown]'} (${name.netId})`,
        type: 'searchResult',
      }));
  }, [allNames, searchText, user.netId, isFriend]);
  const friendRequestOptions = useMemo(
    () =>
      user.friendRequests?.map((request) => ({
        value: request.netId,
        label: request.name,
        type: 'incomingRequest',
      })) || [],
    [user.friendRequests],
  );

  const customSingleValue = (props: SingleValueProps<OptionType, false>) => {
    const { children, data } = props;

    // Check if the selected value is a friend request or a search result that can be added
    const isAddable = data.type === 'searchResult' && !isFriend(data.value);

    return (
      <selectComponents.SingleValue {...props}>
        {children}
        {isAddable && (
          <MdPersonAdd
            className={styles.addFriendIcon}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation(); // Prevent event from bubbling to the main select handler
              void requestAddFriend(data.value);
            }}
            title="Send friend request"
          />
        )}
      </selectComponents.SingleValue>
    );
  };

  return (
    <Popout buttonText="Add Friend" notifications={user.friendRequests?.length}>
      <PopoutSelect
        isClearable={false}
        placeholder="Enter friend's name"
        options={[
          { label: 'Search Results', options: searchResults },
          { label: 'Incoming Requests', options: friendRequestOptions },
        ]}
        onInputChange={(newValue) => setSearchText(newValue)}
        components={{
          Option({ children, ...props }) {
            // Prevent the option from being selected when clicked
            const onOptionClick = (e: React.MouseEvent) => {
              e.preventDefault();
              // Prevents the select's onChange event
              e.stopPropagation();
            };

            if (props.data.type === 'searchResult') {
              return (
                <div
                  {...props.innerProps}
                  className={styles.friendOption}
                  onClick={onOptionClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <span className={styles.friendOptionText}>{children}</span>
                  {!isFriend(props.data.value) && (
                    <MdPersonAdd
                      className={styles.addFriendIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        void requestAddFriend(props.data.value);
                      }}
                      title="Send friend request"
                    />
                  )}
                </div>
              );
            }
            // For incoming requests
            return (
              <selectComponents.Option {...props}>
                {children}
                <MdPersonAdd
                  className={styles.addFriendIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    void addFriend(props.data.value);
                  }}
                  title="Accept friend request"
                />
                <MdPersonRemove
                  className={styles.removeFriendIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFriend(props.data.value, true);
                  }}
                  title="Decline friend request"
                />
              </selectComponents.Option>
            );
          },
          SingleValue: customSingleValue,
          NoOptionsMessage({ children, ...props }) {
            if (isLoading) {
              return (
                <selectComponents.NoOptionsMessage {...props}>
                  Loading names...
                </selectComponents.NoOptionsMessage>
              );
            }
            return searchText.length < 3 ? (
              <selectComponents.NoOptionsMessage {...props}>
                Type at least 3 characters to search
              </selectComponents.NoOptionsMessage>
            ) : (
              <selectComponents.NoOptionsMessage {...props}>
                No results found
              </selectComponents.NoOptionsMessage>
            );
          },
        }}
      />
    </Popout>
  );
}

/**
 * Worksheet search form for the desktop in the navbar
 */
export function NavbarWorksheetSearch() {
  const { worksheetView, handleWorksheetView, person, handlePersonChange } =
    useWorksheet();

  const { removeFriend } = useUser();

  const removeFriendWithConfirmation = useCallback(
    (friendNetId: NetId, isRequest: boolean) => {
      toast.warn(
        <>
          You are about to {isRequest ? 'decline a request from' : 'remove'}{' '}
          {friendNetId}.{' '}
          <b>This is irreversible without another friend request.</b> Do you
          want to continue?
          <br />
          <LinkLikeText
            className="mx-2"
            onClick={async () => {
              if (!isRequest && person === friendNetId)
                handlePersonChange('me');
              await removeFriend(friendNetId, isRequest);
              toast.dismiss(`remove-${friendNetId}`);
            }}
          >
            Yes
          </LinkLikeText>
          <LinkLikeText
            className="mx-2"
            onClick={() => {
              toast.dismiss(`remove-${friendNetId}`);
            }}
          >
            No
          </LinkLikeText>
        </>,
        { autoClose: false, toastId: `remove-${friendNetId}` },
      );
    },
    [handlePersonChange, person, removeFriend],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <>
      {/* Filters Form, no form needs reload i think */}
      <Form onSubmit={handleSubmit} className="px-0" data-tutorial="">
        <Row className={styles.row}>
          <div className="d-flex align-items-center">
            {/* Worksheet View Toggle */}
            <ToggleButtonGroup
              name="worksheet-view-toggle"
              type="radio"
              value={worksheetView}
              onChange={(val: 'calendar' | 'list') => handleWorksheetView(val)}
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
            <SeasonDropdown />
            <WorksheetNumDropdown />
            <FriendsDropdown removeFriend={removeFriendWithConfirmation} />
            <AddFriendDropdown removeFriend={removeFriendWithConfirmation} />
          </div>
        </Row>
      </Form>
    </>
  );
}
