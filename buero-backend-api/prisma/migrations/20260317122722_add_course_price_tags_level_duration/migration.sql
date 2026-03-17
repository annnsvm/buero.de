-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "duration_hours" INTEGER,
ADD COLUMN     "level" "Level",
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "courses_level_idx" ON "courses"("level");
