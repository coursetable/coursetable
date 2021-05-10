import { useState } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill } from 'react-icons/bs';
import styled from 'styled-components';
import posthog from 'posthog-js';
import Logo from './Logo';
import DarkModeButton from './DarkModeButton';
import MeDropdown from './MeDropdown';
import { useWindowDimensions } from './WindowDimensionsProvider';
import { logout, scrollToTop, useComponentVisible } from '../utilities';
import FBLoginButton from './FBLoginButton';
import styles from './Navbar.module.css';
import { SurfaceComponent } from './StyledComponents';

import { API_ENDPOINT } from '../config';

const StyledMeIcon = styled.div`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgba(1, 1, 1, 0.1)' : '#525252'};
  color: ${({ theme }) => theme.text[1]};
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  transition: background-color 0.2s linear, color 0.2s linear;
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.primary};
  }
`;

const StyledDiv = styled.div`
  padding: 0.5rem 1rem 0.5rem 0rem;
  transition: 0.1s;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 500;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.5rem 1rem 0.5rem 0rem;
  transition: 0.1s;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 500;
  &:hover {
    text-decoration: none !important;
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
  }
`;

const StyledLink = styled.a`
  padding: 0.5rem 1rem 0.5rem 0rem;
  transition: 0.1s;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 500;
  &:hover {
    text-decoration: none !important;
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
  }
`;

const StyledNavToggle = styled(Navbar.Toggle)`
  border-color: ${({ theme }) => theme.border} !important;
  .navbar-toggler-icon {
    background-image: ${({ theme }) =>
      `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='${
        theme.theme === 'light'
          ? 'rgba(69, 69, 69, 1)'
          : 'rgba(219, 219, 219, 1)'
      }' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`};
  }
`;

/**
 * Renders the navbar
 * @prop isLoggedIn - boolean | is user logged in?
 * @prop themeToggler - callback which toggles between light and dark mode
 */
function CourseTableNavbar({
  isLoggedIn,
  themeToggler,
}: {
  isLoggedIn: boolean;
  themeToggler: () => void;
}) {
  // Is navbar expanded in mobile view?
  const [nav_expanded, setExpand] = useState(false);
  // Ref to detect outside clicks for profile dropdown
  const {
    ref_visible,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible<HTMLDivElement>(false);

  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;
  // const is_relative = width < 1230;

  return (
    <div className={styles.sticky_navbar}>
      <SurfaceComponent layer={0}>
        <Container fluid className="p-0">
          <Navbar
            expanded={nav_expanded}
            onToggle={(expanded) => setExpand(expanded)}
            // sticky="top"
            expand="md"
            className="shadow-sm px-3"
          >
            {/* Logo in top left */}
            <Nav className={`${styles.nav_brand} navbar-brand py-2`}>
              <NavLink
                to="/"
                activeStyle={{
                  textDecoration: 'none',
                  display: 'table-cell',
                  verticalAlign: 'middle',
                }}
              >
                {/* Condense logo if on home page */}
                <span className={styles.nav_logo}>
                  <Logo icon={false} />
                </span>
              </NavLink>
            </Nav>

            <StyledNavToggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse
              id="basic-navbar-nav"
              // Make navbar display: flex when not mobile. If mobile, normal formatting
              className={!is_mobile ? 'd-flex' : 'justify-content-end'}
            >
              {/* Close navbar on click in mobile view */}
              <Nav onClick={() => setExpand(false)} style={{ width: '100%' }}>
                {/* About Page */}
                <StyledNavLink
                  to="/about"
                  // Left align about link if not mobile
                  className={!is_mobile ? ' align-self-begin' : ''}
                >
                  About
                </StyledNavLink>
                {/* FAQs Page */}
                <StyledNavLink
                  to="/faq"
                  // Left align about link if not mobile
                  className={!is_mobile ? ' align-self-begin' : ''}
                >
                  FAQ
                </StyledNavLink>
                {/* Feedback Page */}
                <StyledLink
                  href={`${API_ENDPOINT}/api/canny/board`}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Left align about link if not mobile
                  className={!is_mobile ? ' mr-auto' : ''}
                >
                  Feedback
                </StyledLink>

                {/* DarkMode Button */}
                <div
                  className={`${styles.navbar_dark_mode_btn} d-flex`}
                  onClick={themeToggler}
                >
                  <DarkModeButton />
                </div>

                {/* Catalog Page */}
                <StyledNavLink
                  to="/catalog"
                  // Right align catalog link if not mobile
                  className={!is_mobile ? ' align-self-end' : ''}
                  onClick={scrollToTop}
                >
                  Catalog
                </StyledNavLink>
                {/* Worksheet Page */}
                <StyledNavLink
                  to="/worksheet"
                  // Right align worksheet link if not mobile
                  className={!is_mobile ? ' align-self-end' : ''}
                  onClick={scrollToTop}
                >
                  Worksheet
                </StyledNavLink>

                {/* Profile Icon. Show if not mobile */}
                <div
                  // Right align profile icon if not mobile
                  className={`d-none d-md-block ${
                    !is_mobile ? 'align-self-end' : ''
                  }`}
                >
                  <div className={styles.navbar_me}>
                    <StyledMeIcon
                      ref={ref_visible}
                      className={`${styles.icon_circle} m-auto`}
                      onClick={() => setIsComponentVisible(!isComponentVisible)}
                    >
                      <BsFillPersonFill
                        className="m-auto"
                        size={20}
                        color={isComponentVisible ? '#007bff' : undefined}
                      />
                    </StyledMeIcon>
                  </div>
                </div>
                {/* Sign in/out and Facebook buttons. Show if mobile */}
                <div className="d-md-none">
                  {!isLoggedIn ? (
                    <StyledDiv
                      onClick={() => {
                        posthog.capture('login');

                        window.location.href = `${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`;
                      }}
                    >
                      Sign In
                    </StyledDiv>
                  ) : (
                    <>
                      <StyledDiv>
                        <FBLoginButton />
                      </StyledDiv>
                      <StyledDiv onClick={logout}>Sign Out</StyledDiv>
                    </>
                  )}
                </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </SurfaceComponent>
      {/* Dropdown that has position: absolute */}
      <div>
        <MeDropdown
          profile_expanded={isComponentVisible}
          setIsComponentVisible={setIsComponentVisible}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}

export default CourseTableNavbar;
