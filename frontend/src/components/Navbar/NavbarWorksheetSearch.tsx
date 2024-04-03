import React, { useMemo, useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import {
  components as selectComponents,
  type SingleValueProps,
  type OptionProps,
} from 'react-select';
import { toast } from 'react-toastify';
import { MdPersonAdd, MdPersonRemove } from 'react-icons/md';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import { LinkLikeText } from '../Typography';
import FriendsDropdown from '../Worksheet/FriendsDropdown';
import SeasonDropdown from '../Worksheet/SeasonDropdown';
import WorksheetNumDropdown from '../Worksheet/WorksheetNumberDropdown';

import { useWorksheet } from '../../contexts/worksheetContext';
import { fetchAllNames } from '../../utilities/api';
import { useUser } from '../../contexts/userContext';
import type { NetId } from '../../utilities/common';
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

  function OptionComponent(props: OptionProps<OptionType, false>) {
    const { children, data, innerProps } = props;

    const preventOptionSelection = (
      e: React.MouseEvent | React.KeyboardEvent,
    ) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const addFriendClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      void addFriend(data.value);
    };

    const requestFriendClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      void requestAddFriend(data.value);
    };

    const removeFriendClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      removeFriend(data.value, true);
    };

    if (data.type === 'searchResult') {
      return (
        <div
          {...innerProps}
          className={styles.friendOption}
          role="button"
          tabIndex={0}
          onKeyDown={preventOptionSelection}
          onClick={preventOptionSelection}
        >
          <span className={styles.friendOptionText}>{children}</span>
          <MdPersonAdd
            className={styles.addFriendIcon}
            onClick={requestFriendClick}
            title="Send friend request"
          />
        </div>
      );
    }

    // For incoming requests
    if (data.type === 'incomingRequest') {
      return (
        <div
          {...innerProps}
          className={styles.friendOption}
          role="button"
          tabIndex={0}
          onKeyDown={preventOptionSelection}
          onClick={preventOptionSelection}
        >
          <span className={styles.friendOptionText}>{children}</span>
          <MdPersonAdd
            className={styles.addFriendIcon}
            onClick={addFriendClick}
            title="Accept friend request"
          />
          <MdPersonRemove
            className={styles.removeFriendIcon}
            onClick={removeFriendClick}
            title="Decline friend request"
          />
        </div>
      );
    }

    return (
      <selectComponents.Option {...props}>{children}</selectComponents.Option>
    );
  }

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
          Option: OptionComponent,
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
            <SeasonDropdown mobile={false} />
            <WorksheetNumDropdown mobile={false} />
            <FriendsDropdown
              mobile={false}
              removeFriend={removeFriendWithConfirmation}
            />
            <AddFriendDropdown removeFriend={removeFriendWithConfirmation} />
          </div>
        </Row>
      </Form>
    </>
  );
}
