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
  fetchAllNames,
  addFriend,
  requestAddFriend as baseRequestAddFriend,
  removeFriend,
  checkAuth,
} from '../utilities/api';
import type { NetId, Season, Crn } from '../utilities/common';

// Not using z.infer because we want narrower types
export type UserWorksheets = {
  [season: Season]: {
    [worksheetNumber: number]: {
      crn: Crn;
    }[];
  };
};
export type FriendRecord = {
  [netId: NetId]: {
    name: string;
    worksheets: UserWorksheets;
  };
};
type FriendRequests = {
  netId: NetId;
  name: string;
}[];

type FriendNames = {
  netId: NetId;
  first: string | null;
  last: string | null;
  college: string | null;
}[];

type Store = {
  loading: boolean;
  user: {
    netId?: NetId;
    worksheets?: UserWorksheets;
    hasEvals?: boolean;
    year?: number;
    school?: string;
    friendRequests?: FriendRequests;
    friends?: FriendRecord;
  };
  allNames: FriendNames;
  userRefresh: () => Promise<void>;
  friendRefresh: () => Promise<void>;
  friendReqRefresh: () => Promise<void>;
  allNamesRefresh: () => Promise<void>;
  // These functions actually don't depend on context data. They are still put
  // on the context, in case we add more logic in the future that depends on
  // React rendering logic (flushing UI, etc.)
  addFriend: (friendNetId: NetId) => Promise<void>;
  removeFriend: (friendNetId: NetId) => Promise<void>;
  requestAddFriend: (friendNetId: NetId) => Promise<void>;
};

const UserContext = createContext<Store | undefined>(undefined);
UserContext.displayName = 'UserContext';

/**
 * Stores the user's worksheet and friends' worksheets
 */
export function UserProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Page initialized as loading
  const [loading, setLoading] = useState(true);
  // User's netId
  const [netId, setNetId] = useState<NetId | undefined>(undefined);
  // User's worksheet
  const [worksheets, setWorksheets] = useState<UserWorksheets | undefined>(
    undefined,
  );
  // User's evals enabled status
  const [hasEvals, setHasEvals] = useState<boolean | undefined>(undefined);
  // User's year
  const [year, setYear] = useState<number | undefined>(undefined);
  // User's school
  const [school, setSchool] = useState<string | undefined>(undefined);
  // User's friends
  const [friends, setFriends] = useState<FriendRecord | undefined>(undefined);
  // User's friend requests
  const [friendRequests, setFriendRequests] = useState<
    FriendRequests | undefined
  >(undefined);
  // All names, used for searching
  const [allNames, setAllNames] = useState<FriendNames>([]);

  // Refresh user worksheet
  const userRefresh = useCallback(async (): Promise<void> => {
    const data = await fetchUserWorksheets();
    if (data) {
      setNetId(data.netId satisfies string as NetId);
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

  // Refresh user friends stuff
  const friendRefresh = useCallback(async (): Promise<void> => {
    const data = await fetchFriendWorksheets();
    if (data) setFriends(data.friends as FriendRecord);
    else setFriends(undefined);
  }, [setFriends]);

  // Refresh friend requests
  const friendReqRefresh = useCallback(async (): Promise<void> => {
    const data = await fetchFriendReqs();
    if (data) setFriendRequests(data.requests as FriendRequests);
    else setFriendRequests(undefined);
  }, [setFriendRequests]);

  const allNamesRefresh = useCallback(async (): Promise<void> => {
    const data = await fetchAllNames();
    if (data) setAllNames(data.names as FriendNames);
    else setAllNames([]);
  }, []);

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
      } else {
        await baseRequestAddFriend(friendNetId);
      }
    },
    [netId, friends, friendRequests],
  );

  // Refresh user worksheet and friends data on page load
  useEffect(() => {
    async function init() {
      if (!(await checkAuth())) return;
      // This shouldn't fail, because they all handle their own errors
      await Promise.all([userRefresh(), friendRefresh(), friendReqRefresh()]);
    }
    void init().finally(() => setLoading(false));
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
      loading,
      user,
      allNames,
      userRefresh,
      friendRefresh,
      friendReqRefresh,
      allNamesRefresh,
      addFriend,
      removeFriend,
      requestAddFriend,
    }),
    [
      loading,
      user,
      allNames,
      userRefresh,
      friendRefresh,
      friendReqRefresh,
      allNamesRefresh,
      requestAddFriend,
    ],
  );

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext)!;
