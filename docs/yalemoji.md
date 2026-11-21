# Yalemoji profile avatars

CourseTable uses the same avatar lookup as Yalies. The profile button and identity
header show the signed-in user's Yalemoji and its saved background. Users without
an avatar, with a failed image, or during a service outage see Yalemoji's default
avatar.
Returning from a Yalemoji visit refreshes the avatar after creating or editing it.
Without an avatar, the identity header shows name initials and a persistent
Profile label; it has no Make your Yalemoji button. Its
avatar links to the same `/profile` destination as the former Profile (beta) menu
item. Hover anywhere in the identity header (or keyboard focus on the avatar) lifts
and slightly enlarges the face and reveals a blurred, translucent Profile label.
The label uses dark text over a transparent backdrop blur, with no painted
white background or drop shadow. Clicking shrinks it briefly before opening the
profile; reduced-motion preferences skip the animation. The separate edit icon
and Profile (beta) menu item have been removed. Avatars fill the header at 104px
on desktop and 160px on mobile, with an undistorted square background tile.

After page load, a slide-down banner invites authenticated users with a confirmed
missing avatar to create one. It is the fallback of CourseTable's full-width
notice: an active notice always wins, so the two banners never appear together.
The banner hides when visiting Yalemoji and is eligible again only after a fresh,
successful missing-avatar response. Service outages never make it appear.

The profile menu links to `https://yalemoji.com/create?ref=coursetable` without an
avatar and `https://yalemoji.com/editor?ref=coursetable` with one. The fifth app in
the waffle links to `https://yalemoji.com?ref=coursetable`, matching Yalies.
All of these links also include `mode=light` or `mode=dark`, matching CourseTable's
current theme, just like Yalies.

## Server configuration

- `YALEMOJI_API_KEY`: the CourseTable-specific app key. Optional; when unset,
  CourseTable uses initials and skips the lookup. Keep it on the API server.
- `YALEMOJI_API_URL`: optional API origin, defaulting to
  `https://www.yalemoji.com`. HTTP is allowed only for localhost in development.

The key is stored in Google Secret Manager in project `yalemoji` as
`yalemoji-coursetable-api-key`. Yalemoji stores only its SHA-256 hash in its
Firestore `apiKeys` collection, with `app: coursetable`. This key is separate from
Yalies' key and can be revoked independently.

## Production setup

1. Retrieve the value from [Google Secret Manager](https://console.cloud.google.com/security/secret-manager/secret/yalemoji-coursetable-api-key/versions?project=yalemoji),
   or use:

   ```sh
   gcloud secrets versions access latest \
     --project=yalemoji \
     --secret=yalemoji-coursetable-api-key
   ```

2. Set that value as `YALEMOJI_API_KEY` in Doppler, project `coursetable`, config
   `prod`. The production API deployment reads secrets from that config.
3. Deploy the API changes with the normal production workflow. Docker Compose
   now passes `YALEMOJI_API_KEY` to the API container. Deploy the frontend changes
   as well to display avatars and use the new links.

`YALEMOJI_API_URL` can remain unset. To enable avatars in staging or development,
configure the API key in the corresponding Doppler config as well. No frontend
environment variable is needed. This setup does not change production secrets
or deploy the services automatically.

## Lookup behavior

`GET /api/user/yalemoji` requires the existing CourseTable session and looks up
only `req.user.netId`. The API server sends the bearer key to
`/api/v1/users/{netid}` with a three-second timeout and validates the returned
version and HTTPS image URLs. The response is `{ netId, avatar: { version, png_url,
svg_url, background_url } }`, or `{ netId, avatar: null }` for a confirmed missing
avatar. Unavailable lookups return 503. All responses use
`Cache-Control: private, no-store`. The browser checks the response NetID.

The browser receives only public, opaque asset URLs, never the app key. The
optional lookup runs separately from login and user-info requests, so an avatar
service outage does not delay authentication. The browser shares one cache and initial request across profile buttons and the
banner. Cached avatars persist across reloads and refresh five seconds after page
load; an uncached avatar loads immediately. Focus and visibility changes refresh
only after following a Yalemoji link. Logout clears the cache, and a failed lookup
preserves the previous avatar.

## Friends and friend search

Friend lists (desktop and mobile), friend search results, and incoming requests
show a transparent Yalemoji in a compact 32px slot to the left of the name. These rows render only
`png_url`, without the saved background, and fall back to Yalemoji's default
avatar (`https://www.yalemoji.com/assets/default-avatar.png?v=3`) when the avatar
is missing or fails to load. Names and friend actions remain usable
during an avatar-service outage.

`POST /api/user/yalemoji/lookup` requires a CourseTable session and accepts
`{ netids: string[] }`, with at most 100 valid NetIDs. It calls Yalemoji's
`POST /api/v1/lookup` server-side and validates the returned avatars. The response
is `{ users: { [netid]: avatar | null } }`; unavailable lookups return 503 and
responses use `Cache-Control: private, no-store`.

Rows mounted together share batches of up to 100, with duplicate lookups shared
between menus. Successful and confirmed-missing results are cached in memory
for five minutes. Reopening a menu after expiry refreshes those avatars; failed
lookups preserve the previous avatar and can retry on a later mount.

Transparent image padding is measured per asset and removed on canvas before
rendering, so the visible character fills the slot without increasing row
height. The default avatar is trimmed the same way. Public, allowlisted image reads
use `/api/yalemoji/image?src=...` because the public storage bucket does not
allow cross-origin canvas reads. This endpoint only accepts the Yalemoji asset
bucket and the default avatar URL, follows no redirects, and sends no API key.
Cropped images are shared in a bounded memory cache by immutable source URL.
If cropping is unavailable (for example on an older browser or during a proxy
outage), the original public image still renders. Image reads reject redirects,
unapproved URLs, non-PNG responses, and streams larger than 2 MiB.

Shared `/u/:netId` profiles and the signed-in user's profile header use the same
trimmed image renderer with the default Yalemoji fallback. Their 80px faces sit centered above the profile heading. Shared-profile responses include optional `yalemoji`
metadata only after the existing profile visibility checks, including anonymous
view restrictions. The navbar and identity header use the same renderer while
preserving their existing sizes, backgrounds, and edit/create actions. The
navbar button and identity header keep the original untrimmed image scale;
padding trim applies
to profile faces and people lists, including the profile Friends card.

The identity header's profile link covers the full header with a pointer cursor;
there is no separate Make your Yalemoji action inside it. The
compact navbar button uses name initials (or NetID initials if needed) when no
Yalemoji is set. Profile pages and people lists retain the default-avatar fallback.

The Yalemoji banner reads “Your avatar across Yale” with the Make your Yalemoji
link and a small X (10px icon, 28px touch target). Dismissal uses the existing
`useLocalStorageState` utility with a separate `lastDismissedYalemojiBanner`
version ID, following the release-notice pattern. Dismissal persists across
navigation, reloads, logout, and later visits in the same browser. It does not
affect release notices or sync across browsers/devices. The banner can return
only when its version ID is intentionally changed or site storage is cleared,
and still requires a confirmed missing avatar. Active release notices continue
to take priority. If storage is blocked, dismissal lasts only while the banner
component stays mounted.
