import type express from 'express';
import asyncHandler from 'express-async-handler';
import z from 'zod';

import {
  updateWorksheetCourses,
  getUserInfo,
  getUserWorksheet,
  updateWorksheetMetadata,
  updateWishlistCourses,
  getUserWishlist,
} from './user.handlers.js';
import { yaleMojiImageUrl, fetchYaleMojiImageBytes } from './yalemoji-image.js';
import { getYaleMojiAvatar, getYaleMojiAvatars } from './yalemoji.js';
import { authBasic } from '../auth/auth.handlers.js';

export default (app: express.Express): void => {
  app.use('/api/user/*', authBasic);
  app.get('/api/user/info', asyncHandler(getUserInfo));
  // Public, allowlisted assets also support anonymous profile views. GCS assets
  // do not send CORS headers, so they cannot be measured directly on canvas.
  app.get(
    '/api/yalemoji/image',
    asyncHandler(async (req, res) => {
      res.set('Cache-Control', 'no-store');
      const url = yaleMojiImageUrl(req.query.src);
      if (!url) {
        res.status(400).json({ error: 'INVALID_REQUEST' });
        return;
      }
      try {
        const bytes = await fetchYaleMojiImageBytes(url);
        res.set('Cache-Control', 'public, max-age=300').type('png').send(bytes);
      } catch {
        res.status(503).json({ error: 'Yalemoji image unavailable' });
      }
    }),
  );
  app.get(
    '/api/user/yalemoji',
    asyncHandler(async (req, res) => {
      res.set('Cache-Control', 'private, no-store');
      const { netId } = req.user!;
      const avatar = await getYaleMojiAvatar(netId);
      if (avatar === undefined) {
        res.status(503).json({ error: 'Yalemoji lookup unavailable' });
        return;
      }
      res.json({ netId, avatar });
    }),
  );
  app.post(
    '/api/user/yalemoji/lookup',
    asyncHandler(async (req, res) => {
      res.set('Cache-Control', 'private, no-store');
      const body = z
        .object({
          netids: z
            .array(
              z
                .string()
                .regex(/^[a-z][a-z\d]*$/iu)
                .max(32),
            )
            .max(100),
        })
        .safeParse(req.body);
      if (!body.success) {
        res.status(400).json({ error: 'INVALID_REQUEST' });
        return;
      }
      const users = await getYaleMojiAvatars(body.data.netids);
      if (!users) {
        res.status(503).json({ error: 'Yalemoji lookup unavailable' });
        return;
      }
      res.json({ users });
    }),
  );
  app.get('/api/user/worksheets', asyncHandler(getUserWorksheet));
  app.post(
    '/api/user/updateWorksheetCourses',
    asyncHandler(updateWorksheetCourses),
  );
  app.post(
    '/api/user/updateWorksheetMetadata',
    asyncHandler(updateWorksheetMetadata),
  );
  app.get('/api/user/wishlist', asyncHandler(getUserWishlist));
  app.post(
    '/api/user/updateWishlistCourses',
    asyncHandler(updateWishlistCourses),
  );
};
