import { z } from 'zod';

const timeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/u);

export const personalBlockSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string().trim().min(1).max(100),
    days: z.array(z.number().int().min(1).max(5)).min(1).max(5),
    start: timeSchema,
    end: timeSchema,
    updatedAt: z.string().datetime().optional(),
  })
  .refine((block) => block.start < block.end, {
    message: 'End time must be after start time',
  });

export type PersonalBlock = z.infer<typeof personalBlockSchema>;

export const personalBlocksSchema = z
  .array(personalBlockSchema)
  .max(20, 'A worksheet can have at most 20 commitments.')
  .refine(
    (blocks) => new Set(blocks.map((block) => block.id)).size === blocks.length,
    { message: 'Commitment IDs must be unique.' },
  );
