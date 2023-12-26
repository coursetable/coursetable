import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';
import type { NetId, Season } from '../utilities/common';
import { API_ENDPOINT } from '../config';

export type Worksheet = [
  season: Season,
  crn: string,
  worksheetNumber: string,
][];
export type FriendRecord = {
  [netId: NetId]: {
    name: string;
    worksheets: Worksheet;
  };
};
export type FriendRequest = {
  netId: string;
  name: string;
};
export type FriendName = {
  netId: NetId;
  first: string;
  last: string;
  college: string;
};
type Store = {
  user: {
    netId?: NetId;
    worksheet?: Worksheet;
    hasEvals?: boolean;
    year?: number;
    school?: string;
    friendRequests?: FriendRequest[];
    friends?: FriendRecord;
    allNames?: FriendName[];
  };
  userRefresh: (suppressError?: boolean) => Promise<void>;
  friendRefresh: (suppressError?: boolean) => Promise<void>;
  friendReqRefresh: (suppressError?: boolean) => Promise<void>;
  addFriend: (friendNetId: string) => Promise<void>;
  removeFriend: (friendNetId: string) => Promise<void>;
  requestAddFriend: (friendNetId: string) => Promise<void>;
  getAllNames: (suppressError?: boolean) => Promise<void>;
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
  // User's netId
  const [netId, setNetId] = useState<NetId | undefined>(undefined);
  // User's worksheet
  const [worksheet, setWorksheet] = useState<Worksheet | undefined>(undefined);
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
    FriendRequest[] | undefined
  >(undefined);
  // All names, used for searching
  const [allNames, setAllNames] = useState<FriendName[] | undefined>(undefined);

  // Refresh user worksheet
  const userRefresh = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/user/worksheets`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setNetId(data.netId);
        setHasEvals(data.evaluationsEnabled);
        setYear(data.year);
        setSchool(data.school);
        setWorksheet(data.data);
        Sentry.setUser({ username: data.netId });
      } catch (err) {
        setNetId(undefined);
        setWorksheet(undefined);
        setHasEvals(undefined);
        setYear(undefined);
        setSchool(undefined);
        Sentry.getCurrentScope().clear();
        if (!suppressError) {
          toast.error(`Failed to fetch user data. ${String(err)}`);
          Sentry.captureException(err);
        }
      }
    },
    [setWorksheet, setNetId, setHasEvals, setYear, setSchool],
  );

  // Refresh user friends stuff
  const friendRefresh = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/friends/worksheets`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setFriends(data.friends);
      } catch (err) {
        if (!suppressError) {
          toast.error(`Failed to fetch friends data. ${String(err)}`);
          Sentry.captureException(err);
        }
        setFriends(undefined);
      }
    },
    [setFriends],
  );

  // Refresh friend requests
  const friendReqRefresh = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/friends/getRequests`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        // Successfully fetched friends' worksheets
        setFriendRequests(data.requests);
      } catch (err) {
        if (!suppressError) {
          toast.error(`Failed to get friend requests. ${String(err)}`);
          Sentry.captureException(err);
        }
        setFriendRequests(undefined);
      }
    },
    [setFriendRequests],
  );

  const getAllNames = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/friends/names`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setAllNames(data.names);
      } catch (err) {
        if (!suppressError) {
          toast.error(`Failed to get user names. ${String(err)}`);
          Sentry.captureException(err);
        }
        setAllNames(undefined);
      }
    },
    [],
  );

  const addFriend = useCallback(async (friendNetId: string): Promise<void> => {
    try {
      const res = await fetch(`${API_ENDPOINT}/api/friends/add`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ friendNetId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.info(`Added friend: ${friendNetId}`);
      window.location.reload();
    } catch (err) {
      toast.error(`Failed to add friend. ${String(err)}`);
      Sentry.captureException(err);
    }
  }, []);

  const removeFriend = useCallback(
    async (friendNetId: string): Promise<void> => {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/friends/remove`, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ friendNetId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.info(`Removed friend: ${friendNetId}`);
        window.location.reload();
      } catch (err) {
        toast.error(`Failed to remove friend. ${String(err)}`);
        Sentry.captureException(err);
      }
    },
    [],
  );

  const requestAddFriend = useCallback(
    async (friendNetId: string): Promise<void> => {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/friends/request`, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ friendNetId }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.info(`Sent friend request: ${friendNetId}`);
      } catch (err) {
        toast.error(`Failed to request friend. ${String(err)}`);
        Sentry.captureException(err);
      }
    },
    [],
  );

  const user = useMemo(
    () => ({
      netId,
      worksheet,
      hasEvals,
      year,
      school,
      friendRequests,
      friends,
      allNames,
    }),
    [
      netId,
      worksheet,
      hasEvals,
      year,
      school,
      friendRequests,
      friends,
      allNames,
    ],
  );

  const store = useMemo(
    () => ({
      user,
      userRefresh,
      friendRefresh,
      friendReqRefresh,
      addFriend,
      removeFriend,
      requestAddFriend,
      getAllNames,
    }),
    [
      user,
      userRefresh,
      friendRefresh,
      friendReqRefresh,
      addFriend,
      removeFriend,
      requestAddFriend,
      getAllNames,
    ],
  );

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext)!;
