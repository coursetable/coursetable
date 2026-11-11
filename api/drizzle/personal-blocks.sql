ALTER TABLE "worksheets"
  ADD COLUMN IF NOT EXISTS "personalBlocks" jsonb NOT NULL DEFAULT '[]'::jsonb;
