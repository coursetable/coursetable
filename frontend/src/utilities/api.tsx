// This file contains all the interactions with the backend. In testing, we can
// swap this file with a file that serves static data instead of making network
// requests.
import React from 'react';
import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';
import z from 'zod';

import { LinkLikeText } from '../components/Typography';
import { API_ENDPOINT } from '../config';
import type { Season, Crn, Listing, NetId } from './common';

export async function toggleBookmark(payload: {
  action: 'add' | 'remove';
  season: Season;
  crn: Crn;
  worksheetNumber: number;
}): Promise<boolean> {
  const body = JSON.stringify(payload);
  try {
    const res = await fetch(`${API_ENDPOINT}/api/user/toggleBookmark`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      switch (data.error) {
        // These errors can be triggered if the user clicks the button twice
        // in a row
        // TODO: we should debounce the request instead
        case 'ALREADY_BOOKMARKED':
          toast.error('You have already added this class to your worksheet');
          break;
        case 'NOT_BOOKMARKED':
          toast.error('You have already remove this class from your worksheet');
          break;
        default:
          throw new Error(data.error ?? res.statusText);
      }
      return false;
    }
    return true;
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'worksheet',
      message: `Updating worksheet: ${body}`,
      level: 'info',
    });
    Sentry.captureException(err);
    toast.error(`Failed to update worksheet. ${String(err)}`);
    return false;
  }
}

export async function fetchCatalog(season: Season) {
  const res = await fetch(
    `${API_ENDPOINT}/api/static/catalogs/${season}.json`,
    { credentials: 'include' },
  );
  if (!res.ok) {
    // TODO: better error handling here; we may want to get rid of async-lock
    // first
    throw new Error(
      `failed to fetch course data for ${season}. ${res.statusText}`,
    );
  }
  const data = (await res.json()) as Listing[];
  const info = new Map<Crn, Listing>();
  for (const listing of data) info.set(listing.crn, listing);
  return info;
}

export async function logout() {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/auth/logout`, {
      credentials: 'include',
    });
    if (!res.ok)
      throw new Error(((await res.json()) as { error?: string }).error);
    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/u, '')
        .replace(/=.*/u, `=;expires=${new Date().toUTCString()};path=/`);
    });
    // Redirect to home page and refresh as well
    window.location.pathname = '/';
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'user',
      message: 'Signing out',
      level: 'info',
    });
    Sentry.captureException(err);
    toast.error(`Failed to sign out. ${String(err)}`);
  }
}

const requestResSchema = z.object({
  token: z.string(),
  salt: z.string(),
  courseInfo: z.array(
    z.object({
      courseId: z.number(),
      courseTitle: z.string(),
      courseRatingIndex: z.number(),
      courseOceUrl: z.string(),
    }),
  ),
  challengeTries: z.number(),
  maxChallengeTries: z.number(),
});

export type RequestChallengeResBody = z.infer<typeof requestResSchema>;

export async function requestChallenge(): Promise<
  | { status: 'success'; data: z.infer<typeof requestResSchema> }
  | { status: 'error'; message?: string }
> {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/challenge/request`, {
      credentials: 'include',
    });
    const rawData: unknown = await res.json();
    if (!res.ok) {
      return {
        status: 'error',
        message: (rawData as { error?: string }).error ?? res.statusText,
      };
    }
    const data = requestResSchema.parse(rawData);
    return { status: 'success', data };
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'challenge',
      message: 'Requesting challenge',
      level: 'info',
    });
    Sentry.captureException(err);
    toast.error(`Failed to request challenge. ${String(err)}`);
    return { status: 'error' };
  }
}

const verifyResSchema = z.object({
  results: z.array(z.boolean()),
  challengeTries: z.number(),
  maxChallengeTries: z.number(),
});

export async function verifyChallenge(payload: {
  token: string;
  salt: string;
  answers: {
    answer: number;
    courseRatingId: number;
    courseRatingIndex: number;
  }[];
}): Promise<
  | { status: 'accepted' }
  | { status: 'rejected'; data: z.infer<typeof verifyResSchema> }
  | { status: 'error'; message?: string }
> {
  const body = JSON.stringify(payload);
  try {
    const res = await fetch(`${API_ENDPOINT}/api/challenge/verify`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const rawData: unknown = await res.json();
    if (!res.ok) {
      return {
        status: 'error',
        message: (rawData as { error?: string }).error ?? res.statusText,
      };
    }
    const data = verifyResSchema.parse(rawData);
    if (data.results.every((x) => x)) return { status: 'accepted' };
    return { status: 'rejected', data };
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'challenge',
      message: `Verifying challenge ${body}`,
      level: 'info',
    });
    Sentry.captureException(err);
    toast.error(`Failed to verify challenge. ${String(err)}`);
    return { status: 'error' };
  }
}

const userWorksheetsSchema = z.record(
  z.record(
    z.array(
      z.object({
        crn: z.number(),
      }),
    ),
  ),
);

const userWorksheetsResSchema = z.object({
  netId: z.string(),
  // This cannot be null in the real application, because the site creates a
  // user if one doesn't exist. This is purely for completeness.
  evaluationsEnabled: z.union([z.boolean(), z.null()]),
  year: z.union([z.number(), z.null()]),
  school: z.union([z.string(), z.null()]),
  data: userWorksheetsSchema,
});

export async function fetchUserWorksheets() {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/user/worksheets`, {
      credentials: 'include',
    });
    const rawData: unknown = await res.json();
    if (!res.ok)
      throw new Error((rawData as { error?: string }).error ?? res.statusText);
    const data = userWorksheetsResSchema.parse(rawData);
    return data;
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'user',
      message: 'Fetching user data',
      level: 'info',
    });
    Sentry.captureException(err);
    Sentry.getCurrentScope().clear();
    toast.error(`Failed to fetch user data. ${String(err)}`);
    return undefined;
  }
}

const friendsResSchema = z.object({
  friends: z.record(
    z.object({
      name: z.string(),
      worksheets: userWorksheetsSchema,
    }),
  ),
});

export async function fetchFriendWorksheets() {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/friends/worksheets`, {
      credentials: 'include',
    });
    const rawData: unknown = await res.json();
    if (!res.ok)
      throw new Error((rawData as { error?: string }).error ?? res.statusText);
    const data = friendsResSchema.parse(rawData);
    return data;
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'friends',
      message: 'Fetching friends data',
      level: 'info',
    });
    Sentry.captureException(err);
    toast.error(`Failed to fetch friends data. ${String(err)}`);
    return undefined;
  }
}

const friendRequestsSchema = z.object({
  requests: z.array(
    z.object({
      netId: z.string(),
      name: z.string(),
    }),
  ),
});

export async function fetchFriendReqs() {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/friends/getRequests`, {
      credentials: 'include',
    });
    const rawData: unknown = await res.json();
    if (!res.ok)
      throw new Error((rawData as { error?: string }).error ?? res.statusText);
    const data = friendRequestsSchema.parse(rawData);
    return data;
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'friends',
      message: 'Fetching friend requests',
      level: 'info',
    });
    Sentry.captureException(err);
    toast.error(`Failed to get friend requests. ${String(err)}`);
    return undefined;
  }
}

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

export async function fetchAllNames() {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/friends/names`, {
      credentials: 'include',
    });
    const rawData: unknown = await res.json();
    if (!res.ok)
      throw new Error((rawData as { error?: string }).error ?? res.statusText);
    const data = friendsNamesResSchema.parse(rawData);
    return data;
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'friends',
      message: 'Fetching friend names',
      level: 'info',
    });
    Sentry.captureException(err);
    toast.error(`Failed to get user names. ${String(err)}`);
    return undefined;
  }
}

export async function addFriend(friendNetId: NetId) {
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
}

export async function requestAddFriend(friendNetId: NetId) {
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
}

export function removeFriend(friendNetId: string, isRequest: boolean) {
  toast.warn(
    <>
      You are about to {isRequest ? 'decline a request from' : 'remove'}{' '}
      {friendNetId}.<b>This is irreversible without another friend request.</b>
      Do you want to continue?
      <LinkLikeText
        onClick={async () => {
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
            toast.info(
              `${isRequest ? 'Declined request from' : 'Removed friend'} ${friendNetId}`,
            );
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
        }}
      >
        Yes
      </LinkLikeText>
      <LinkLikeText
        onClick={() => {
          toast.dismiss();
        }}
      >
        No
      </LinkLikeText>
    </>,
    { autoClose: false },
  );
}

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

export async function checkAuth() {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/auth/check`, {
      credentials: 'include',
    });
    const rawData: unknown = await res.json();
    if (!res.ok)
      throw new Error((rawData as { error?: string }).error ?? res.statusText);
    const data = authCheckResSchema.parse(rawData);
    if (!data.auth) return false;
    Sentry.setUser({ username: data.netId });
    return true;
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'user',
      message: 'Fetching user login status',
      level: 'info',
    });
    Sentry.captureException(err);
    Sentry.getCurrentScope().clear();
    toast.error(`Failed to fetch login status. ${String(err)}`);
    return false;
  }
}
