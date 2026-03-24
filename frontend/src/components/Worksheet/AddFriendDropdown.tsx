import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPersonAdd, MdPersonRemove } from 'react-icons/md';
import {
  components as selectComponents,
  type SingleValueProps,
  type OptionProps,
} from 'react-select';
import { useShallow } from 'zustand/react/shallow';
import { searchProfiles } from '../../queries/api';
import type { NetId } from '../../queries/graphql-types';
import { useStore } from '../../store';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

import Spinner from '../Spinner';
import styles from './AddFriendDropdown.module.css';

const FriendContext = createContext<{
  isFriend: (netId: NetId) => boolean;
  removeFriend: (netId: NetId, isRequest: boolean) => Promise<void>;
} | null>(null);

interface OptionType {
  value: NetId;
  label: string;
  type: 'searchResult' | 'incomingRequest';
}

function OptionWithActionButtons(props: OptionProps<OptionType, false>) {
  const { requestAddFriend, addFriend } = useStore(
    useShallow((state) => ({
      requestAddFriend: state.requestAddFriend,
      addFriend: state.addFriend,
    })),
  );
  const { children, data, innerProps } = props;
  const { removeFriend } = useContext(FriendContext)!;
  const [isLoading, setIsLoading] = useState(false);

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
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      <div
        {...innerProps}
        className={styles.friendOption}
        role="button"
        tabIndex={0}
      >
        <span className={styles.friendOptionText}>{children}</span>
        {isLoading ? (
          <Spinner className={styles.spinner} message={undefined} />
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

  return (
    // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
    <div
      {...innerProps}
      className={styles.friendOption}
      role="button"
      tabIndex={0}
    >
      <span className={styles.friendOptionText}>{children}</span>
      {isLoading ? (
        <Spinner className={styles.spinner} message={undefined} />
      ) : (
        <>
          <MdPersonAdd
            className={styles.addFriendIcon}
            onClick={handler(addFriend)}
            title="Accept friend request"
          />
          <MdPersonRemove
            className={styles.removeFriendIcon}
            onClick={handler((id) => removeFriend(id, true))}
            title="Decline friend request"
          />
        </>
      )}
    </div>
  );
}

function SingleValueComponent(props: SingleValueProps<OptionType, false>) {
  const { children, data } = props;
  const requestAddFriend = useStore((state) => state.requestAddFriend);
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
          <Spinner className={styles.spinner} message={undefined} />
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

function AddFriendDropdownDesktop({
  fullWidth,
}: {
  readonly fullWidth: boolean;
}) {
  const { user, friendRequests } = useStore(
    useShallow((state) => ({
      user: state.user,
      friendRequests: state.friendRequests,
    })),
  );
  const navigate = useNavigate();
  const { isFriend } = useContext(FriendContext)!;
  const [searchResults, setSearchResults] = useState<OptionType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (searchText.length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      void searchProfiles(searchText, 20).then((data) => {
        if (cancelled) return;
        const nextResults =
          data?.profiles
            .filter(
              (profile) =>
                profile.netId !== user?.netId && !isFriend(profile.netId),
            )
            .map(
              (profile): OptionType => ({
                value: profile.netId,
                label: profile.displayName
                  ? `${profile.displayName} (${profile.netId})`
                  : profile.netId,
                type: 'searchResult',
              }),
            ) ?? [];
        setSearchResults(nextResults);
        setIsLoading(false);
      });
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isFriend, searchText, user?.netId]);
  const friendRequestOptions = useMemo(
    (): OptionType[] =>
      friendRequests?.map((request) => ({
        value: request.netId,
        label: request.name ?? request.netId,
        type: 'incomingRequest',
      })) || [],
    [friendRequests],
  );

  return (
    <Popout
      buttonText="Add friend"
      notifications={friendRequests?.length}
      fullWidth={fullWidth}
    >
      <PopoutSelect
        placeholder="Enter friend's name"
        minWidth={fullWidth ? 0 : 400}
        options={[
          { label: 'Search results', options: searchResults },
          { label: 'Incoming requests', options: friendRequestOptions },
        ]}
        isLoading={isLoading}
        loadingMessage={() => 'Loading names...'}
        noOptionsMessage={() =>
          searchText.length < 2
            ? 'Type at least 2 characters to search'
            : 'No results found'
        }
        onInputChange={setSearchText}
        onChange={(option) => {
          if (!option) return;
          void navigate(`/u/${option.value}`);
        }}
        components={{
          Option: OptionWithActionButtons,
          SingleValue: SingleValueComponent,
        }}
      />
    </Popout>
  );
}

function AddFriendDropdown({
  removeFriend,
  mobile,
  fullWidth = false,
}: {
  readonly removeFriend: (netId: NetId, isRequest: boolean) => Promise<void>;
  readonly mobile: boolean;
  readonly fullWidth?: boolean;
}) {
  const friends = useStore((state) => state.friends);

  const isFriend = useMemo(() => {
    const friendsSet = new Set(Object.keys(friends ?? {}));
    return (netId: NetId) => friendsSet.has(netId);
  }, [friends]);
  const contextValue = useMemo(
    () => ({ removeFriend, isFriend }),
    [removeFriend, isFriend],
  );
  return (
    <FriendContext.Provider value={contextValue}>
      {mobile ? null : <AddFriendDropdownDesktop fullWidth={fullWidth} />}
    </FriendContext.Provider>
  );
}

export default AddFriendDropdown;
