import { Link } from "react-router-dom";
import { ROUTES } from "../../../helpers/routes";
import Container from "../Container/Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer >
      <Container>
        <div >
          <p>
            © {currentYear} buero.de. All rights reserved.
          </p>
          <nav aria-label="Footer navigation">
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
            <Link to={`${ROUTES.HOME}#login`} aria-label="Sign in">
              Sign in
            </Link>
            <Link to={`${ROUTES.HOME}#signup`} aria-label="Sign up">
              Sign up
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
