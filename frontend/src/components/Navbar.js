import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import MeDropdown from './MeDropdown';
// import Searchbar from '../components/Searchbar';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import { BsFillPersonFill } from 'react-icons/bs';
import { useComponentVisible } from '../utilities';
import FBLoginButton from './FBLoginButton';

/**
 * Renders the navbar
 * @prop isLoggedIn - boolean | is user logged in?
 */

function CourseTableNavbar({ isLoggedIn }) {
  // Is navbar expanded in mobile view?
  const [nav_expanded, setExpand] = useState(false);
  // Ref to detect outside clicks for profile dropdown
  const {
    ref_visible,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  // Get the pathname of the current page
  const pathname = useLocation().pathname;
  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;
  // const is_relative = width < 1230;

  // Handle 'sign out' button click
  const handleLogoutClick = () => {
    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    // Redirect to home page and refresh as well
    window.location.pathname = '/';

    // Metric Tracking of Logging Out
    window.umami.trackEvent('Account Logout', 'account');
  };

  return (
    <div>
      <div className={`shadow-sm ${styles.navbar}`}>
        <Container fluid>
          <Navbar
            expanded={nav_expanded}
            onToggle={(expanded) => setExpand(expanded)}
            // sticky="top"
            expand="md"
            className={styles.navbar}
          >
            {/* Logo in top left */}
            <Navbar.Brand>
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
                  <Logo condensed={pathname === '/'} />
                </span>
              </NavLink>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse
              id="basic-navbar-nav"
              // Make navbar display: flex when not mobile. If mobile, normal formatting
              className={!is_mobile ? 'd-flex' : 'justify-content-end'}
            >
              {/* Close navbar on click in mobile view */}
              <Nav onClick={() => setExpand(false)} style={{ width: '100%' }}>
                {/* {pathname === '/worksheet' && (
                  // Display catalog searchbar if on worksheet view. NOT USING RN
                  <div
                    className={
                      'd-none d-md-block ' +
                      (is_relative
                        ? styles.search_bar_relative
                        : styles.search_bar_mid)
                    }
                  >
                    <Searchbar bar_size="md" />
                  </div>
                )} */}
                {/* About Page */}
                <NavLink
                  to="/about"
                  // Left align about link if not mobile
                  className={
                    styles.navbar_links + (!is_mobile ? ' mr-auto' : '')
                  }
                >
                  About
                </NavLink>
                {/* Catalog Page */}
                <NavLink
                  to="/catalog"
                  // Right align catalog link if not mobile
                  className={
                    styles.navbar_links + (!is_mobile ? ' align-self-end' : '')
                  }
                >
                  Catalog
                </NavLink>
                {/* Worksheet Page */}
                <NavLink
                  to="/worksheet"
                  // Right align worksheet link if not mobile
                  className={
                    styles.navbar_links + (!is_mobile ? ' align-self-end' : '')
                  }
                >
                  Worksheet
                </NavLink>

                {/* Profile Icon. Show if not mobile */}
                <div
                  // Right align profile icon if not mobile
                  className={
                    'd-none d-md-block ' + (!is_mobile ? 'align-self-end' : '')
                  }
                >
                  <div className={styles.navbar_me}>
                    <div
                      ref={ref_visible}
                      className={styles.icon_circle + ' m-auto'}
                      onClick={() => setIsComponentVisible(!isComponentVisible)}
                    >
                      <BsFillPersonFill
                        className={styles.me_icon + ' m-auto'}
                        size={20}
                        color={isComponentVisible ? '#007bff' : undefined}
                      />
                    </div>
                  </div>
                </div>
                {/* Sign in/out and Facebook buttons. Show if mobile */}
                <div className="d-md-none">
                  {!isLoggedIn ? (
                    <div
                      className={styles.navbar_links}
                      onClick={() => {
                        //Metric Tracking of Connecting Facebook
                        window.umami.trackEvent('Facebook Login', 'facebook');

                        window.location.href =
                          '/legacy_api/index.php?forcelogin=1';
                      }}
                    >
                      Sign In
                    </div>
                  ) : (
                    <>
                      <div className={styles.navbar_links}>
                        <FBLoginButton />
                      </div>
                      <div
                        className={styles.navbar_links}
                        onClick={handleLogoutClick}
                      >
                        Sign Out
                      </div>
                    </>
                  )}
                </div>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
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
