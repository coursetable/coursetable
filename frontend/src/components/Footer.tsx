import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import clsx from 'clsx';

import styles from './Footer.module.css';
import Logo from './Navbar/Logo';
import { Hr, TextComponent } from './Typography';
import { scrollToTop } from '../utilities/display';
import VercelBanner from '../images/powered-by-vercel.svg';

function Footer() {
  return (
    <Container fluid>
      <Hr />
      <footer className={clsx(styles.footer, 'py-5 px-5')}>
        <div className="row">
          {/* Copyright */}
          <div className="col-12 col-md">
            <span className={styles.footerLogo}>
              <Logo icon={false} />
            </span>
            <small className="d-block mb-3">
              &copy; {new Date().getFullYear()}
            </small>

            <a href="https://vercel.com/?utm_source=coursetable&utm_campaign=oss">
              <img
                style={{ height: '2rem' }}
                src={VercelBanner}
                alt="Powered by Vercel"
              />
            </a>
          </div>
          <div className="col-6 col-md">
            <h5 className={styles.sectionHeading}>Explore</h5>
            <ul className="list-unstyled text-small">
              {/* Catalog */}
              <li>
                <NavLink to="/catalog" onClick={scrollToTop}>
                  <TextComponent type="secondary">Catalog</TextComponent>
                </NavLink>
              </li>
              {/* Worksheet */}
              <li>
                <NavLink to="/worksheet" onClick={scrollToTop}>
                  <TextComponent type="secondary">Worksheet</TextComponent>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5 className={styles.sectionHeading}>Support</h5>
            <ul className="list-unstyled text-small">
              {/* FAQ */}
              <li>
                <NavLink to="/faq" onClick={scrollToTop}>
                  <TextComponent type="secondary">FAQ</TextComponent>
                </NavLink>
              </li>
              {/* Feedback */}
              <li>
                <a
                  href="https://feedback.coursetable.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={scrollToTop}
                >
                  <TextComponent type="secondary">Feedback</TextComponent>
                </a>
              </li>
              {/* Status */}
              <li>
                <a
                  href="https://stats.uptimerobot.com/NpVA5UNlX3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TextComponent type="secondary">Status</TextComponent>
                </a>
              </li>
              {/* Privacy Policy */}
              <li>
                <NavLink to="/privacypolicy" onClick={scrollToTop}>
                  <TextComponent type="secondary">Privacy Policy</TextComponent>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5 className={styles.sectionHeading}>Developers</h5>
            <ul className="list-unstyled text-small">
              {/* GraphQL explorer */}
              <li>
                <NavLink to="/graphiql" onClick={scrollToTop}>
                  <TextComponent type="secondary">
                    GraphQL playground
                  </TextComponent>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5 className={styles.sectionHeading}>About</h5>
            <ul className="list-unstyled text-small">
              {/* Team */}
              <li>
                <NavLink to="/about" onClick={scrollToTop}>
                  <TextComponent type="secondary">Team</TextComponent>
                </NavLink>
              </li>
              {/* Join us */}
              <li>
                <NavLink to="/joinus" onClick={scrollToTop}>
                  <TextComponent type="secondary">Join Us</TextComponent>
                </NavLink>
              </li>
              {/* Github */}
              <li>
                <a
                  href="https://github.com/coursetable"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TextComponent type="secondary">GitHub</TextComponent>
                </a>
              </li>
              {/* Linkedin */}
              <li>
                <a
                  href="https://www.linkedin.com/company/coursetable/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TextComponent type="secondary">LinkedIn</TextComponent>
                </a>
              </li>
              {/* Buy Me A Coffee */}
              <li>
                <a
                  href="https://www.buymeacoffee.com/coursetable"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TextComponent type={1}>Support CourseTable</TextComponent>
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
