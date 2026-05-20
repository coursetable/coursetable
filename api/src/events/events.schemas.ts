import z from 'zod';

const cameFromSchema = z.enum(['search', 'worksheet', 'friend', 'direct']);

const worksheetCoursePayloadSchema = z.object({
  course_code: z.string().min(1),
  term: z.string().min(1),
  worksheet_name: z.string().min(1),
});

const visibilitySettingSchema = z.enum(['self', 'friends', 'public']);

const profilePrivacySchema = z.object({
  nameVisibility: visibilitySettingSchema,
  emailVisibility: visibilitySettingSchema,
  yearVisibility: visibilitySettingSchema,
  schoolVisibility: visibilitySettingSchema,
  majorVisibility: visibilitySettingSchema,
});

export const incomingEventSchema = z.discriminatedUnion('event_type', [
  z.object({
    event_type: z.literal('search'),
    payload: z.object({
      query: z.string(),
      filters: z.record(z.unknown()),
      n_results: z.number(),
    }),
  }),
  z.object({
    event_type: z.literal('course_view'),
    payload: z.object({
      course_code: z.string().min(1),
      term: z.string().min(1),
      came_from: cameFromSchema,
    }),
  }),
  z.object({
    event_type: z.literal('eval_expand'),
    payload: z.object({
      course_code: z.string().min(1),
      term: z.string().min(1),
    }),
  }),
  z.object({
    event_type: z.literal('worksheet_add'),
    payload: worksheetCoursePayloadSchema,
  }),
  z.object({
    event_type: z.literal('worksheet_remove'),
    payload: worksheetCoursePayloadSchema,
  }),
  z.object({
    event_type: z.literal('worksheet_hide'),
    payload: worksheetCoursePayloadSchema.extend({
      hidden: z.boolean(),
    }),
  }),
  z.object({
    event_type: z.literal('worksheet_color'),
    payload: worksheetCoursePayloadSchema.extend({
      color: z.string().min(1),
    }),
  }),
  z.object({
    event_type: z.literal('filter_change'),
    payload: z.object({
      filter: z.string().min(1),
      value: z.unknown(),
    }),
  }),
  z.object({
    event_type: z.literal('calendar_export'),
    payload: z.object({
      kind: z.enum(['ics', 'gcal']),
      worksheet_name: z.string().min(1),
    }),
  }),
  z.object({
    event_type: z.literal('friend_add'),
    payload: z.object({ friend_id: z.string().min(1) }),
  }),
  z.object({
    event_type: z.literal('friend_worksheet_view'),
    payload: z.object({ friend_id: z.string().min(1) }),
  }),
  z.object({
    event_type: z.literal('profile_update'),
    payload: z.object({
      profile_page_enabled: z.boolean(),
      allow_anonymous_profile_view: z.boolean(),
      preferred_name_set: z.boolean(),
      privacy: profilePrivacySchema,
    }),
  }),
  z.object({
    event_type: z.literal('session_start'),
    payload: z.object({ referrer: z.string().optional() }),
  }),
]);

export type IncomingEvent = z.infer<typeof incomingEventSchema>;

export const bodySchema = z.object({
  session_id: z.string().min(8).max(200),
  client: z.string().min(1).max(64),
  app_version: z.string().max(64).optional().nullable(),
  events: z.array(incomingEventSchema).min(1).max(100),
});
