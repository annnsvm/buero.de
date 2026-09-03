-- CreateTable
CREATE TABLE "pending_registrations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(255),
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'en',
    "locale" VARCHAR(8) NOT NULL DEFAULT 'en',
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pending_registrations_email_key" ON "pending_registrations"("email");

-- CreateIndex
CREATE INDEX "pending_registrations_expires_at_idx" ON "pending_registrations"("expires_at");
