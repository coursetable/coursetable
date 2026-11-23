# Yalemoji profile avatars

CourseTable shows a user's Yalemoji avatar in the profile menu, on profile pages,
and beside names in friend lists. Users without an avatar see their initials in
the menu and Yalemoji's default avatar elsewhere.

## Where avatars appear

- The profile button in the navbar, and the Profile row inside its menu.
- A "Make your Yalemoji" / "Edit your Yalemoji" row in the same menu, linking to
  `https://yalemoji.com/create?ref=coursetable` or `/editor?ref=coursetable`.
  Returning to the tab refreshes the avatar.
- Friend lists, friend search results, and incoming requests.
- The signed-in user's `/profile` and shared `/u/:netId` pages. Shared profiles
  include avatars only after the existing visibility checks.
- A dismissible slide-down banner for users whose lookup confirms they have no
  avatar. It is the fallback of CourseTable's full-width notice, so an active
  notice always wins and the two never appear together. Outages never show it.
  Dismissal uses `useLocalStorageState` with `lastDismissedYalemojiBanner`.

All Yalemoji links carry `mode=light` or `mode=dark` to match the current theme.

## Server configuration

- `YALEMOJI_API_KEY`: the CourseTable-specific app key. Required outside
  development; when unset in development, lookups are skipped.
- `YALEMOJI_API_URL`: optional API origin, defaulting to
  `https://www.yalemoji.com`. HTTP is allowed only for localhost in development.

The key lives in Google Secret Manager in project `yalemoji` as
`yalemoji-coursetable-api-key`, and is separate from Yalies' key so it can be
revoked independently.

```sh
gcloud secrets versions access latest \
  --project=yalemoji \
  --secret=yalemoji-coursetable-api-key
```

Set that value as `YALEMOJI_API_KEY` in Doppler, project `coursetable`, config
`prod` (and `dev` or `prod_staging` to enable avatars there). Docker Compose
passes it to the API container. No frontend environment variable is needed.

## Lookup behavior

`GET /api/user/yalemoji` uses the existing session and looks up only
`req.user.netId`. `POST /api/user/yalemoji/lookup` takes `{ netids: string[] }`,
at most 100 at a time, for other people's avatars.

Both send the bearer key server-side with a three-second timeout and validate the
returned version and HTTPS image URLs. The browser receives only public asset
URLs, never the key. A confirmed missing avatar returns `null`; an unavailable
lookup returns 503, which is deliberately distinct so outages never trigger the
banner. All responses use `Cache-Control: private, no-store`.

The browser shares one cache across the menu, banner, and people lists. The
signed-in user's avatar persists in `localStorage` so it paints immediately on
reload; other people's avatars are cached in memory for five minutes. Logout
clears the cache, and a failed lookup preserves the previous avatar.
