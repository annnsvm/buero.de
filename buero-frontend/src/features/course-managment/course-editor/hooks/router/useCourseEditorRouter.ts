import { useLocation, useMatch, useNavigate } from 'react-router-dom';

export const useCourseEditorRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMatch = useMatch({ path: '/teacher/courses/:courseId/edit', end: true });
  const routeCourseId = editMatch?.params.courseId;

  return { navigate, location, routeCourseId };
};
