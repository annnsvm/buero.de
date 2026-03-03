import { Link } from "react-router-dom";
import { ROUTES } from "../../../helpers/routes";
import Container from "../Container/Container";

const Header = () => {
  return (
    <header>
      <Container>
        <div>
          <Link
            to={ROUTES.HOME}
          >
            buero.de
          </Link>
          <nav aria-label="Main navigation">
            <Link
              to={ROUTES.HOME}
            >
              Home
            </Link>
            <Link
              to={ROUTES.COURSES}
            >
              Courses
            </Link>
            <Link
              to={ROUTES.PROFILE}
            >
              Profile
            </Link>
            <Link
              to={ROUTES.AUTH}
            >
              Sign in
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
