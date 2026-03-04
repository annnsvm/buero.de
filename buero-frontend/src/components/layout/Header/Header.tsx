import { Link, NavLink, useLocation } from "react-router-dom";
import { ROUTES, isHeaderLightByPath } from "../../../helpers/routes";
import Container from "../Container/Container";
import { Button, Logo } from "@/components/ui";

const activeClassLight =
  "font-semibold text-[var(--color-primary-foreground)] underline underline-offset-4";
const inactiveClassLight = "text-[var(--color-white)]";
const activeClassDark =
  "font-semibold text-[var(--color-primary)] underline underline-offset-4";
const inactiveClassDark = "text-[var(--color-text-primary)]";

const Header = () => {
  const { pathname } = useLocation();
  const isLight = isHeaderLightByPath(pathname);

  const isHomeActive = pathname === "/" || pathname === ROUTES.HOME;
  const isCoursesActive = pathname === ROUTES.COURSES || pathname.startsWith("/courses/");
  const isProfileActive = pathname === ROUTES.PROFILE;

  const activeClass = isLight ? activeClassLight : activeClassDark;
  const inactiveClass = isLight ? inactiveClassLight : inactiveClassDark;
  const getClass = (active: boolean) =>
    `transition-colors ${isLight ? "hover:text-[var(--color-primary-foreground)]" : "hover:text-[var(--color-primary)]"} ${active ? activeClass : inactiveClass}`;

  return (
    <header
      className={`absolute left-0 right-0 top-0 transition-colors duration-200 ${
        isLight ? "bg-transparent" : "bg-[var(--color-surface-section)]"
      }`}
    >
      <Container>
        <div className="py-12 tablet:px-16 flex items-center justify-between gap-6 text-lg">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
            aria-label="buero.de – go to home"
          >
            <Logo width={70} height={28} />
          </Link>
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center tablet:gap-8"
          >
            <NavLink
              to={ROUTES.HOME}
              end
              className={getClass(isHomeActive)}
            >
              Home
            </NavLink>
            <NavLink
              to={ROUTES.COURSES}
              className={getClass(isCoursesActive)}
            >
              Courses
            </NavLink>
            <NavLink
              to={ROUTES.PROFILE}
              className={getClass(isProfileActive)}
            >
              My Learning
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant={isLight ? "outline" : "outlineDark"}
              aria-label="Sign in"
            >
              Sign in
            </Button>
            <Button variant="solid" aria-label="Start free trial">
              Start free trial
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
