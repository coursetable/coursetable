import React, { useState } from 'react';

import styles from './Navbar.module.css';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import FBLoginButton from './FBLoginButton';

function CourseTableNavbar(props) {
  const [nav_expanded, setExpand] = useState(false);

  return (
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
                <Logo />
              </span>
            </NavLink>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
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
            </Nav>
          </Navbar.Collapse>

          <FBLoginButton isLoggedIn={props.isLoggedIn} pullRight/>
        </Navbar>
      </Container>
    </div>
  );
}

export default CourseTableNavbar;
