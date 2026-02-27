import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 — Page not found</h1>
      <p>This page does not exist.</p>
      <Link to="/">Go to Home</Link>
      {" · "}
      <Link to="/courses">Go to Courses</Link>
    </div>
  );
};

export default NotFoundPage;
