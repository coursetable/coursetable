import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';
import {
  components as selectComponents,
  type SingleValueProps,
  type OptionProps,
} from 'react-select';
import { MdPersonAdd, MdPersonRemove } from 'react-icons/md';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

import { fetchAllNames } from '../../utilities/api';
import { useUser } from '../../contexts/userContext';
import type { NetId } from '../../utilities/common';
import styles from './AddFriendDropdown.module.css';

const FriendContext = createContext<{
  isFriend: (netId: NetId) => boolean;
  removeFriend: (netId: NetId, isRequest: boolean) => void;
} | null>(null);

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

function OptionComponent(props: OptionProps<OptionType, false>) {
  const { requestAddFriend, addFriend } = useUser();
  const { children, data, innerProps } = props;
  const { removeFriend } = useContext(FriendContext)!;

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

function SingleValueComponent(props: SingleValueProps<OptionType, false>) {
  const { children, data } = props;
  const { requestAddFriend } = useUser();
  const { isFriend } = useContext(FriendContext)!;

  // Check if the selected value is a friend request or a search result that
  // can be added
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
}

function AddFriendDropdownDesktop() {
  const { user } = useUser();
  const { isFriend } = useContext(FriendContext)!;
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
          SingleValue: SingleValueComponent,
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

function AddFriendDropdown({
  removeFriend,
  mobile,
}: {
  readonly removeFriend: (netId: NetId, isRequest: boolean) => void;
  readonly mobile: boolean;
}) {
  const { user } = useUser();

  const isFriend = useMemo(() => {
    const friends = new Set(Object.keys(user.friends ?? {}));
    return (netId: NetId) => friends.has(netId);
  }, [user.friends]);
  const contextValue = useMemo(
    () => ({ removeFriend, isFriend }),
    [removeFriend, isFriend],
  );
  return (
    <FriendContext.Provider value={contextValue}>
      {mobile ? null : <AddFriendDropdownDesktop />}
    </FriendContext.Provider>
  );
}

export default AddFriendDropdown;
