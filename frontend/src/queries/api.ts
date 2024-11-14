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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
): Promise<{} | undefined>;
/**
 * Performs either a GET or POST request to the API, depending on whether a body
 * is present. A response body is expected and will be parsed.
 * Returns the parsed response if successful, or undefined if an error occurred.
 */
async function fetchAPI<T extends z.ZodSchema>(
  endpointSuffix: string,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
      // Handle common errors uniformly
      switch (errorCode) {
        case 'USER_NOT_FOUND':
          toast.info('Login expired. Please log in again.');
          return noResExpected ? false : undefined;
        case 'INVALID_REQUEST':
          toast.error(
            'The server did not understand this request. Please refresh the page and try again.',
          );
          return noResExpected ? false : undefined;
        default:
          // Let the handler handle it first
          if (handleErrorCode?.(errorCode))
            return noResExpected ? false : undefined;
          throw new Error(errorCode);
      }
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
    toast.error(
      `Failed while ${breadcrumb.message.toLowerCase()}: ${String(err)}`,
    );
    return noResExpected ? false : undefined;
  }
}

export function updateWorksheetCourses(
  body: {
    season: Season;
    crn: Crn;
    worksheetNumber: number;
  } & (
    | {
        action: 'add';
        color: string;
        hidden: boolean;
      }
    | {
        action: 'remove' | 'update';
        color?: string;
        hidden?: boolean;
      }
  ),
): Promise<boolean> {
  return fetchAPI('/user/updateWorksheetCourses', {
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

export async function updateWorksheetMetadata(
  body: {
    season: Season;
  } & (
    | {
        action: 'add';
      }
    | {
        action: 'delete';
        worksheetNumber: number;
      }
    | {
        action: 'rename';
        worksheetNumber: number;
        worksheetName: string;
      }
  ),
): Promise<boolean> {
  return fetchAPI('/user/updateWorksheetMetadata', {
    body,
    breadcrumb: {
      category: 'worksheet',
      message: `Updating worksheet names`,
    },
    handleErrorCode(err) {
      switch (err) {
        case 'WORKSHEET_NOT_FOUND':
          toast.error('Worksheet not found.');
          return true;
        default:
          return false;
      }
    },
  });
}

const hiddenCoursesStorage = createLocalStorageSlot<{
  [seasonCode: Season]: { [crn: Crn]: boolean };
}>('hiddenCourses');

export function toggleCourseHidden({
  season,
  worksheetNumber,
  crn,
  hidden,
}: {
  season: Season;
  worksheetNumber: number;
  crn: Crn | Crn[];
  hidden: boolean;
}): Promise<boolean> {
  if (Array.isArray(crn)) {
    const actions = crn.map((c) => ({
      action: 'update',
      season,
      worksheetNumber,
      crn: c,
      hidden,
    }));
    return fetchAPI('/user/updateWorksheetCourses', {
      body: actions,
      breadcrumb: {
        category: 'worksheet',
        message: 'Batch updating worksheet hidden status',
      },
    });
  }
  return fetchAPI('/user/updateWorksheetCourses', {
    body: {
      action: 'update',
      season,
      crn,
      worksheetNumber,
      hidden,
    },
    breadcrumb: {
      category: 'worksheet',
      message: 'Updating worksheet hidden status',
    },
  });
}

const catalogMetadataSchema = z.object({
  last_update: z.string().transform((x) => new Date(x)),
});

export type CatalogMetadata = z.infer<typeof catalogMetadataSchema>;

export function fetchCatalogMetadata() {
  return fetchAPI('/catalog/metadata', {
    breadcrumb: {
      category: 'catalog',
      message: 'Fetching catalog metadata',
    },
    schema: catalogMetadataSchema,
  });
}

type CoursePublic = CatalogBySeasonQuery['courses'][number];

export async function fetchCatalog(season: Season) {
  const breadcrumb = {
    category: 'catalog',
    message: `Fetching catalog ${season}`,
  };
  const res = await fetchAPI(`/catalog/public/${season}`, {
    breadcrumb,
  });
  if (!res) return undefined;
  const data = res as CatalogBySeasonQuery['courses'];
  const info = new Map<number, CoursePublic>();
  for (const course of data) info.set(course.course_id, course);
  return info;
}

type CourseEvals = EvalsBySeasonQuery['courses'][number];

export type CatalogListing = CoursePublic['listings'][number] & {
  course: CoursePublic & Partial<CourseEvals>;
};

export async function fetchEvals(season: Season) {
  const res = await fetchAPI(`/catalog/evals/${season}`, {
    breadcrumb: {
      category: 'evals',
      message: `Fetching evals ${season}`,
    },
  });
  if (!res) return undefined;
  const data = res as EvalsBySeasonQuery['courses'];
  const info = new Map<number, CourseEvals>();
  for (const course of data) info.set(course.course_id, course);
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
        hidden: z.boolean().nullable(),
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
  // If the server doesn't know about the hidden status for any course, but
  // there exists locally stored data, then we use this and sync it with the
  // server. This is a one-time operation to migrate from our old client-side
  // logic to be server-side, to make it consistent between devices and friends.
  const actions = [];
  for (const seasonKey in res.data) {
    const season = seasonKey as Season;
    for (const num in res.data[season]) {
      for (const course of res.data[season][num]!) {
        if (course.hidden === null) {
          course.hidden = hiddenCourses[season]?.[course.crn] ?? false;
          actions.push({
            action: 'update',
            season,
            crn: course.crn,
            worksheetNumber: Number(num),
            hidden: course.hidden,
          });
        }
      }
    }
  }
  if (actions.length) {
    const updateRes = await fetchAPI('/user/updateWorksheetCourses', {
      body: actions,
      breadcrumb: {
        category: 'worksheet',
        message: 'Syncing hidden courses',
      },
    });
    // No longer need this data
    if (updateRes) hiddenCoursesStorage.remove();
  } else {
    // There's no data to update, which means it's already synced from another
    // device. We use the "first-wins" strategy and only sync data from the
    // first device that logged in, and assume that one is the primary device.
    hiddenCoursesStorage.remove();
  }
  return res;
}

const worksheetSchema = z.object({
  worksheetName: z.string(),
});

const worksheetsSchema = z.record(
  z.string(), // season
  z.record(
    z.string(), // worksheetNumber keys
    worksheetSchema,
  ),
);

export async function fetchUserWorksheetMetadata() {
  const res = await fetchAPI('/user/worksheetMetadata', {
    breadcrumb: {
      category: 'worksheet',
      message: 'Fetching user worksheet names',
    },
    schema: z.object({
      netId: netIdSchema,
      worksheets: worksheetsSchema,
      // { [season]: { [worksheetNumber]: { worksheetName } } }
    }),
  });
  if (!res) return undefined;
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
