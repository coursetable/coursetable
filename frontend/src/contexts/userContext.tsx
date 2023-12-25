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
  };
};
export type FriendRequest = {
  netId: string;
  name: string;
};
export type FriendInfo = {
  worksheets: { [netId: NetId]: Worksheet };
  friendInfo: FriendRecord;
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
    friendWorksheets?: FriendInfo;
    allNames?: FriendName[];
  };
  userRefresh: (suppressError?: boolean) => Promise<void>;
  friendRefresh: (suppressError?: boolean) => Promise<void>;
  friendReqRefresh: (suppressError?: boolean) => Promise<void>;
  addFriend: (friendNetId: string) => Promise<void>;
  removeFriend: (friendNetId: string) => Promise<void>;
  friendRequest: (friendNetId: string) => Promise<void>;
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
  // User's friends' worksheets
  const [friendWorksheets, setFriendWorksheets] = useState<
    FriendInfo | undefined
  >(undefined);
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
        if (!res.data.success) throw new Error(res.data.message);

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
        if (!suppressError) toast.error('Error fetching worksheet');
      }
    },
    [setWorksheet, setNetId, setHasEvals, setYear, setSchool],
  );

  // Refresh user friends stuff
  const friendRefresh = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const friendsWorksheets = await axios.get(
          `${API_ENDPOINT}/api/friends/worksheets`,
          { withCredentials: true },
        );
        if (!friendsWorksheets.data.success)
          throw new Error(friendsWorksheets.data.message);

        // Successfully fetched friends' worksheets
        setFriendWorksheets(friendsWorksheets.data);
      } catch (err) {
        // Error with fetching friends' worksheets
        if (!suppressError) {
          Sentry.captureException(err);
          toast.error('Error updating friends');
        }
        setFriendWorksheets(undefined);
      }
    },
    [setFriendWorksheets],
  );

  // Refresh friend requests
  const friendReqRefresh = useCallback(
    async (suppressError = false): Promise<void> => {
      try {
        const friendReqs = await axios.get(
          `${API_ENDPOINT}/api/friends/getRequests`,
          { withCredentials: true },
        );
        if (!friendReqs.data.success) throw new Error(friendReqs.data.message);

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
        if (!names.data.success) throw new Error(names.data.message);

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
  const addFriend = useCallback(
    (friendNetId: string): Promise<void> =>
      axios.post(
        `${API_ENDPOINT}/api/friends/add`,
        { friendNetId },
        { withCredentials: true },
      ),
    [],
  );

  // Remove Friend
  const removeFriend = useCallback(
    (friendNetId: string): Promise<void> =>
      axios.post(
        `${API_ENDPOINT}/api/friends/remove`,
        { friendNetId },
        { withCredentials: true },
      ),
    [],
  );

  const friendRequest = useCallback(
    (friendNetId: string): Promise<void> =>
      axios.post(
        `${API_ENDPOINT}/api/friends/request`,
        { friendNetId },
        { withCredentials: true },
      ),
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
      friendWorksheets,
      allNames,
    }),
    [
      netId,
      worksheet,
      hasEvals,
      year,
      school,
      friendRequests,
      friendWorksheets,
      allNames,
    ],
  );

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
      getAllNames,
    ],
  );

  return <UserContext.Provider value={store}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext)!;
