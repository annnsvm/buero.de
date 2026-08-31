-- CreateEnum
CREATE TYPE "AttachmentKind" AS ENUM ('file', 'link');

-- CreateTable
CREATE TABLE "material_attachments" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "kind" "AttachmentKind" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file_name" TEXT,
    "mime_type" TEXT,
    "size_bytes" INTEGER,
    "storage_key" TEXT,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "material_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "material_attachments_material_id_idx" ON "material_attachments"("material_id");

-- AddForeignKey
ALTER TABLE "material_attachments" ADD CONSTRAINT "material_attachments_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
