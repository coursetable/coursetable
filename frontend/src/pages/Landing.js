import React from 'react';
// import { BsChevronDoubleDown } from 'react-icons/bs';
import { Button, Row, Col, Container } from 'react-bootstrap';
import { Element } from 'react-scroll';
import { Link } from 'react-router-dom';

import Logo from '../components/Logo';
import styles from './Landing.module.css';
// import { useWindowDimensions } from '../components/WindowDimensionsProvider';

/**
 * Renders the Landing page for when users aren't logged in
 */

function Landing() {
  // Get width of window
  // const { width } = useWindowDimensions();
  // const isMobile = width < 768;

  // Scroll to feature page
  // const scrollTo = () => {
  //   scroller.scrollTo('featurepage', {
  //     smooth: true,
  //     duration: 500,
  //   });
  // };

  // Scroll to top
  // const scrollTop = () => {
  //   window.scrollTo(0, 0);
  // };

  return (
    <div className={styles.container}>
      <Container fluid>
        <Element name="splashpage">
          <div className={styles.splashpage}>
            <div className={styles.coursetable_window}>
              <h1 className={styles.title + ' ' + styles.coursetable_logo}>
                <Logo />
              </h1>
              <p className={styles.description + ' mt-3'}>
                The best place to shop for classes at Yale.
              </p>
              <Col className="mt-5">
                <Row
                  className={styles.btn_container + ' justify-content-center'}
                >
                  {/* Login Button */}
                  <Col md={'auto'} className="p-0 mx-2 mb-2">
                    <Button
                      href="/legacy_api/index.php?forcelogin=1"
                      variant="primary"
                      className={styles.btns}
                      size="lg"
                    >
                      Login with CAS
                    </Button>
                  </Col>
                  {/* About Page Button */}
                  <Col md={'auto'} className="p-0 mx-2 mb-2">
                    <Link to="/about">
                      <Button size="lg" className={styles.btns} variant="dark">
                        About
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </div>
            {/* <div onClick={scrollTo} className={styles.chevron}>
              <BsChevronDoubleDown size={30} />
            </div> */}
          </div>
        </Element>
        {/* <Element name="featurepage">
          <div className={styles.feature_page}>
            <div className={styles.page_separator + ' mx-auto'} />
            <h1 className={styles.whyCourseTable}>Why CourseTable?</h1>
            <Row
              className={styles.feature_row + ' mx-auto justify-content-center'}
            >
              <Col lg={3} className={' mb-3 mx-2 p-0'}>
                <div className={styles.feature + ' mx-auto'}>
                  <p className={styles.feature_header + ' m-0 pt-2'}>
                    Feature 1
                  </p>
                </div>
              </Col>
              <Col lg={3} className={' mb-3 mx-2 p-0'}>
                <div className={styles.feature + ' mx-auto'}>
                  <p className={styles.feature_header + ' m-0 pt-2'}>
                    Feature 2
                  </p>
                </div>
              </Col>
              <Col lg={3} className={' mb-3 mx-2 p-0'}>
                <div className={styles.feature + ' mx-auto'}>
                  <p className={styles.feature_header + ' m-0 pt-2'}>
                    Feature 3
                  </p>
                </div>
              </Col>
            </Row>
            <Row
              className={
                (isMobile
                  ? styles.get_started_row_mobile
                  : styles.get_started_row) + ' mx-auto justify-content-center'
              }
            >
              {/* Catalog Button * /}
              <Link to="/catalog">
                <Button
                  variant="success"
                  size="lg"
                  className={styles.btns}
                  onClick={scrollTop}
                >
                  See Catalog
                </Button>
              </Link>
            </Row>
          </div>
        </Element> */}
      </Container>
    </div>
  );
}

export default Landing;
