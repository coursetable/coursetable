import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  createContext,
} from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
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
  removeFriend: (
    netId: NetId,
    action: 'friend' | 'incoming' | 'outgoing',
  ) => Promise<void>;
} | null>(null);

type OptionKind =
  | 'searchResult'
  | 'incomingRequest'
  | 'outgoingRequest'
  | 'alreadyFriend';

interface OptionType {
  value: NetId;
  label: string;
  type: OptionKind;
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
      try {
        await action(data.value);
      } finally {
        setIsLoading(false);
      }
    };

  if (data.type === 'alreadyFriend') {
    return (
      // eslint-disable-next-line jsx-a11y/prefer-tag-over-role
      <div
        {...innerProps}
        className={styles.friendOption}
        role="button"
        tabIndex={0}
      >
        <span className={styles.friendOptionText}>{children}</span>
        <span className={styles.alreadyAddedLabel}>Already added</span>
      </div>
    );
  }

  if (data.type === 'outgoingRequest') {
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
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Cancel friend request"
            onClick={handler((id) => removeFriend(id, 'outgoing'))}
          >
            <MdPersonRemove className={styles.removeFriendIcon} />
          </button>
        )}
      </div>
    );
  }

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
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Send friend request"
            onClick={handler(requestAddFriend)}
          >
            <MdPersonAdd className={styles.addFriendIcon} />
          </button>
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
          <button
            type="button"
            className={clsx(styles.iconButton, styles.iconButtonRemove)}
            aria-label="Decline friend request"
            onClick={handler((id) => removeFriend(id, 'incoming'))}
          >
            <MdPersonRemove className={styles.removeFriendIcon} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Accept friend request"
            onClick={handler(addFriend)}
          >
            <MdPersonAdd className={styles.addFriendIcon} />
          </button>
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
              try {
                await requestAddFriend(data.value);
              } finally {
                setIsLoading(false);
              }
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
  const { user, friendRequests, outgoingFriendRequests } = useStore(
    useShallow((state) => ({
      user: state.user,
      friendRequests: state.friendRequests,
      outgoingFriendRequests: state.outgoingFriendRequests,
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
      void (async () => {
        try {
          const data = await searchProfiles(searchText, 20);
          if (cancelled) return;
          const outgoingSet = new Set(
            outgoingFriendRequests?.map((r) => r.netId) ?? [],
          );
          const nextResults =
            data?.profiles
              .filter((profile) => profile.netId !== user?.netId)
              .map(
                (profile): OptionType => ({
                  value: profile.netId,
                  label: profile.displayName
                    ? `${profile.displayName} (${profile.netId})`
                    : profile.netId,
                  type: isFriend(profile.netId)
                    ? 'alreadyFriend'
                    : outgoingSet.has(profile.netId)
                      ? 'outgoingRequest'
                      : 'searchResult',
                }),
              ) ?? [];
          setSearchResults(nextResults);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isFriend, outgoingFriendRequests, searchText, user?.netId]);
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
  readonly removeFriend: (
    netId: NetId,
    action: 'friend' | 'incoming' | 'outgoing',
  ) => Promise<void>;
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
