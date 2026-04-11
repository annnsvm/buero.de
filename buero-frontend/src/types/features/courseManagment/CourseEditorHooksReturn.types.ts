export type UseCourseEditorRouterReturn = ReturnType<
  typeof import('@/features/course-managment/course-editor/hooks/router/useCourseEditorRouter').useCourseEditorRouter
>;

export type UseCourseEditorStateReturn = ReturnType<
  typeof import('@/features/course-managment/course-editor/hooks/state/useCourseEditorState').useCourseEditorState
>;

export type UseCourseEditorTreeReturn = ReturnType<
  typeof import('@/features/course-managment/course-editor/hooks/tree/useCourseEditorTree').useCourseEditorTree
>;

export type UseCourseEditorEffectsParams = {
  pathname: string;
  routeCourseId: string | undefined;
  state: UseCourseEditorStateReturn;
  tree: UseCourseEditorTreeReturn;
};

export type UseCourseEditorHandlersParams = {
  state: UseCourseEditorStateReturn;
  tree: UseCourseEditorTreeReturn;
  router: UseCourseEditorRouterReturn;
};
