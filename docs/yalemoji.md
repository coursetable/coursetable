# Yalemoji profile avatars

CourseTable uses the same avatar lookup as Yalies. The profile button and identity
header show the signed-in user's Yalemoji and its saved background. Users without
an avatar, with a failed image, or during a service outage see their initials.
Returning from a Yalemoji visit refreshes the avatar after creating or editing it.
The identity header shows a “Make your Yalemoji” button without an avatar and an
edit icon in the bottom-right corner with one. Avatars fill the header at 104px
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
