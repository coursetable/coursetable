import chroma from 'chroma-js';
import z from 'zod';

export const ToggleBookmarkReqBodySchema = z.object({
  action: z.union([z.literal('add'), z.literal('remove'), z.literal('update')]),
  season: z.string().transform((val) => parseInt(val, 10)),
  crn: z.number(),
  worksheetNumber: z.number(),
  color: z.string().refine((val) => chroma.valid(val)),
});

export const UpdateBookmarkBatchReqBodySchema = z.array(
  z.object({
    action: z.union([z.literal('color'), z.literal('hidden')]),
    season: z.string().transform((val) => parseInt(val, 10)),
    crn: z.number(),
    worksheetNumber: z.number(),
    color: z.string().refine((val) => chroma.valid(val)),
    hidden: z.boolean(),
  }),
);
