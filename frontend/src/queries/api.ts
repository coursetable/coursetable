// This file contains all the interactions with the backend. In testing, we can
// swap this file with a file that serves static data instead of making network
// requests.
import * as Sentry from '@sentry/react';
import { toast } from 'react-toastify';
import z from 'zod';

import {
  crnSchema,
  netIdSchema,
  type Season,
  type Crn,
  type NetId,
} from './graphql-types';
import { API_ENDPOINT } from '../config';
import type {
  CatalogBySeasonQuery,
  EvalsBySeasonQuery,
} from '../generated/graphql-types';
import { createLocalStorageSlot } from '../utilities/browserStorage';

type BaseFetchOptions = {
  breadcrumb: Sentry.Breadcrumb & {
    message: string;
    category: string;
  };
  /**
   * Receives the parsed error code. If it returns true, the error is considered
   * handled and no further reporting is done. Only HTTP errors can be handled.
   */
  handleErrorCode?: (errCode: string) => boolean;
};

function parseWithWarning<T extends z.ZodSchema<unknown>>(
  schema: T,
  data: unknown,
  breadcrumb: Sentry.Breadcrumb & {
    message: string;
    category: string;
  },
): z.infer<T> | undefined {
  const res = schema.safeParse(data);
  if (res.success) return res.data;
  Sentry.addBreadcrumb({
    level: 'info',
    ...breadcrumb,
  });
  Sentry.captureException(res.error);
  toast.error(
    `The server returned a response we cannot understand while ${breadcrumb.message.toLowerCase()}. Please try refreshing the page and/or reopening in a new tab.`,
  );
  return undefined;
}

/**
 * Performs a POST request to the API. No schema provided means no response body
 * is expected. In this case, it returns a boolean indicating whether the
 * request was successful (200 status code).
 */
async function fetchAPI(
  endpointSuffix: string,
  options: BaseFetchOptions & ({ body: {} } | { method: 'POST' }),
): Promise<boolean>;
/**
 * Performs a GET request to the API. Returns a non-null value containing the
 * response body (without validation) if the request was successful, or
 * undefined if an error occurred.
 */
async function fetchAPI(
  endpointSuffix: string,
  options: BaseFetchOptions,
): Promise<{} | undefined>;
/**
 * Performs either a GET or POST request to the API, depending on whether a body
 * is present. A response body is expected and will be parsed.
 * Returns the parsed response if successful, or undefined if an error occurred.
 */
async function fetchAPI<T extends z.ZodSchema>(
  endpointSuffix: string,
  options: BaseFetchOptions & { body?: {}; schema: T },
): Promise<z.infer<T> | undefined>;
async function fetchAPI(
  endpointSuffix: string,
  {
    body,
    method,
    schema,
    breadcrumb,
    handleErrorCode,
  }: BaseFetchOptions & {
    body?: {};
    method?: 'POST' | 'GET';
    schema?: z.ZodType<unknown>;
  },
): Promise<unknown> {
  const payload = JSON.stringify(body);
  const fetchInit: RequestInit = body
    ? {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      }
    : {
        method: method ?? 'GET',
        credentials: 'include',
      };
  const noResExpected = !schema && fetchInit.method === 'POST';
  try {
    const res = await fetch(`${API_ENDPOINT}/api${endpointSuffix}`, fetchInit);
    if (!res.ok) {
      let errorCode = '';
      // First: try to parse out a structured error code
      try {
        errorCode = String(
          ((await res.json()) as { error?: unknown } | null)?.error ?? '',
        );
      } catch {}
      // Fall back to status text
      errorCode ||= res.statusText;
      // Let the handler handle it first
      if (handleErrorCode?.(errorCode))
        return noResExpected ? false : undefined;
      throw new Error(errorCode);
    }
    // If no res body is expected, return early
    if (noResExpected) return true;
    const rawData: unknown = await res.json();
    // Only parse if a schema is provided
    if (!schema) return rawData;
    return parseWithWarning(schema, rawData, breadcrumb);
  } catch (err) {
    Sentry.addBreadcrumb({
      level: 'info',
      ...breadcrumb,
      message: body ? `${breadcrumb.message} ${payload}` : breadcrumb.message,
    });
    Sentry.captureException(err);
    let message = String(err);
    if (message.includes('INVALID_REQUEST')) {
      message +=
        ' Please try refreshing the page and/or reopening in a new tab.';
    }
    toast.error(`Failed while ${breadcrumb.message.toLowerCase()}: ${message}`);
    return noResExpected ? false : undefined;
  }
}

export function updateWorksheet(body: {
  action: 'add' | 'remove' | 'update';
  season: Season;
  crn: Crn;
  worksheetNumber: number;
  color: string;
  hidden: boolean;
}): Promise<boolean> {
  return fetchAPI('/user/updateWorksheet', {
    body,
    handleErrorCode(err) {
      switch (err) {
        // These errors can be triggered if the user clicks the button twice
        // in a row
        // TODO: we should debounce the request instead
        case 'ALREADY_BOOKMARKED':
          toast.error('You have already added this class to your worksheet');
          return true;
        case 'NOT_BOOKMARKED':
          toast.error(
            'You have already removed this class from your worksheet',
          );
          return true;
        default:
          return false;
      }
    },
    breadcrumb: {
      category: 'worksheet',
      message: 'Updating worksheet',
    },
  });
}

const hiddenCoursesStorage = createLocalStorageSlot<{
  [seasonCode: Season]: { [crn: Crn]: boolean };
}>('hiddenCourses');

export function toggleCourseHidden({
  season,
  crn,
  hidden,
  courses,
}: {
  season: Season;
  crn: Crn | 'all';
  hidden: boolean;
  courses?: { crn: Crn }[];
}) {
  const hiddenCourses = hiddenCoursesStorage.get() ?? {};
  if (crn === 'all') {
    if (hidden) {
      hiddenCourses[season] ??= {};
      courses?.forEach((listing) => {
        hiddenCourses[season]![listing.crn] = true;
      });
    } else {
      delete hiddenCourses[season];
    }
  } else {
    // eslint-disable-next-line no-multi-assign
    const curSeason = (hiddenCourses[season] ??= {});
    if (hidden) curSeason[crn] = true;
    else delete curSeason[crn];
  }
  hiddenCoursesStorage.set(hiddenCourses);
}

type ListingPublic = CatalogBySeasonQuery['listings'][number];

export async function fetchCatalog(season: Season) {
  const breadcrumb = {
    category: 'catalog',
    message: `Fetching catalog ${season}`,
  };
  const res = await fetchAPI(`/catalog/public/${season}`, {
    breadcrumb,
  });
  if (!res) return undefined;
  const data = res as ListingPublic[];
  const info = new Map<Crn, ListingPublic>();
  for (const listing of data) info.set(listing.crn, listing);
  return info;
}

type ListingEvals = EvalsBySeasonQuery['listings'][number];

export type CatalogListing = ListingPublic & Partial<ListingEvals>;

export async function fetchEvals(season: Season) {
  const res = await fetchAPI(`/catalog/evals/${season}`, {
    breadcrumb: {
      category: 'evals',
      message: `Fetching evals ${season}`,
    },
  });
  if (!res) return undefined;
  const data = res as ListingEvals[];
  const info = new Map<Crn, ListingEvals>();
  for (const listing of data) info.set(listing.crn, listing);
  return info;
}

export async function logout() {
  const res = await fetchAPI('/auth/logout', {
    method: 'POST',
    breadcrumb: {
      category: 'user',
      message: 'Signing out',
    },
  });
  return res;
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
  let message: string | undefined = undefined;
  const res = await fetchAPI('/challenge/request', {
    schema: requestResSchema,
    breadcrumb: {
      category: 'challenge',
      message: 'Requesting challenge',
    },
    handleErrorCode(err) {
      message = err;
      // Intercept all errors
      return true;
    },
  });
  if (!res) return { status: 'error', message };
  return { status: 'success', data: res };
}

const verifyResSchema = z.object({
  results: z.array(z.boolean()),
  challengeTries: z.number(),
  maxChallengeTries: z.number(),
});

export async function verifyChallenge(body: {
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
  | { status: 'error'; message: string | undefined }
> {
  let message: string | undefined = undefined;
  const res = await fetchAPI('/challenge/verify', {
    body,
    schema: verifyResSchema,
    breadcrumb: {
      category: 'challenge',
      message: 'Verifying challenge',
    },
    handleErrorCode(err) {
      message = err;
      // Intercept all errors
      return true;
    },
  });
  if (!res) return { status: 'error', message };
  return res.results.every((x) => x)
    ? { status: 'accepted' }
    : { status: 'rejected', data: res };
}

const userWorksheetsSchema = z.record(
  z.record(
    z.array(
      z.object({
        crn: crnSchema,
        color: z.string(),
        // This currently is not sent by the backend.
        hidden: z.boolean().optional().default(false),
      }),
    ),
  ),
);

// Change index type to be more specific. We don't use the key type of z.record
// on purpose; see https://github.com/colinhacks/zod/pull/2287
export type UserWorksheets = {
  [season: Season]: {
    [worksheetNumber: number]: NonNullable<
      z.infer<typeof userWorksheetsSchema>[Season]
    >[string];
  };
};

export async function fetchUserWorksheets() {
  const res = await fetchAPI('/user/worksheets', {
    schema: z.object({
      netId: netIdSchema,
      // This cannot be null in the real application, because the site creates a
      // user if one doesn't exist. This is purely for completeness.
      evaluationsEnabled: z.union([z.boolean(), z.null()]),
      year: z.union([z.number(), z.null()]),
      school: z.union([z.string(), z.null()]),
      data: userWorksheetsSchema,
    }),
    breadcrumb: {
      category: 'user',
      message: 'Fetching user data',
    },
  });
  if (!res) return undefined;
  const hiddenCourses = hiddenCoursesStorage.get();
  if (!hiddenCourses) return res;
  for (const seasonKey in res.data) {
    // Narrow type
    const season = seasonKey as Season;
    if (!hiddenCourses[season]) continue;
    for (const num in res.data[season]) {
      for (const course of res.data[season]![num]!)
        course.hidden = hiddenCourses[season]?.[course.crn] ?? false;
    }
  }
  return res;
}

const friendsSchema = z.record(
  z.object({
    name: z.string().nullable(),
    worksheets: userWorksheetsSchema,
  }),
);

// Narrower index type
export type FriendRecord = {
  [netId: NetId]: NonNullable<z.infer<typeof friendsSchema>[string]>;
};

export function fetchFriendWorksheets() {
  return fetchAPI('/friends/worksheets', {
    schema: z.object({
      friends: friendsSchema,
    }),
    breadcrumb: {
      category: 'friends',
      message: 'Fetching friends data',
    },
  });
}

const friendRequestsSchema = z.array(
  z.object({
    netId: netIdSchema,
    name: z.string().nullable(),
  }),
);

export type FriendRequests = z.infer<typeof friendRequestsSchema>;

export function fetchFriendReqs() {
  return fetchAPI('/friends/getRequests', {
    schema: z.object({
      requests: friendRequestsSchema,
    }),
    breadcrumb: {
      category: 'friends',
      message: 'Fetching friend requests',
    },
  });
}

const userNamesSchema = z.array(
  z.object({
    netId: netIdSchema,
    first: z.union([z.string(), z.null()]),
    last: z.union([z.string(), z.null()]),
    college: z.union([z.string(), z.null()]),
  }),
);

export type UserNames = z.infer<typeof userNamesSchema>;

export function fetchAllNames() {
  return fetchAPI('/friends/names', {
    schema: z.object({
      names: userNamesSchema,
    }),
    breadcrumb: {
      category: 'friends',
      message: 'Fetching all user names',
    },
  });
}

export function addFriend(friendNetId: NetId) {
  return fetchAPI('/friends/add', {
    body: { friendNetId },
    breadcrumb: {
      category: 'friends',
      message: 'Adding friend',
    },
    // TODO: handleErrorCode
  });
}

export function requestAddFriend(friendNetId: NetId) {
  return fetchAPI('/friends/request', {
    body: { friendNetId },
    breadcrumb: {
      category: 'friends',
      message: 'Requesting friend',
    },
    handleErrorCode(err) {
      switch (err) {
        case 'FRIEND_NOT_FOUND':
          toast.error(`The net ID ${friendNetId} does not exist.`);
          return true;
        case 'ALREADY_SENT_REQUEST':
          toast.error(
            `You already sent a friend request to ${friendNetId}. Wait for them to accept it!`,
          );
          return true;
        default:
          // TODO: handle other errors
          return false;
      }
    },
  });
}

export function removeFriend(friendNetId: string) {
  return fetchAPI('/friends/remove', {
    body: { friendNetId },
    breadcrumb: {
      category: 'friends',
      message: 'Removing friend',
    },
  });
}

export async function checkAuth() {
  const res = await fetchAPI('/auth/check', {
    schema: z.union([
      z.object({
        auth: z.literal(true),
        netId: netIdSchema,
        user: z.object({
          netId: netIdSchema,
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
    ]),
    breadcrumb: {
      category: 'user',
      message: 'Fetching user login status',
    },
  });
  if (!res) {
    Sentry.getCurrentScope().clear();
    return false;
  }
  if (res.auth) Sentry.setUser({ username: res.netId });
  return res.auth;
}
