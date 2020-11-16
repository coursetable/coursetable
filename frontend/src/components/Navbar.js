import React, { useState } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import DarkModeButton from './DarkModeButton';
import MeDropdown from './MeDropdown';
// import Searchbar from '../components/Searchbar';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import { BsFillPersonFill } from 'react-icons/bs';
import { scrollToTop, useComponentVisible } from '../utilities';
import FBLoginButton from './FBLoginButton';
import styles from './Navbar.module.css';
import styled from 'styled-components';
import posthog from 'posthog-js';
import { SurfaceComponent } from '../components/StyledComponents';

const StyledMeIcon = styled.div`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgba(1, 1, 1, 0.1)' : '#525252'};
  color: ${({ theme }) => theme.text[1]};
  transition: background-color 0.2s linear, color 0.2s linear;
`;

const StyledDiv = styled.div`
  padding: 0.5rem 1rem 0.5rem 0rem;
  transition: 0.1s;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 500;
  &:hover {
    color: #007bff;
  }
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.5rem 1rem 0.5rem 0rem;
  transition: 0.1s;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 500;
  &:hover {
    text-decoration: none !important;
    color: #007bff;
  }
  &.active {
    color: #007bff;
  }
`;

/**
 * Renders the navbar
 * @prop isLoggedIn - boolean | is user logged in?
 */

function CourseTableNavbar({ isLoggedIn, themeToggler }) {
  // Is navbar expanded in mobile view?
  const [nav_expanded, setExpand] = useState(false);
  // Ref to detect outside clicks for profile dropdown
  const {
    ref_visible,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;
  // const is_relative = width < 1230;

  // Handle 'sign out' button click
  const handleLogoutClick = () => {
    posthog.capture('logout');
    posthog.reset();

    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    // Redirect to home page and refresh as well
    window.location.pathname = '/';
  };

  return (
    <div className={styles.sticky_navbar}>
      <SurfaceComponent layer={0}>
        <Container fluid className="p-0">
          <Navbar
            expanded={nav_expanded}
            onToggle={(expanded) => setExpand(expanded)}
            // sticky="top"
            expand="md"
            className={'shadow-sm px-3'}
          >
            {/* Logo in top left */}
            <Nav className={styles.nav_brand + ' navbar-brand py-2'}>
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

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

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
                  className={!is_mobile ? ' mr-auto' : ''}
                >
                  FAQ
                </StyledNavLink>

                {/* DarkMode Button */}
                <div
                  className={styles.navbar_dark_mode_btn + ' d-flex'}
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
                  className={
                    'd-none d-md-block ' + (!is_mobile ? 'align-self-end' : '')
                  }
                >
                  <div className={styles.navbar_me}>
                    <StyledMeIcon
                      ref={ref_visible}
                      className={styles.icon_circle + ' m-auto'}
                      onClick={() => setIsComponentVisible(!isComponentVisible)}
                    >
                      <BsFillPersonFill
                        className={styles.me_icon + ' m-auto'}
                        size={20}
                        color={isComponentVisible ? '#007bff' : undefined}
                      />
                    </StyledMeIcon>
                  </div>
                </div>
                {/* Sign in/out and Facebook buttons. Show if mobile */}
                <div className="d-md-none">
                  <StyledDiv>
                    <a
                      href="https://old.coursetable.com/"
                      style={{ color: 'inherit' }}
                    >
                      Old CourseTable
                    </a>
                  </StyledDiv>
                  {!isLoggedIn ? (
                    <StyledDiv
                      onClick={() => {
                        posthog.capture('login');

                        window.location.href =
                          '/legacy_api/index.php?forcelogin=1';
                      }}
                    >
                      Sign In
                    </StyledDiv>
                  ) : (
                    <>
                      <StyledDiv>
                        <FBLoginButton />
                      </StyledDiv>
                      <StyledDiv onClick={handleLogoutClick}>
                        Sign Out
                      </StyledDiv>
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
