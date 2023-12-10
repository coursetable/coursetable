import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';
import { NetId, Season } from '../utilities/common';
import { API_ENDPOINT } from '../config';

export type Worksheet = [Season, string, string][];
export type FriendRecord = Record<
  NetId,
  {
    name: string;
  }
>;
export type FriendRequest = {
  netId: string;
  name: string;
};
export type FriendInfo = {
  worksheets: Record<NetId, Worksheet>;
  friendInfo: FriendRecord;
};
export type FriendName = {
  netId: string;
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
    friendWorksheets?: FriendInfo;
    allNames?: FriendName[];
  };
  userRefresh(suppressError?: boolean): Promise<void>;
  friendRefresh(suppressError?: boolean): Promise<void>;
  friendReqRefresh(suppressError?: boolean): Promise<void>;
  addFriend(netId1?: string, netId2?: string): Promise<void>;
  removeFriend(netId1?: string, netId2?: string): Promise<void>;
  friendRequest(friendNetId?: string): Promise<void>;
  resolveFriendRequest(friendNetId?: string): Promise<void>;
  getAllNames(suppressError?: boolean): Promise<void>;
};

const UserContext = createContext<Store | undefined>(undefined);
UserContext.displayName = 'UserContext';

/**
 * Stores the user's worksheet, FB login status, and FB friends' worksheets
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  // User's netId
  const [netId, setNetId] = useState<string | undefined>(undefined);
  // User's worksheet
  const [worksheet, setWorksheet] = useState<Worksheet | undefined>(undefined);
  // User's evals enabled status
  const [hasEvals, setHasEvals] = useState<boolean | undefined>(undefined);
  // User's year
  const [year, setYear] = useState<number | undefined>(undefined);
  // User's school
  const [school, setSchool] = useState<string | undefined>(undefined);
  // User's FB friends' worksheets
  const [friendWorksheets, setFbWorksheets] = useState<FriendInfo | undefined>(
    undefined,
  );
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
        const res = await axios.get(`${API_ENDPOINT}/api/user/worksheets`, {
          withCredentials: true,
        });
        if (!res.data.success) {
          throw new Error(res.data.message);
        }

        // Successfully fetched worksheet
        setNetId(res.data.netId);
        setHasEvals(res.data.evaluationsEnabled);
        setYear(res.data.year);
        setSchool(res.data.school);
        setWorksheet(res.data.data);
        Sentry.setUser({ username: res.data.netId });
      } catch (err) {
        // Error with fetching user's worksheet
        setNetId(undefined);
        setWorksheet(undefined);
        setHasEvals(undefined);
        setYear(undefined);
        setSchool(undefined);
        Sentry.configureScope((scope) => scope.clear());
        Sentry.captureException(err);
        if (!suppressError) {
          toast.error('Error fetching worksheet');
        }
      }
    },
    [setWorksheet, setNetId, setHasEvals, setYear, setSchool],
  );

  // Refresh user FB stuff
  const friendRefresh = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const friends_worksheets = await axios.get(
          `${API_ENDPOINT}/api/friends/worksheets`,
          {
            withCredentials: true,
          },
        );
        if (!friends_worksheets.data.success) {
          throw new Error(friends_worksheets.data.message);
        }
        // Successfully fetched friends' worksheets
        setFbWorksheets(friends_worksheets.data);
      } catch (err) {
        // Error with fetching friends' worksheets
        if (!suppressError) {
          Sentry.captureException(err);
          toast.error('Error updating Facebook friends');
        }
        setFbWorksheets(undefined);
      }
    },
    [setFbWorksheets],
  );

  // refresh friend requests
  const friendReqRefresh = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const friendReqs = await axios.get(
          `${API_ENDPOINT}/api/friends/getRequests`,
          {
            withCredentials: true,
          },
        );
        if (!friendReqs.data.success) {
          throw new Error(friendReqs.data.message);
        }
        // Successfully fetched friends' worksheets
        setFriendRequests(friendReqs.data.friends);
      } catch (err) {
        // Error with fetching friends' worksheets
        if (!suppressError) {
          Sentry.captureException(err);
          toast.error('Error getting friend requests');
        }
        setFriendRequests(undefined);
      }
    },
    [setFriendRequests],
  );

  const getAllNames = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const names = await axios.get(`${API_ENDPOINT}/api/friends/names`, {
          withCredentials: true,
        });
        if (!names.data.success) {
          throw new Error(names.data.message);
        }
        setAllNames(names.data.names);
      } catch (err) {
        if (!suppressError) {
          Sentry.captureException(err);
          toast.error('Error getting friend requests');
        }
        setAllNames(undefined);
      }
    },
    [],
  );

  // Add Friend
  const addFriend = useCallback((netId1 = '', netId2 = ''): Promise<void> => {
    return axios.get(
      `${API_ENDPOINT}/api/friends/add/?id=${netId1}&id2=${netId2}`,
      {
        withCredentials: true,
      },
    );
  }, []);

  // Remove Friend
  const removeFriend = useCallback(
    (netId1 = '', netId2 = ''): Promise<void> => {
      return axios.get(
        `${API_ENDPOINT}/api/friends/remove/?id=${netId1}&id2=${netId2}`,
        {
          withCredentials: true,
        },
      );
    },
    [],
  );

  const friendRequest = useCallback((friendNetId = ''): Promise<void> => {
    return axios.get(`${API_ENDPOINT}/api/friends/request/?id=${friendNetId}`, {
      withCredentials: true,
    });
  }, []);

  const resolveFriendRequest = useCallback(
    (friendNetId = ''): Promise<void> => {
      return axios.get(
        `${API_ENDPOINT}/api/friends/resolveRequest/?id=${friendNetId}`,
        {
          withCredentials: true,
        },
      );
    },
    [],
  );

  const user = useMemo(() => {
    return {
      netId,
      worksheet,
      hasEvals,
      year,
      school,
      friendRequests,
      friendWorksheets,
      allNames,
    };
  }, [
    netId,
    worksheet,
    hasEvals,
    year,
    school,
    friendRequests,
    friendWorksheets,
    allNames,
  ]);

  const store = useMemo(
    () => ({
      // Context state.
      user,

      // Update methods.
      userRefresh,
      friendRefresh,
      friendReqRefresh,
      addFriend,
      removeFriend,
      friendRequest,
      resolveFriendRequest,
      getAllNames,
    }),
    [
      user,
      userRefresh,
      friendRefresh,
      friendReqRefresh,
      addFriend,
      removeFriend,
      friendRequest,
      resolveFriendRequest,
      getAllNames,
    ],
  );

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext)!;
