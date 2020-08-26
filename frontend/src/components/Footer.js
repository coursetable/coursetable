import React from 'react';

import styles from './Footer.module.css';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { Container } from 'react-bootstrap';

import {scrollToTop} from '../utilities';

function Footer() {
  return (
    <Container fluid>
      <hr />
      <footer className={'py-5 px-5 ' + styles.footer}>
        <div className="row">
          <div className="col-12 col-md">
            <span className={styles.footer_logo}>
              <Logo />
            </span>
            <small className="d-block mb-3">
              &copy; {new Date().getFullYear()}
            </small>
          </div>
          <div className="col-6 col-md">
            <h5>Explore</h5>
            <ul className="list-unstyled text-small">
              <li>
                <NavLink to="/catalog" onClick={scrollToTop}>
                  Catalog
                </NavLink>
              </li>
              <li>
                <NavLink to="/worksheet" onClick={scrollToTop}>
                  Worksheet
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>Support</h5>
            <ul className="list-unstyled text-small">
              <li>
                <NavLink to="/faq" onClick={scrollToTop}>
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink to="/changelog" onClick={scrollToTop}>
                  Changelog
                </NavLink>
              </li>
              <li>
                <NavLink to="/feedback" onClick={scrollToTop}>
                  Feedback
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>About</h5>
            <ul className="list-unstyled text-small">
              <li>
                <NavLink to="/about" onClick={scrollToTop}>
                  Team
                </NavLink>
              </li>
              <li>
                <NavLink to="/joinus" onClick={scrollToTop}>
                  Join us
                </NavLink>
              </li>
              <li>
                <a
                  href="https://github.com/coursetable"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

export default Footer;
