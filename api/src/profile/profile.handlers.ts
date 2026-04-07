import type express from 'express';
import { and, eq, ilike, inArray, or } from 'drizzle-orm';
import z from 'zod';

import {
  canViewerSee,
  getSelfDisplayNames,
  getVisibleDisplayName,
  normalizePrivacySettings,
  sanitizeNullableName,
  type ViewerRelation,
  type VisibilitySetting,
} from './profile.utils.js';
import {
  studentBluebookSettings,
  studentFriends,
} from '../../drizzle/schema.js';
import { db } from '../config.js';

const VisibilitySettingSchema = z.enum(['self', 'friends', 'public']);

const UpdateOwnProfileSchema = z.object({
  preferredFirstName: z.string().max(256).nullable().optional(),
  preferredLastName: z.string().max(256).nullable().optional(),
  profilePageEnabled: z.boolean().optional(),
  allowAnonymousProfileView: z.boolean().optional(),
  privacy: z
    .object({
      nameVisibility: VisibilitySettingSchema.optional(),
      emailVisibility: VisibilitySettingSchema.optional(),
      yearVisibility: VisibilitySettingSchema.optional(),
      schoolVisibility: VisibilitySettingSchema.optional(),
      majorVisibility: VisibilitySettingSchema.optional(),
    })
    .optional(),
});

const SearchProfilesQuerySchema = z.object({
  q: z.string().trim().min(2).max(64),
  limit: z
    .string()
    .optional()
    .transform((x) => {
      if (!x) return 20;
      const parsed = Number(x);
      if (!Number.isInteger(parsed)) return 20;
      return Math.max(1, Math.min(50, parsed));
    }),
});

type StudentProfileRow = {
  netId: string;
  firstName: string | null;
  lastName: string | null;
  preferredFirstName: string | null;
  preferredLastName: string | null;
  nameVisibility: string | null;
  emailVisibility: string | null;
  yearVisibility: string | null;
  schoolVisibility: string | null;
  majorVisibility: string | null;
  email: string | null;
  year: number | null;
  school: string | null;
  major: string | null;
  evaluationsEnabled: boolean;
  evaluationsRevoked: boolean;
  profilePageEnabled: boolean;
  allowAnonymousProfileView: boolean;
};

const profileColumns = {
  netId: true,
  firstName: true,
  lastName: true,
  preferredFirstName: true,
  preferredLastName: true,
  nameVisibility: true,
  emailVisibility: true,
  yearVisibility: true,
  schoolVisibility: true,
  majorVisibility: true,
  email: true,
  year: true,
  school: true,
  major: true,
  evaluationsEnabled: true,
  evaluationsRevoked: true,
  profilePageEnabled: true,
  allowAnonymousProfileView: true,
} as const;

const getRelation = async (
  viewerNetId: string | null,
  targetNetId: string,
): Promise<ViewerRelation> => {
  if (viewerNetId === targetNetId) return 'self';
  if (!viewerNetId) return 'stranger';

  const friendship = await db.query.studentFriends.findFirst({
    where: and(
      eq(studentFriends.netId, viewerNetId),
      eq(studentFriends.friendNetId, targetNetId),
    ),
    columns: { id: true },
  });

  return friendship ? 'friend' : 'stranger';
};

const buildOwnProfileResponse = (profile: StudentProfileRow) => {
  const privacy = normalizePrivacySettings(profile);
  const display = getSelfDisplayNames(profile);

  return {
    netId: profile.netId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    preferredFirstName: profile.preferredFirstName,
    preferredLastName: profile.preferredLastName,
    displayFirstName: display.displayFirstName,
    displayLastName: display.displayLastName,
    displayName: display.displayName,
    email: profile.email,
    year: profile.year,
    school: profile.school,
    major: profile.major,
    hasEvals: profile.evaluationsEnabled && !profile.evaluationsRevoked,
    evalsRevoked: profile.evaluationsRevoked,
    profilePageEnabled: profile.profilePageEnabled,
    allowAnonymousProfileView: profile.allowAnonymousProfileView,
    privacy,
  };
};

const projectField = <T>(
  value: T,
  visibility: VisibilitySetting,
  relation: ViewerRelation,
): T | null => (canViewerSee(visibility, relation) ? value : null);

const buildSharedProfileResponse = (
  profile: StudentProfileRow,
  relation: ViewerRelation,
) => {
  const privacy = normalizePrivacySettings(profile);
  const displayName = getVisibleDisplayName(
    profile,
    relation,
    privacy.nameVisibility,
  );
  const displayParts = getSelfDisplayNames(profile);
  const canSeeName = canViewerSee(privacy.nameVisibility, relation);

  return {
    netId: profile.netId,
    relation,
    displayName,
    firstName: canSeeName ? displayParts.displayFirstName : null,
    lastName: canSeeName ? displayParts.displayLastName : null,
    email: projectField(profile.email, privacy.emailVisibility, relation),
    year: projectField(profile.year, privacy.yearVisibility, relation),
    school: projectField(profile.school, privacy.schoolVisibility, relation),
    major: projectField(profile.major, privacy.majorVisibility, relation),
    visible: {
      name: canSeeName,
      email: canViewerSee(privacy.emailVisibility, relation),
      year: canViewerSee(privacy.yearVisibility, relation),
      school: canViewerSee(privacy.schoolVisibility, relation),
      major: canViewerSee(privacy.majorVisibility, relation),
    },
  };
};

export const getOwnProfile = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const profile = (await db.query.studentBluebookSettings.findFirst({
    where: eq(studentBluebookSettings.netId, netId),
    columns: profileColumns,
  })) as StudentProfileRow | undefined;

  if (!profile) {
    res.status(404).json({ error: 'USER_NOT_FOUND' });
    return;
  }

  res.json(buildOwnProfileResponse(profile));
};

export const getSharedProfile = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const targetNetId = req.params.netId;
  if (!targetNetId) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const profile = (await db.query.studentBluebookSettings.findFirst({
    where: eq(studentBluebookSettings.netId, targetNetId),
    columns: profileColumns,
  })) as StudentProfileRow | undefined;

  if (!profile) {
    res.status(404).json({ error: 'USER_NOT_FOUND' });
    return;
  }

  if (!profile.profilePageEnabled) {
    res.status(404).json({ error: 'USER_NOT_FOUND' });
    return;
  }

  const viewerNetId = req.user?.netId ?? null;
  if (viewerNetId === null && !profile.allowAnonymousProfileView) {
    res.status(404).json({ error: 'USER_NOT_FOUND' });
    return;
  }

  const relation = await getRelation(viewerNetId, targetNetId);

  res.json(buildSharedProfileResponse(profile, relation));
};

export const updateOwnProfile = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  const bodyParse = UpdateOwnProfileSchema.safeParse(req.body);
  if (!bodyParse.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const current = (await db.query.studentBluebookSettings.findFirst({
    where: eq(studentBluebookSettings.netId, netId),
    columns: profileColumns,
  })) as StudentProfileRow | undefined;

  if (!current) {
    res.status(404).json({ error: 'USER_NOT_FOUND' });
    return;
  }

  const updates: Partial<typeof studentBluebookSettings.$inferInsert> = {};

  const preferredFirstName = sanitizeNullableName(
    bodyParse.data.preferredFirstName,
  );
  if (preferredFirstName !== undefined)
    updates.preferredFirstName = preferredFirstName;

  const preferredLastName = sanitizeNullableName(
    bodyParse.data.preferredLastName,
  );
  if (preferredLastName !== undefined)
    updates.preferredLastName = preferredLastName;

  if (bodyParse.data.profilePageEnabled !== undefined)
    updates.profilePageEnabled = bodyParse.data.profilePageEnabled;
  if (bodyParse.data.allowAnonymousProfileView !== undefined) {
    updates.allowAnonymousProfileView =
      bodyParse.data.allowAnonymousProfileView;
  }

  const { privacy } = bodyParse.data;
  if (privacy) {
    if (privacy.nameVisibility) updates.nameVisibility = privacy.nameVisibility;
    if (privacy.emailVisibility)
      updates.emailVisibility = privacy.emailVisibility;
    if (privacy.yearVisibility) updates.yearVisibility = privacy.yearVisibility;
    if (privacy.schoolVisibility)
      updates.schoolVisibility = privacy.schoolVisibility;
    if (privacy.majorVisibility)
      updates.majorVisibility = privacy.majorVisibility;
  }

  if (updates.profilePageEnabled === false)
    updates.allowAnonymousProfileView = false;
  else if (updates.allowAnonymousProfileView === true)
    updates.profilePageEnabled = true;

  if (!current.firstName && updates.preferredFirstName)
    updates.firstName = updates.preferredFirstName;
  if (!current.lastName && updates.preferredLastName)
    updates.lastName = updates.preferredLastName;

  if (Object.keys(updates).length > 0) {
    await db
      .update(studentBluebookSettings)
      .set(updates)
      .where(eq(studentBluebookSettings.netId, netId));
  }

  const refreshed = (await db.query.studentBluebookSettings.findFirst({
    where: eq(studentBluebookSettings.netId, netId),
    columns: profileColumns,
  })) as StudentProfileRow;

  res.json(buildOwnProfileResponse(refreshed));
};

export const revokeEvaluationsAccess = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;

  await db
    .update(studentBluebookSettings)
    .set({ evaluationsEnabled: false, evaluationsRevoked: true })
    .where(eq(studentBluebookSettings.netId, netId));

  req.user!.evals = false;

  await new Promise<void>((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  res.status(200).json({ hasEvals: false, evalsRevoked: true });
};

export const searchProfiles = async (
  req: express.Request,
  res: express.Response,
): Promise<void> => {
  const { netId } = req.user!;
  const queryParse = SearchProfilesQuerySchema.safeParse(req.query);
  if (!queryParse.success) {
    res.status(400).json({ error: 'INVALID_REQUEST' });
    return;
  }

  const { q, limit } = queryParse.data;

  const candidates = (await db.query.studentBluebookSettings.findMany({
    where: and(
      eq(studentBluebookSettings.profilePageEnabled, true),
      or(
        ilike(studentBluebookSettings.netId, `%${q}%`),
        ilike(studentBluebookSettings.firstName, `%${q}%`),
        ilike(studentBluebookSettings.lastName, `%${q}%`),
        ilike(studentBluebookSettings.preferredFirstName, `%${q}%`),
        ilike(studentBluebookSettings.preferredLastName, `%${q}%`),
      ),
    ),
    columns: profileColumns,
    limit,
  })) as StudentProfileRow[];

  const targetNetIds = candidates.map((candidate) => candidate.netId);
  const friendRows =
    targetNetIds.length === 0
      ? []
      : await db.query.studentFriends.findMany({
          where: and(
            eq(studentFriends.netId, netId),
            inArray(studentFriends.friendNetId, targetNetIds),
          ),
          columns: { friendNetId: true },
        });

  const friendSet = new Set(friendRows.map((row) => row.friendNetId));

  const results = candidates
    .map((candidate) => {
      const relation: ViewerRelation =
        candidate.netId === netId
          ? 'self'
          : friendSet.has(candidate.netId)
            ? 'friend'
            : 'stranger';
      const privacy = normalizePrivacySettings(candidate);
      const displayName = getVisibleDisplayName(
        candidate,
        relation,
        privacy.nameVisibility,
      );
      return {
        netId: candidate.netId,
        relation,
        displayName,
      };
    })
    .sort((a, b) => {
      if (a.netId === netId) return 1;
      if (b.netId === netId) return -1;
      const aLabel = (a.displayName ?? a.netId).toLowerCase();
      const bLabel = (b.displayName ?? b.netId).toLowerCase();
      return aLabel.localeCompare(bLabel, undefined, {
        sensitivity: 'base',
      });
    });

  res.status(200).json({ profiles: results });
};
