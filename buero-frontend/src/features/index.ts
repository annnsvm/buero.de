/**
 * Feature modules. Each feature may contain:
 * - components/
 * - redux/ (slice; rootReducer imports from here when migrated)
 * - api/
 * - validation/
 * See docs/frontend-architecture.md §3.5
 */

export * as auth from "./auth";
export * as landing from "./landing";
export * as placementTest from "./placement-test";
export * as coursesCatalog from "./courses-catalog";
export * as courseLearning from "./course-learning";
export * as profile from "./profile";
export * as subscriptions from "./subscriptions";
export * as lessonRequests from "./lesson-requests";
export * as progressQuizzes from "./progress-quizzes";
export * as accountSettings from "./account-settings";
