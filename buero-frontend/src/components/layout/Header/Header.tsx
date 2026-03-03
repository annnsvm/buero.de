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
            {/* Auth: open modal via hash; modals listen for #login / #signup */}
            <Link to={`${ROUTES.HOME}#login`} aria-label="Sign in">
              Sign in
            </Link>
            <Link to={`${ROUTES.HOME}#signup`} aria-label="Sign up">
              Sign up
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
