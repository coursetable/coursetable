import React from 'react';

import styles from './Navbar.module.css';
import common_styles from '../styles/common.module.css';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function App() {
  return (
    <div className={styles.navbar}>
      <Navbar sticky="top" expand="lg" className={styles.navbar}>
        <NavLink to='/' activeStyle={{ textDecoration: 'none' }}>
          <span className={common_styles.coursetable_logo}>Course<span style={{ color: '#92bcea' }}>Table</span></span>
        </NavLink>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav >
            <NavLink to='/search' className={styles.navbar_links}>Search</NavLink>
            <NavLink to='/courses' className={styles.navbar_links}>Courses</NavLink>
            <NavLink to='/historical' className={styles.navbar_links}>Historical</NavLink>
            <NavLink to='/worksheet' className={styles.navbar_links}>Worksheet</NavLink>
            <NavLink to='/about' className={styles.navbar_links}>About</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default App;