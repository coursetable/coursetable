import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import MeDropdown from './MeDropdown';
import { BsFillPersonFill } from 'react-icons/bs';
import { useComponentVisible } from '../utilities';

function CourseTableNavbar(props) {
  const [nav_expanded, setExpand] = useState(false);
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  const condensed = useLocation().pathname === '/';
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
            <Navbar.Brand>
              <NavLink
                to="/"
                activeStyle={{
                  textDecoration: 'none',
                  display: 'table-cell',
                  verticalAlign: 'middle',
                }}
              >
                <span className={styles.nav_logo}>
                  <Logo condensed={condensed} />
                </span>
              </NavLink>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Nav onClick={() => setExpand(false)}>
                <NavLink to="/catalog" className={styles.navbar_links}>
                  Catalog
                </NavLink>
                <NavLink to="/worksheet" className={styles.navbar_links}>
                  Worksheet
                </NavLink>
                <NavLink to="/about" className={styles.navbar_links}>
                  About
                </NavLink>
                <div className="d-none d-md-block">
                  <div className={styles.navbar_me}>
                    <div
                      ref={ref}
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
      <div>
        <MeDropdown
          profile_expanded={isComponentVisible}
          setIsComponentVisible={setIsComponentVisible}
          isLoggedIn={props.isLoggedIn}
          listings={props.listings}
        />
      </div>
    </div>
  );
}

export default CourseTableNavbar;
