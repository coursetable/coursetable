import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';
import z from 'zod';
import type { NetId, Season, Crn } from '../utilities/common';
import { API_ENDPOINT } from '../config';

const friendRequestsSchema = z.object({
  requests: z.array(
    z.object({
      netId: z.string(),
      name: z.string(),
    }),
  ),
});

const userWorksheetsSchema = z.record(
  z.record(
    z.array(
      z.object({
        crn: z.number(),
      }),
    ),
  ),
);

const friendsResSchema = z.object({
  friends: z.record(
    z.object({
      name: z.string(),
      worksheets: userWorksheetsSchema,
    }),
  ),
});

const userWorksheetsResSchema = z.object({
  netId: z.string(),
  // This cannot be null in the real application, because the site creates a
  // user if one doesn't exist. This is purely for completeness.
  evaluationsEnabled: z.union([z.boolean(), z.null()]),
  year: z.union([z.number(), z.null()]),
  school: z.union([z.string(), z.null()]),
  data: userWorksheetsSchema,
});

const friendsNamesResSchema = z.object({
  names: z.array(
    z.object({
      netId: z.string(),
      first: z.union([z.string(), z.null()]),
      last: z.union([z.string(), z.null()]),
      college: z.union([z.string(), z.null()]),
    }),
  ),
});

const authCheckResSchema = z.union([
  z.object({
    auth: z.literal(true),
    netId: z.string(),
    user: z.object({
      netId: z.string(),
      evals: z.boolean(),
      email: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
  }),
  z.object({
    auth: z.literal(false),
    netId: z.null(),
    user: z.null(),
  }),
]);

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
    try {
      const res = await fetch(`${API_ENDPOINT}/api/user/worksheets`, {
        credentials: 'include',
      });
      const rawData: unknown = await res.json();
      if (!res.ok) {
        throw new Error(
          (rawData as { error?: string }).error ?? res.statusText,
        );
      }
      const data = userWorksheetsResSchema.parse(rawData);
      setNetId(data.netId satisfies string as NetId);
      setHasEvals(data.evaluationsEnabled ?? undefined);
      setYear(data.year ?? undefined);
      setSchool(data.school ?? undefined);
      setWorksheets(data.data as UserWorksheets);
    } catch (err) {
      Sentry.addBreadcrumb({
        category: 'user',
        message: 'Fetching user data',
        level: 'info',
      });
      Sentry.captureException(err);
      Sentry.getCurrentScope().clear();
      toast.error(`Failed to fetch user data. ${String(err)}`);
      setNetId(undefined);
      setWorksheets(undefined);
      setHasEvals(undefined);
      setYear(undefined);
      setSchool(undefined);
    }
  }, [setWorksheets, setNetId, setHasEvals, setYear, setSchool]);

  // Refresh user friends stuff
  const friendRefresh = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${API_ENDPOINT}/api/friends/worksheets`, {
        credentials: 'include',
      });
      const rawData: unknown = await res.json();
      if (!res.ok) {
        throw new Error(
          (rawData as { error?: string }).error ?? res.statusText,
        );
      }
      const data = friendsResSchema.parse(rawData);
      setFriends(data.friends as FriendRecord);
    } catch (err) {
      Sentry.addBreadcrumb({
        category: 'friends',
        message: 'Fetching friends data',
        level: 'info',
      });
      Sentry.captureException(err);
      toast.error(`Failed to fetch friends data. ${String(err)}`);
      setFriends(undefined);
    }
  }, [setFriends]);

  // Refresh friend requests
  const friendReqRefresh = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${API_ENDPOINT}/api/friends/getRequests`, {
        credentials: 'include',
      });
      const rawData: unknown = await res.json();
      if (!res.ok) {
        throw new Error(
          (rawData as { error?: string }).error ?? res.statusText,
        );
      }
      const data = friendRequestsSchema.parse(rawData);
      setFriendRequests(data.requests as FriendRequests);
    } catch (err) {
      Sentry.addBreadcrumb({
        category: 'friends',
        message: 'Fetching friend requests',
        level: 'info',
      });
      Sentry.captureException(err);
      toast.error(`Failed to get friend requests. ${String(err)}`);
      setFriendRequests(undefined);
    }
  }, [setFriendRequests]);

  const getAllNames = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`${API_ENDPOINT}/api/friends/names`, {
        credentials: 'include',
      });
      const rawData: unknown = await res.json();
      if (!res.ok) {
        throw new Error(
          (rawData as { error?: string }).error ?? res.statusText,
        );
      }
      const data = friendsNamesResSchema.parse(rawData);
      setAllNames(data.names as FriendNames);
    } catch (err) {
      Sentry.addBreadcrumb({
        category: 'friends',
        message: 'Fetching friend names',
        level: 'info',
      });
      Sentry.captureException(err);
      toast.error(`Failed to get user names. ${String(err)}`);
      setAllNames([]);
    }
  }, []);

  const addFriend = useCallback(async (friendNetId: string): Promise<void> => {
    const body = JSON.stringify({ friendNetId });
    try {
      const res = await fetch(`${API_ENDPOINT}/api/friends/add`, {
        method: 'POST',
        credentials: 'include',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        // The only way for users to legally interact with this API is through
        // the requests dropdown, so anything that doesn't seem right should be
        // reported to us
        throw new Error(data.error ?? res.statusText);
      }
      toast.info(`Added friend: ${friendNetId}`);
      window.location.reload();
    } catch (err) {
      Sentry.addBreadcrumb({
        category: 'friends',
        message: `Adding friend ${body}`,
        level: 'info',
      });
      Sentry.captureException(err);
      toast.error(`Failed to add friend. ${String(err)}`);
    }
  }, []);

  const removeFriend = useCallback(
    async (friendNetId: string): Promise<void> => {
      const body = JSON.stringify({ friendNetId });
      try {
        const res = await fetch(`${API_ENDPOINT}/api/friends/remove`, {
          method: 'POST',
          credentials: 'include',
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          throw new Error(data.error ?? res.statusText);
        }
        toast.info(`Removed friend: ${friendNetId}`);
        window.location.reload();
      } catch (err) {
        Sentry.addBreadcrumb({
          category: 'friends',
          message: `Removing friend ${body}`,
          level: 'info',
        });
        Sentry.captureException(err);
        toast.error(`Failed to remove friend. ${String(err)}`);
      }
    },
    [],
  );

  const requestAddFriend = useCallback(
    async (friendNetId: NetId): Promise<void> => {
      // Prevent sending to server in common error cases
      if (friendNetId === netId) {
        toast.error('You cannot request yourself as friend!');
        return;
      } else if (friends?.[friendNetId]) {
        toast.error(`You are already friends with ${friendNetId}.`);
        return;
      } else if (friendRequests?.find((x) => x.netId === friendNetId)) {
        toast.error(
          `You already received a friend request from ${friendNetId}. Go approve the request instead!`,
        );
        return;
      }
      const body = JSON.stringify({ friendNetId });
      try {
        const res = await fetch(`${API_ENDPOINT}/api/friends/request`, {
          method: 'POST',
          credentials: 'include',
          body,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          switch (data.error) {
            case 'FRIEND_NOT_FOUND':
              toast.error(`The net ID ${friendNetId} does not exist.`);
              break;
            case 'ALREADY_SENT_REQUEST':
              toast.error(
                `You already sent a friend request to ${friendNetId}. Wait for them to accept it!`,
              );
              break;
            // Other error codes should be already prevented client-side; if
            // not, better figure out why
            default:
              throw new Error(data.error ?? res.statusText);
          }
          return;
        }
        toast.info(`Sent friend request: ${friendNetId}`);
      } catch (err) {
        Sentry.addBreadcrumb({
          category: 'friends',
          message: `Requesting friend ${body}`,
          level: 'info',
        });
        Sentry.captureException(err);
        toast.error(`Failed to request friend. ${String(err)}`);
      }
    },
    [netId, friends, friendRequests],
  );

  // Refresh user worksheet and friends data on page load
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/auth/check`, {
          credentials: 'include',
        });
        const rawData: unknown = await res.json();
        if (!res.ok) {
          throw new Error(
            (rawData as { error?: string }).error ?? res.statusText,
          );
        }
        const data = authCheckResSchema.parse(rawData);
        if (!data.auth) return;
        Sentry.setUser({ username: data.netId });
      } catch (err) {
        Sentry.addBreadcrumb({
          category: 'user',
          message: 'Fetching user login status',
          level: 'info',
        });
        Sentry.captureException(err);
        Sentry.getCurrentScope().clear();
        toast.error(`Failed to fetch login status. ${String(err)}`);
        return;
      }
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
      addFriend,
      removeFriend,
      requestAddFriend,
      getAllNames,
    }),
    [
      loading,
      user,
      allNames,
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
