# API docs

- TODO: remove all `success: true` (and use HTTP status code instead)
- TODO: standardize error response format

All endpoints are capable of returning 500. In this case the body contains an `error: string`.

Endpoints marked as "needs credentials" returns 401 with `error: "USER_NOT_FOUND"` when the user is not found.

Endpoints marked as "needs eval access" additionally returns 401 with `error: "USER_NO_EVALS"` when the user exists but has no evals access. Evals access can be granted after completing the challenge, or manually granted.

## Challenge

### `POST` `/api/challenge/request`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `token`: `string`
  - `salt`: `string`
  - `course_info`: `array`
    - `courseId`: `number`
    - `courseTitle`: `string`
    - `courseRatingIndex`: `number`
    - `courseQuestionTexts`: `string`
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
  - `challengeTries`: `number`
  - `maxChallengeTries`: `number`

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
  - `message`: `"CORRECT" | "INCORRECT"`
  - `challengeTries`: `number`
  - `maxChallengeTries`: `number`

**Status: 400**

- When the token/salt is invalid (does not decrypt to valid information), or when the answer is of invalid shape
- Body:
  - `error`: `"INVALID_TOKEN" | "MALFORMED_ANSWERS"`
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
  - `challengeTries`: `number`
  - `maxChallengeTries`: `number`

## Catalog

### `GET` `/api/catalog/refresh`

#### Request

- This route should only be requested by Ferry

#### Response

**Status: 200**

**Status: 401**

- When there is no secret header with request
- Body:
  - `error`: `"NOT_FERRY"`

### `GET` `/api/static/{season}.json`

TODO: rename this to `/api/catalog` and remove `.json`?

#### Request

- Needs eval access

#### Response

**Status: 200**

- Body:
  - `Listing[]` (see `static` folder for examples)
  - TODO: provide typing SDK

## Auth

### `GET` `/api/auth/check`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `auth`: `boolean`
  - `id`: `NetId | null`
  - `user`: `User | null`

### `GET` `/api/auth/cas`

#### Request

- Query:
  - `redirect`: `string | undefined`

#### Response

**Status: 200**

- Redirects to the provided `redirect` query parameter (if it's an allowed origin), or `https://coursetable.com` otherwise

### `GET` `/api/auth/logout`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `success`: `true`

## Friends

### `POST` `/api/friends/add`

#### Request

- Needs credentials
- Body:
  - `friendNetId`: `NetId`

#### Response

**Status: 200**

- Body:
  - `success`: `true`

**Status: 400**

- When `friendNetId` is not provided or is the same as the user's
- Body:
  - `success`: `false`

### `POST` `/api/friends/remove`

#### Request

- Needs credentials
- Body:
  - `friendNetId`: `NetId`

#### Response

**Status: 200**

- Body:
  - `success`: `true`

**Status: 400**

- When `friendNetId` is not provided or is the same as the user's
- Body:
  - `success`: `false`

### `POST` `/api/friends/request`

#### Request

- Needs credentials
- Body:
  - `friendNetId`: `NetId`

#### Response

**Status: 200**

- Body:
  - `success`: `true`

**Status: 400**

- When `friendNetId` is not provided or is the same as the user's
- Body:
  - `success`: `false`

### `GET` `/api/friends/getRequests`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `success`: `true`
  - `friends`: `array`
    - `netId`: `NetId`
    - `name`: `string`

### `GET` `/api/friends/worksheets`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `success`: `true`
  - `worksheets`: `{ [netId: string]: Worksheet[] }`
  - `friendInfo`: `{ [netId: string]: { name: string } }`
  - TODO: merge `worksheets` and `friendInfo`

### `GET` `/api/friends/names`

- DEPRECATED: not in use

## Canny

### `GET` `/api/canny/board`

- For internal use by Canny

## Worksheet

### `POST` `/api/user/toggleBookmark`

#### Request

- Needs credentials
- Body:
  - `action`: `"add" | "remove"`
  - `season`: `string`
  - `oci_id`: `string`
  - `worksheet_number`: `string`

#### Response

**Status: 200**

- Body:
  - `success`: `true`

### `GET` `/api/user/worksheets`

#### Request

- Needs credentials

#### Response

**Status: 200**

- Body:
  - `success`: `true`
  - `netId`: `NetId`
  - `evaluationsEnabled`: `boolean | null | undefined`
  - `year`: `number | null | undefined`
  - `school`: `string | null | undefined`
  - `data`: `[season: string, ociId: string, worksheetNumber: string][]`

## Health check

### `GET` `/api/ping`

#### Response

**Status: 200**

- Body: `"pong"`
