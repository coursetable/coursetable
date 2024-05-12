import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';
import { MdPersonAdd, MdPersonRemove } from 'react-icons/md';
import {
  components as selectComponents,
  type SingleValueProps,
  type OptionProps,
} from 'react-select';
import { useUser } from '../../contexts/userContext';
import type { NetId } from '../../queries/graphql-types';
import { fetchAllNames } from '../../utilities/api';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

import Spinner from '../Spinner';
import styles from './AddFriendDropdown.module.css';

const FriendContext = createContext<{
  isFriend: (netId: NetId) => boolean;
  removeFriend: (netId: NetId, isRequest: boolean) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);

  const preventOptionSelection = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handler =
    (action: (friendNetId: NetId) => Promise<void>) =>
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsLoading(true);
      await action(data.value);
      setIsLoading(false);
    };

  if (data.type === 'searchResult') {
    return (
      // TODO
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      <div
        {...innerProps}
        className={styles.friendOption}
        role="button"
        tabIndex={0}
        onKeyDown={preventOptionSelection}
        onClick={preventOptionSelection}
      >
        <span className={styles.friendOptionText}>{children}</span>
        {isLoading ? (
          <Spinner className={styles.spinner} />
        ) : (
          <MdPersonAdd
            className={styles.addFriendIcon}
            onClick={handler(requestAddFriend)}
            title="Send friend request"
          />
        )}
      </div>
    );
  }

  // For incoming requests
  if (data.type === 'incomingRequest') {
    return (
      // TODO
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      <div
        {...innerProps}
        className={styles.friendOption}
        role="button"
        tabIndex={0}
        onKeyDown={preventOptionSelection}
        onClick={preventOptionSelection}
      >
        <span className={styles.friendOptionText}>{children}</span>
        {isLoading ? (
          <Spinner className={styles.spinner} />
        ) : (
          <>
            <MdPersonRemove
              className={styles.removeFriendIcon}
              onClick={handler((id) => removeFriend(id, true))}
              title="Decline friend request"
            />
            <MdPersonAdd
              className={styles.addFriendIcon}
              onClick={handler(addFriend)}
              title="Accept friend request"
            />
          </>
        )}
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
  const [isLoading, setIsLoading] = useState(false);

  // Check if the selected value is a friend request or a search result that
  // can be added
  const isAddable = data.type === 'searchResult' && !isFriend(data.value);

  return (
    <selectComponents.SingleValue {...props}>
      {children}
      {isAddable &&
        (isLoading ? (
          <Spinner className={styles.spinner} />
        ) : (
          <MdPersonAdd
            className={styles.addFriendIcon}
            onClick={async (e) => {
              e.stopPropagation(); // Prevent event from bubbling to the main select handler
              setIsLoading(true);
              await requestAddFriend(data.value);
              setIsLoading(false);
            }}
            title="Send friend request"
          />
        ))}
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
        label:
          name.first && name.last
            ? `${name.first} ${name.last} (${name.netId})`
            : name.netId,
        type: 'searchResult',
      }));
  }, [allNames, searchText, user.netId, isFriend]);
  const friendRequestOptions = useMemo(
    () =>
      user.friendRequests?.map((request) => ({
        value: request.netId,
        label: request.name ?? request.netId,
        type: 'incomingRequest',
      })) || [],
    [user.friendRequests],
  );

  return (
    <Popout buttonText="Add Friend" notifications={user.friendRequests?.length}>
      <PopoutSelect
        placeholder="Enter friend's name"
        options={[
          { label: 'Search Results', options: searchResults },
          { label: 'Incoming Requests', options: friendRequestOptions },
        ]}
        isLoading={isLoading}
        loadingMessage={() => 'Loading names...'}
        noOptionsMessage={() =>
          searchText.length < 3
            ? 'Type at least 3 characters to search'
            : 'No results found'
        }
        onInputChange={setSearchText}
        components={{
          Option: OptionComponent,
          SingleValue: SingleValueComponent,
        }}
      />
    </Popout>
  );
}

function AddFriendDropdown({
  removeFriend,
  mobile,
}: {
  readonly removeFriend: (netId: NetId, isRequest: boolean) => Promise<void>;
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
