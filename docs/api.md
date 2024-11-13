# API docs

All endpoints are capable of returning 500. In this case the body contains an `error: string`.

Endpoints marked as "needs credentials" returns 401 with `error: "USER_NOT_FOUND"` when the user is not found.

Endpoints marked as "needs eval access" additionally returns 401 with `error: "USER_NO_EVALS"` when the user exists but has no evals access. Evals access can be granted after completing the challenge, or manually granted.

## Challenge

### `GET` `/api/challenge/request`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `token`: `string`
  - `salt`: `string`
  - `courseInfo`: `array`
    - `courseId`: `number`
    - `courseTitle`: `string`
    - `courseRatingIndex`: `number`
    - `courseOceUrl`: `string`
  - `challengeTries`: `number`
  - `maxChallengeTries`: `number`

**Status: 403**

- When the user has already verified challenge
- Body:
  - `error`: `"ALREADY_ENABLED"`

**Status: 429**

- When the user has reached the max tries
- Body:
  - `error`: `"MAX_TRIES_REACHED"`

### `POST` `/api/challenge/verify`

#### Request

- Needs credentials
- Body:
  - `token`: `string`
  - `salt`: `string`
  - `answers`: `array`
    - `courseRatingId`: `number`
    - `courseRatingIndex`: `number`
    - `answer`: `string`

#### Response

**Status: 200**

- Body:
  - `results`: `boolean[]`
  - `challengeTries`: `number`
  - `maxChallengeTries`: `number`

**Status: 400**

- When the token/salt is invalid (does not decrypt to valid information), or when the request is of invalid shape
- Body:
  - `error`: `"INVALID_REQUEST"`

**Status: 403**

- When the user has already verified challenge
- Body:
  - `error`: `"ALREADY_ENABLED"`

**Status: 429**

- When the user has reached the max tries
- Body:
  - `error`: `"MAX_TRIES_REACHED"`

## Catalog

### `GET` `/api/catalog/metadata`

#### Response

**Status: 200**

- Body:
  - `last_update`: `string` (ISO date string)

### `GET` `/api/catalog/refresh`

#### Request

- This route should only be requested by Ferry

#### Response

**Status: 200**

- No body

**Status: 401**

- When there is no secret header with request
- Body:
  - `error`: `"NOT_FERRY"`

### `GET` `/api/catalog/evals/{season}`

#### Request

- Needs eval access

#### Response

**Status: 200**

- Body:
  - See the `evalsBySeason` query

### `GET` `/api/catalog/public/{season}`

#### Response

**Status: 200**

- Body:
  - See the `catalogBySeason` query

### `GET` `/api/catalog/csv/{season}.csv`

#### Request

- Needs eval access

#### Response

**Status: 200**

- Body: CSV file

## Auth

### `GET` `/api/auth/check`

#### Response

**Status: 200**

- Body:
  - `auth`: `boolean`
  - `netId`: `NetId | null`
  - `user`: `User | null`

### `GET` `/api/auth/cas`

#### Request

- Query:
  - `redirect`: `string | undefined`

#### Response

**Status: 302**

- Redirects to the provided `redirect` query parameter (if it's an allowed origin), or `https://coursetable.com` otherwise

### `POST` `/api/auth/logout`

#### Request

- Needs credentials

#### Response

**Status: 200**

- No body

**Status: 400**

- If there is no user
- Body
  - `error`: `"USER_NOT_FOUND"`

## Friends

### `POST` `/api/friends/add`

#### Request

- Needs credentials
- Body:
  - `friendNetId`: `NetId`

#### Response

**Status: 200**

- No body

**Status: 400**

- When `friendNetId` is not provided or is the same as the user's, or when there's no existing friend request
- Body:
  - `error`: `"INVALID_REQUEST" | "SAME_USER" | "NO_FRIEND_REQUEST"`

### `POST` `/api/friends/remove`

#### Request

- Needs credentials
- Body:
  - `friendNetId`: `NetId`

#### Response

**Status: 200**

- No body

**Status: 400**

- When `friendNetId` is not provided, is the same as the user's, or does not exist
- Body:
  - `error`: `"INVALID_REQUEST" | "SAME_USER" | "FRIEND_NOT_FOUND"`

### `POST` `/api/friends/request`

#### Request

- Needs credentials
- Body:
  - `friendNetId`: `NetId`

#### Response

**Status: 200**

- No body

**Status: 400**

- When `friendNetId` is not provided, is the same as the user's, or is not a friend
- Body:
  - `error`: `"INVALID_REQUEST" | "SAME_USER" | "FRIEND_NOT_FOUND" | "ALREADY_FRIENDS" | "ALREADY_RECEIVED_REQUEST" | "ALREADY_SENT_REQUEST"`

### `GET` `/api/friends/getRequests`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `requests`: `array`
    - `netId`: `NetId`
    - `name`: `string | null`

### `GET` `/api/friends/worksheets`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:

  - `friends`:

    ```ts
    type Friends = {
      [netId: NetId]: {
        name: string | null;
        worksheets: {
          [season: Season]: {
            [worksheetNumber: number]: {
              crn: Crn;
              color: string;
              hidden: boolean | null;
            }[];
          };
        };
      };
    };
    ```

### `GET` `/api/friends/names`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `names`: `array`
    - `netId`: `string`
    - `first`: `string | null`
    - `last`: `string | null`
    - `college`: `string | null`
  - TODO: do we really need to return literally every user's name to client side?

## Canny

### `GET` `/api/canny/board`

- For internal use by Canny

## Worksheet

### `POST` `/api/user/updateWorksheetCourses`

#### Request

- Needs credentials
- Body:
  - Option 1 (single update):
    - `action`: `"add" | "remove" | "update"`
    - `season`: `string`
    - `crn`: `number`
    - `worksheetNumber`: `number`
    - `color`: `string` (must be a valid color string; mandatory for `add`, optional for `update`, ignored for `remove`)
    - `hidden`: `boolean` (mandatory for `add`, optional for `update`, ignored for `remove`)
  - Option 2 (bulk update): array containing objects with the same shape as the single update

#### Response

**Status: 200**

- No body

**Status: 400**

- When the request body is invalid
- Body:
  - Option 1 (single update):
    - `error`: `"INVALID_REQUEST" | "ALREADY_BOOKMARKED" | "NOT_BOOKMARKED"`
  - Option 2 (bulk update):
    - `error`: an object where each key is an index in the request array, and the value is one of the above errors

### `GET` `/api/user/worksheets`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:

  - `netId`: `NetId`
  - `evaluationsEnabled`: `boolean | null`
  - `year`: `number | null`
  - `school`: `string | null`
  - `data`:

    ```ts
    type Data = {
      [season: Season]: {
        [worksheetNumber: number]: {
          crn: Crn;
          color: string;
          hidden: boolean | null;
        }[];
      };
    };
    ```

## WorksheetNames

### `POST` `/api/user/updateWorksheetNames`

#### Request

- Needs credentials
- Body:
  - Option 1 (add):
    - `action`: `"add"`
    - `season`: `string`
  - Option 2 (delete):
    - `action`: `"delete"`
    - `season`: `string`
    - `worksheetNumber`: `number`
  - Option 3 (rename):
    - `action`: `"rename"`
    - `season`: `string`
    - `worksheetNumber`: `number`
    - `worksheetName`: `string`

#### Response

**Status: 200**

- No body

**Status: 400**

- When the request body is invalid
- Body:
  - `error`: `"INVALID_REQUEST" | "WORKSHEET_NOT_FOUND"`

### `GET` `/api/user/worksheetNames`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:

  - `netId`: `NetId`
  - `worksheets`:
    ```ts
    [season: Season]: {
      [worksheetNumber: number]: {
        worksheetName: string
      }[];
    };
    ```

## Health check

### `GET` `/api/ping`

#### Response

**Status: 200**

- Body: `"pong"`
