/** Як бек віддає GET /subscriptions/me (snake_case) */
export type RawCourseAccess = {
  id: string;
  course_id: string;
  access_type: 'trial' | 'purchase' | 'subscription';
  trial_ends_at?: string | null;
  payment_id?: string | null;
  subscription_id?: string | null;
  created_at: string;
};

export type NormalizedAccess = {
  id: string;
  courseId: string;
  accessType: 'trial' | 'purchase' | 'subscription';
  trialEndsAt: Date | null;
};

/** GET /courses — мінімум для мапера картки */
export type CatalogCourse = { id: string } & Record<string, unknown>;
