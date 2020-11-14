import React from 'react';

import styles from './Footer.module.css';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import { Container } from 'react-bootstrap';
import { StyledHr, SecondaryText } from './StyledComponents';

import { scrollToTop } from '../utilities';

/**
 * Footer
 */

function Footer() {
  return (
    <Container fluid>
      <StyledHr />
      <footer className={styles.footer + ' py-5 px-5'}>
        <div className="row">
          {/* Copyright */}
          <div className="col-12 col-md">
            <span className={styles.footer_logo}>
              <Logo icon={false} />
            </span>
            <small className="d-block mb-3">
              &copy; {new Date().getFullYear()}
            </small>
          </div>
          <div className="col-6 col-md">
            <h5>Explore</h5>
            <ul className="list-unstyled text-small">
              {/* Catalog */}
              <li>
                <NavLink to="/catalog" onClick={scrollToTop}>
                  <SecondaryText>Catalog</SecondaryText>
                </NavLink>
              </li>
              {/* Worksheet */}
              <li>
                <NavLink to="/worksheet" onClick={scrollToTop}>
                  <SecondaryText>Worksheet</SecondaryText>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>Support</h5>
            <ul className="list-unstyled text-small">
              {/* FAQ */}
              <li>
                <NavLink to="/faq" onClick={scrollToTop}>
                  <SecondaryText>FAQ</SecondaryText>
                </NavLink>
              </li>
              {/* Feedback */}
              <li>
                <NavLink to="/feedback" onClick={scrollToTop}>
                  <SecondaryText>Feedback</SecondaryText>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>About</h5>
            <ul className="list-unstyled text-small">
              {/* Team */}
              <li>
                <NavLink to="/about" onClick={scrollToTop}>
                  <SecondaryText>Team</SecondaryText>
                </NavLink>
              </li>
              {/* Join us */}
              <li>
                <NavLink to="/joinus" onClick={scrollToTop}>
                  <SecondaryText>Join Us</SecondaryText>
                </NavLink>
              </li>
              {/* Blog */}
              <li>
                <a
                  href="https://legacy.coursetable.com/Blog.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SecondaryText>Blog</SecondaryText>
                </a>
              </li>
              {/* Github */}
              <li>
                <a
                  href="https://github.com/coursetable"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SecondaryText>Github</SecondaryText>
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
