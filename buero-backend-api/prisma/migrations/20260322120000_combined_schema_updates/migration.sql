DROP INDEX IF EXISTS "courses_category_idx";
ALTER TABLE "courses" DROP COLUMN IF EXISTS "category";
DROP TYPE IF EXISTS "CourseCategory";

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" VARCHAR(255);

