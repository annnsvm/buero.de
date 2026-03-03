-- Architecture §8: one active subscription per (user_id, course_id)
-- Partial unique: only one row with status IN ('active', 'trialing') per (user_id, course_id)
CREATE UNIQUE INDEX "idx_subscriptions_user_course_active" ON "subscriptions"("user_id", "course_id") WHERE "status" IN ('active', 'trialing');
