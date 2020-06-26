import React from 'react';

import styles from './Navbar.module.css';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function App() {
  return (
    <div className={styles.container}>
      <Navbar sticky="top" expand="lg" className={styles.navbar}>
        <NavLink to='/' activeStyle={{ textDecoration: 'none' }}>
          <span className={styles.coursetable_logo}>Course<span style={{ color: '#92bcea' }}>Table</span></span>
        </NavLink>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav >
            <NavLink to='/table' className={styles.navbar_links}>Courses</NavLink>
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