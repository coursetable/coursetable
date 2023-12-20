import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Element } from 'react-scroll';
import { Link } from 'react-router-dom';

import { API_ENDPOINT } from '../config';

import {
  FcConferenceCall,
  FcComboChart,
  FcBookmark,
  FcSearch,
} from 'react-icons/fc';
import styled from 'styled-components';
import styles from './Landing.module.css';
import LandingImage from '../images/landing_page.svg';

const StyledStat = styled.span`
  color: ${({ theme }) => theme.primary};
`;

/**
 * Renders the Landing page for when users aren't logged in
 */

function Landing() {
  return (
    <div /* className={styles.container} */>
      <Container fluid>
        <Element name="splashpage">
          <div className={`${styles.splashpage} mx-auto`}>
            <Row className="mx-auto" style={{ minHeight: 'inherit' }}>
              <Col md={6} className="d-flex">
                <div className="m-auto">
                  <h1 className="font-weight-bold text-md-left mb-4">
                    The best place to shop for classes at Yale.
                  </h1>
                  <Row className="pb-2 m-auto">
                    <span className={`${styles.feature_text} d-inline`}>
                      <FcSearch className="mr-2 my-auto" size={20} />
                      Browse our catalog of <StyledStat>
                        80,000+
                      </StyledStat>{' '}
                      classes
                    </span>
                  </Row>
                  <Row className="pb-2 m-auto">
                    <span className={styles.feature_text}>
                      <FcComboChart className="mr-2 my-auto" size={20} />
                      Read from <StyledStat>600,000+</StyledStat> student
                      evaluation comments
                    </span>
                  </Row>
                  <Row className="pb-2 m-auto">
                    <span className={styles.feature_text}>
                      <FcBookmark className="mr-2 my-auto" size={20} />
                      Save and view classes in your worksheet
                    </span>
                  </Row>
                  <Row className="m-auto">
                    <span className={styles.feature_text}>
                      <FcConferenceCall className="mr-2 my-auto" size={20} />
                      See what classes your friends are interested in
                    </span>
                  </Row>
                  <Row className="mx-auto mt-4 justify-content-md-start justify-content-center">
                    <a
                      href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`}
                      className={`${styles.btn} ${styles.login} mr-2`}
                    >
                      Login with CAS
                    </a>
                    <Link
                      to="/about"
                      className={`${styles.btn} ${styles.about}`}
                    >
                      About Us
                    </Link>
                  </Row>
                </div>
              </Col>
              <Col md={6} className="d-flex">
                <div className="m-auto d-none d-md-block">
                  <img
                    alt="Landing page"
                    src={LandingImage}
                    style={{ width: '100%' }}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Element>
      </Container>
    </div>
  );
}

export default Landing;
