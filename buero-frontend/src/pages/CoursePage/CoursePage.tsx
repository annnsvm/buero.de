import { useParams } from "react-router-dom";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div>
      <h1>CoursePage (Learning View)</h1>
      <p>Course ID: {courseId}</p>
      <p>Sidebar (lessons) + main content (video/quiz/scenario).</p>
    </div>
  );
};

export default CoursePage;
