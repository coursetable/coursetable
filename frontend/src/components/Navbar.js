import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import MeDropdown from './MeDropdown';
import Searchbar from '../components/Searchbar';
import { BsFillPersonFill } from 'react-icons/bs';
import { useComponentVisible } from '../utilities';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';

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
  const is_relative = width < 1230;

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
              className="justify-content-end"
            >
              {/* Close navbar on click in mobile view */}
              <Nav onClick={() => setExpand(false)}>
                {pathname === '/worksheet' && (
                  // Display catalog searchbar if on worksheet view
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
                )}
                <NavLink to="/catalog" className={styles.navbar_links}>
                  Catalog
                </NavLink>
                <NavLink to="/worksheet" className={styles.navbar_links}>
                  Worksheet
                </NavLink>
                <NavLink to="/about" className={styles.navbar_links}>
                  About
                </NavLink>
                {/* Profile icon */}
                <div className="d-none d-md-block">
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
