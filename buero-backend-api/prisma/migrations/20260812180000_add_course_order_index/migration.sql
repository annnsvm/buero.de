-- AlterTable
ALTER TABLE "courses" ADD COLUMN "order_index" INTEGER NOT NULL DEFAULT 0;

-- Preserve current catalog order (newest first → lower order_index)
WITH ranked AS (
  SELECT id, (ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1)::INTEGER AS idx
  FROM "courses"
)
UPDATE "courses" AS c
SET "order_index" = ranked.idx
FROM ranked
WHERE c.id = ranked.id;
