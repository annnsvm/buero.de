import { Link } from "react-router-dom";
import { ROUTES } from "../../helpers/routes";

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 — Page not found</h1>
      <p>This page does not exist.</p>
      <Link to={ROUTES.HOME}>Go to Home</Link>
      {" · "}
      <Link to={ROUTES.COURSES}>Go to Courses</Link>
    </div>
  );
};

export default NotFoundPage;
