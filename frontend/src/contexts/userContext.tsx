import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';
import {
  fetchUserWorksheets,
  fetchFriendWorksheets,
  fetchFriendReqs,
  addFriend as baseAddFriend,
  requestAddFriend as baseRequestAddFriend,
  removeFriend as baseRemoveFriend,
  checkAuth,
  type UserWorksheets,
  type FriendRecord,
  type FriendRequests,
} from '../queries/api';
import type { NetId } from '../queries/graphql-types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type Store = {
  authStatus: AuthStatus;
  user: {
    netId?: NetId;
    worksheets?: UserWorksheets;
    hasEvals?: boolean;
    year?: number;
    school?: string;
    friendRequests?: FriendRequests;
    friends?: FriendRecord;
  };
  userRefresh: () => Promise<void>;
  friendRefresh: () => Promise<void>;
  friendReqRefresh: () => Promise<void>;
  addFriend: (friendNetId: NetId) => Promise<void>;
  removeFriend: (friendNetId: NetId, isRequest: boolean) => Promise<void>;
  requestAddFriend: (friendNetId: NetId) => Promise<void>;
};

const UserContext = createContext<Store | undefined>(undefined);
UserContext.displayName = 'UserContext';

export function UserProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  const [netId, setNetId] = useState<NetId | undefined>(undefined);
  const [worksheets, setWorksheets] = useState<UserWorksheets | undefined>(
    undefined,
  );
  const [hasEvals, setHasEvals] = useState<boolean | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [school, setSchool] = useState<string | undefined>(undefined);
  const [friends, setFriends] = useState<FriendRecord | undefined>(undefined);
  const [friendRequests, setFriendRequests] = useState<
    FriendRequests | undefined
  >(undefined);

  const userRefresh = useCallback(async (): Promise<void> => {
    const data = await fetchUserWorksheets();
    if (data) {
      setNetId(data.netId);
      setHasEvals(data.evaluationsEnabled ?? undefined);
      setYear(data.year ?? undefined);
      setSchool(data.school ?? undefined);
      setWorksheets(data.data as UserWorksheets);
    } else {
      setNetId(undefined);
      setWorksheets(undefined);
      setHasEvals(undefined);
      setYear(undefined);
      setSchool(undefined);
    }
  }, [setWorksheets, setNetId, setHasEvals, setYear, setSchool]);

  const friendRefresh = useCallback(async (): Promise<void> => {
    const data = await fetchFriendWorksheets();
    if (data) setFriends(data.friends);
    else setFriends(undefined);
  }, [setFriends]);

  const friendReqRefresh = useCallback(async (): Promise<void> => {
    const data = await fetchFriendReqs();
    if (data) setFriendRequests(data.requests);
    else setFriendRequests(undefined);
  }, [setFriendRequests]);

  const addFriend = useCallback(
    async (friendNetId: NetId): Promise<void> => {
      if (await baseAddFriend(friendNetId))
        toast.info(`Added friend: ${friendNetId}`);
      await Promise.all([friendRefresh(), friendReqRefresh()]);
    },
    [friendRefresh, friendReqRefresh],
  );

  const removeFriend = useCallback(
    async (friendNetId: NetId, isRequest: boolean): Promise<void> => {
      if (await baseRemoveFriend(friendNetId)) {
        toast.info(
          `${isRequest ? 'Declined request from' : 'Removed friend'} ${friendNetId}`,
        );
      }
      await Promise.all([friendRefresh(), friendReqRefresh()]);
    },
    [friendRefresh, friendReqRefresh],
  );

  const requestAddFriend = useCallback(
    async (friendNetId: NetId): Promise<void> => {
      // Prevent sending to server in common error cases
      if (friendNetId === netId) {
        toast.error('You cannot request yourself as friend!');
      } else if (friends?.[friendNetId]) {
        toast.error(`You are already friends with ${friendNetId}.`);
      } else if (friendRequests?.find((x) => x.netId === friendNetId)) {
        toast.error(
          `You already received a friend request from ${friendNetId}. Go approve the request instead!`,
        );
      } else if (await baseRequestAddFriend(friendNetId)) {
        toast.info(`Sent friend request: ${friendNetId}`);
      }
    },
    [netId, friends, friendRequests],
  );

  // Refresh user worksheet and friends data on page load
  useEffect(() => {
    async function init() {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        setAuthStatus('authenticated');
        await Promise.all([userRefresh(), friendRefresh(), friendReqRefresh()]);
      } else {
        setAuthStatus('unauthenticated');
      }
    }
    void init();
  }, [userRefresh, friendRefresh, friendReqRefresh]);

  const user = useMemo(
    () => ({
      netId,
      worksheets,
      hasEvals,
      year,
      school,
      friendRequests,
      friends,
    }),
    [netId, worksheets, hasEvals, year, school, friendRequests, friends],
  );

  const store = useMemo(
    () => ({
      authStatus,
      user,
      userRefresh,
      friendRefresh,
      friendReqRefresh,
      addFriend,
      removeFriend,
      requestAddFriend,
    }),
    [
      authStatus,
      user,
      userRefresh,
      friendRefresh,
      friendReqRefresh,
      addFriend,
      removeFriend,
      requestAddFriend,
    ],
  );

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext)!;
