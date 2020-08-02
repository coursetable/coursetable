import React from 'react';

import styles from './Footer.module.css';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { Container } from 'react-bootstrap';

function App() {
  const scroll_top = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };
  return (
    <Container fluid>
      <hr />
      <footer className={'py-5 px-5 ' + styles.footer}>
        <div className="row">
          <div className="col-12 col-md">
            <span className={styles.footer_logo}>
              <Logo />
            </span>
            <small className="d-block mb-3">&copy; 2020</small>
          </div>
          <div className="col-6 col-md">
            <h5>Explore courses</h5>
            <ul className="list-unstyled text-small">
              <li>
                <NavLink to="/catalog" onClick={scroll_top}>
                  Catalog
                </NavLink>
              </li>
              <li>
                <NavLink to="/worksheet" onClick={scroll_top}>
                  Worksheet
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>Support</h5>
            <ul className="list-unstyled text-small">
              <li>
                <NavLink to="/faq" onClick={scroll_top}>
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink to="/changelog" onClick={scroll_top}>
                  Changelog
                </NavLink>
              </li>
              <li>
                <NavLink to="/feedback" onClick={scroll_top}>
                  Feedback
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>About</h5>
            <ul className="list-unstyled text-small">
              <li>
                <NavLink to="/about" onClick={scroll_top}>
                  Team
                </NavLink>
              </li>
              <li>
                <NavLink to="/joinus" onClick={scroll_top}>
                  Join us
                </NavLink>
              </li>
              <li>
                <a href="https://github.com/coursetable" target="_blank">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </Container>
  );
}

export default App;
