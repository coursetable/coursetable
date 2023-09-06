import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import styles from './Footer.module.css';
import Logo from './Navbar/Logo';
import styled from 'styled-components';
import { StyledHr, TextComponent } from './StyledComponents';

import { scrollToTop } from '../utilities';

import VercelBanner from '../images/powered-by-vercel.svg';
// Header
const StyledH5 = styled.h5`
  transition: color ${({ theme }) => theme.trans_dur};
`;

/**
 * Footer
 */

const Footer: React.VFC = () => {
  return (
    <Container fluid>
      <StyledHr />
      <footer className={`${styles.footer} py-5 px-5`}>
        <div className="row">
          {/* Copyright */}
          <div className="col-12 col-md">
            <span className={styles.footer_logo}>
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
            <StyledH5>Explore</StyledH5>
            <ul className="list-unstyled text-small">
              {/* Catalog */}
              <li>
                <NavLink to="/catalog" onClick={scrollToTop}>
                  <TextComponent type={1}>Catalog</TextComponent>
                </NavLink>
              </li>
              {/* Worksheet */}
              <li>
                <NavLink to="/worksheet" onClick={scrollToTop}>
                  <TextComponent type={1}>Worksheet</TextComponent>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <StyledH5>Support</StyledH5>
            <ul className="list-unstyled text-small">
              {/* FAQ */}
              <li>
                <NavLink to="/faq" onClick={scrollToTop}>
                  <TextComponent type={1}>FAQ</TextComponent>
                </NavLink>
              </li>
              {/* Feedback */}
              <li>
                <a
                  href={`https://feedback.coursetable.com/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={scrollToTop}
                >
                  <TextComponent type={1}>Feedback</TextComponent>
                </a>
              </li>
              {/* Status */}
              <li>
                <a
                  href="https://stats.uptimerobot.com/NpVA5UNlX3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TextComponent type={1}>Status</TextComponent>
                </a>
              </li>
              {/* Privacy Policy */}
              <li>
                <NavLink to="/privacypolicy" onClick={scrollToTop}>
                  <TextComponent type={1}>Privacy Policy</TextComponent>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <StyledH5>Developers</StyledH5>
            <ul className="list-unstyled text-small">
              {/* GraphQL explorer */}
              <li>
                <NavLink to="/graphiql" onClick={scrollToTop}>
                  <TextComponent type={1}>GraphQL playground</TextComponent>
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <StyledH5>About</StyledH5>
            <ul className="list-unstyled text-small">
              {/* Team */}
              <li>
                <NavLink to="/about" onClick={scrollToTop}>
                  <TextComponent type={1}>Team</TextComponent>
                </NavLink>
              </li>
              {/* Join us */}
              <li>
                <NavLink to="/joinus" onClick={scrollToTop}>
                  <TextComponent type={1}>Join Us</TextComponent>
                </NavLink>
              </li>
              {/* Github */}
              <li>
                <a
                  href="https://github.com/coursetable"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TextComponent type={1}>GitHub</TextComponent>
                </a>
              </li>
              {/* Blog */}
              <li>
                <a
                  href="https://www.linkedin.com/company/coursetable/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TextComponent type={1}>LinkedIn</TextComponent>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </Container>
  );
};

export default Footer;
