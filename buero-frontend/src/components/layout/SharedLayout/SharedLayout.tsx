import { Outlet, Link } from "react-router-dom";
import { ROUTES } from "../../../helpers/routes";

const SharedLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
        <nav>
          <Link to={ROUTES.HOME}>Home</Link>
          {" · "}
          <Link to={ROUTES.COURSES}>Courses</Link>
          {" · "}
          <Link to={ROUTES.PROFILE}>Profile</Link>
          {" · "}
          <Link to={ROUTES.AUTH}>Auth</Link>
        </nav>
      </header>
      <main style={{ flex: 1, padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default SharedLayout;
