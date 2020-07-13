import React from 'react';

import styles from './Navbar.module.css';
import common_styles from '../styles/common.module.css';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Logo from "./Logo"

function CourseTableNavbar() {
  return (
    <div className={`shadow-sm ${styles.navbar}`}>
      <Navbar sticky="top" expand="lg" className={styles.navbar}>
        <Logo />

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
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
      </Navbar>
    </div>
  );
}

export default CourseTableNavbar;
