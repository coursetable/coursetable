import React, { useEffect, useState } from 'react';
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
import posthog from 'posthog-js';
import { SurfaceComponent } from '../components/StyledComponents';

import {
  setFetchMethod,
  enable as enableDarkMode,
  disable as disableDarkMode,
} from 'darkreader';

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

  // // DarkMode or LightMode
  // setFetchMethod(window.fetch);

  // // Checks user preferences for dark mode
  // if (!window.localStorage.getItem('darkmode')) {
  //   let temp =
  //     window.matchMedia('(prefers-color-scheme)').media !== 'not all' &&
  //     window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   window.localStorage.setItem('darkmode', temp ? 'dark' : 'light');
  // }

  // const [darkModeEnabled, setDarkModeEnabled] = useState(
  //   window.localStorage.getItem('darkmode') === 'dark'
  // );

  // // Updates current theme appropriately
  // useEffect(() => {
  //   if (darkModeEnabled)
  //     enableDarkMode({
  //       brightness: 100,
  //       contrast: 100,
  //       sepia: 5,
  //     });
  //   else disableDarkMode();
  // }, [darkModeEnabled]);

  return (
    <div className={styles.sticky_navbar}>
      <SurfaceComponent>
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
                    styles.navbar_links +
                    (!is_mobile ? ' align-self-begin' : '')
                  }
                >
                  About
                </NavLink>
                {/* FAQs Page */}
                <NavLink
                  to="/faq"
                  // Left align about link if not mobile
                  className={
                    styles.navbar_links + (!is_mobile ? ' mr-auto' : '')
                  }
                >
                  FAQ
                </NavLink>

                {/* DarkMode Button */}
                <div
                  className={styles.navbar_dark_mode_btn + ' d-flex'}
                  // onClick={() => {
                  //   window.localStorage.setItem(
                  //     'darkmode',
                  //     !darkModeEnabled ? 'dark' : 'light'
                  //   );
                  //   setDarkModeEnabled(!darkModeEnabled);
                  // }}
                >
                  <DarkModeButton
                    // darkModeEnabled={darkModeEnabled}
                    toggleTheme={themeToggler}
                  />
                </div>

                {/* Catalog Page */}
                <NavLink
                  to="/catalog"
                  // Right align catalog link if not mobile
                  className={
                    styles.navbar_links + (!is_mobile ? ' align-self-end' : '')
                  }
                  onClick={scrollToTop}
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
                  onClick={scrollToTop}
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
                  <div className={styles.navbar_links}>
                    <a
                      href="https://old.coursetable.com/"
                      style={{ color: 'rgba(1, 1, 1, 0.6)' }}
                    >
                      Old CourseTable
                    </a>
                  </div>
                  {!isLoggedIn ? (
                    <div
                      className={styles.navbar_links}
                      onClick={() => {
                        posthog.capture('login');

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
