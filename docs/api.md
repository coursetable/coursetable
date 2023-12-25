# API docs

- TODO: remove all `success: true` (and use HTTP status code instead)
- TODO: standardize error response format

## Challenge

### `POST` `/api/challenge/request`

- Request:
  - Needs credentials

- Response: 200
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
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`
- Response: 403
  - When the user has already verified challenge
  - Body:
    - `error`: `"ALREADY_ENABLED"`
- Response: 429
  - When the user has reached the max tries
  - Body:
    - `error`: `"MAX_TRIES_REACHED"`
    - `challengeTries`: `number`
    - `maxChallengeTries`: `number`
- Response: 500
  - Internal error with requesting the challenge
  - Body:
    - `error`: `unknown`
    - `challengeTries`: `number`
    - `maxChallengeTries`: `number`

### `POST` `/api/challenge/verify`

- Request:
  - Needs credentials
  - Body:
    - `token`: `string`
    - `salt`: `string`
    - `answers`: `array`
      - `courseRatingId`: `number`
      - `courseRatingIndex`: `number`
      - `answer`: `string`

- Response: 200
  - Body:
    - `message`: `"CORRECT" | "INCORRECT"`
    - `challengeTries`: `number`
    - `maxChallengeTries`: `number`
- Response: 400
  - When the token/salt is invalid (does not decrypt to valid information), or when the answer is of invalid shape
  - Body:
    - `error`: `"INVALID_TOKEN" | "MALFORMED_ANSWERS"`
    - `challengeTries`: `number`
    - `maxChallengeTries`: `number`
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`
- Response: 403
  - When the user has already verified challenge
  - Body:
    - `error`: `"ALREADY_ENABLED"`
- Response: 429
  - When the user has reached the max tries
  - Body:
    - `error`: `"MAX_TRIES_REACHED"`
    - `challengeTries`: `number`
    - `maxChallengeTries`: `number`
- Response: 500
  - Internal error with verifying the challenge
  - Body:
    - `error`: `unknown`
    - `challengeTries`: `number`
    - `maxChallengeTries`: `number`

## Catalog

### `GET` `/api/catalog/refresh`

- Request:
  - This route should only be requested by Ferry

- Response: 200
- Response: 401
  - When there is no secret header with request
  - Body:
    - `error`: `"NOT_AUTHENTICATED"`
- Response: 500
  - Internal error with refreshing the catalog
  - Body: `unknown`

## Auth

### `GET` `/api/auth/check`

- Request:
  - Needs credentials

- Response: 200
  - Body:
    - `auth`: `boolean`
    - `id`: `NetId | null`
    - `user`: `User | null`

### `GET` `/api/auth/cas`

- Request:
  - Query:
    - `redirect`: `string | undefined`

- Response: 200
  - Redirects to the provided `redirect` query parameter (if it's an allowed origin), or `https://coursetable.com` otherwise

### `GET` `/api/auth/logout`

- Request:
  - Needs credentials

- Response: 200
  - Body:
    - `success`: `true`

## Friends

### `POST` `/api/friends/add`

- Request:
  - Needs credentials
  - Body:
    - `friendNetId`: `NetId`

- Response: 200
  - Body:
    - `success`: `true`
- Response: 400
  - When `friendNetId` is not provided or is the same as the user's
  - Body:
    - `success`: `false`
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`
- Response: 500
  - Internal error with removing friend
  - Body:
    - `success`: `false`

### `POST` `/api/friends/remove`

- Request:
  - Needs credentials
  - Body:
    - `friendNetId`: `NetId`

- Response: 200
  - Body:
    - `success`: `true`
- Response: 400
  - When `friendNetId` is not provided or is the same as the user's
  - Body:
    - `success`: `false`
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`
- Response: 500
  - Internal error with removing friend
  - Body:
    - `success`: `false`

### `POST` `/api/friends/request`

- Request:
  - Needs credentials
  - Body:
    - `friendNetId`: `NetId`

- Response: 200
  - Body:
    - `success`: `true`
- Response: 400
  - When `friendNetId` is not provided or is the same as the user's
  - Body:
    - `success`: `false`
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`
- Response: 500
  - Internal error with sending friend request
  - Body:
    - `success`: `false`

### `GET` `/api/friends/getRequests`

- Request:
  - Needs credentials

- Response: 200
  - Body:
    - `success`: `true`
    - `friends`: `array`
      - `netId`: `NetId`
      - `name`: `string`
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`
- Response: 500
  - Internal error with querying friend requests
  - Body:
    - `success`: `false`
    - `message`: `string`

### `GET` `/api/friends/worksheets`

- Request:
  - Needs credentials

- Response: 200
  - Body:
    - `success`: `true`
    - `worksheets`: `{ [netId: string]: Worksheet[] }`
    - `friendInfo`: `{ [netId: string]: { name: string } }`
    - TODO: merge `worksheets` and `friendInfo`
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`

### `GET` `/api/friends/names`

- DEPRECATED: not in use

## Canny

### `GET` `/api/canny/board`

- DEPRECATED: not in use

## Worksheet

### `POST` `/api/user/toggleBookmark`

- Request:
  - Needs credentials
  - Body:
    - `action`: `"add" | "remove"`
    - `season`: `string`
    - `oci_id`: `string`
    - `worksheet_number`: `string`

- Response: 200
  - Body:
    - `success`: `true`
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`

### `GET` `/api/user/worksheets`

- Request:
  - Needs credentials

- Response: 200
  - Body:
    - `success`: `true`
    - `netId`: `NetId`
    - `evaluationsEnabled`: `boolean | null | undefined`
    - `year`: `number | null | undefined`
    - `school`: `string | null | undefined`
    - `data`: `[season: string, ociId: string, worksheetNumber: string][]`
- Response: 401
  - When there is no credentials with request
  - Body:
    - `error`: `"USER_NOT_FOUND"`

## Health check

### `GET` `/api/ping`

- Response: 200
  - Body: `"pong"`
