import React from 'react';
// import { BsChevronDoubleDown } from 'react-icons/bs';
import { Row, Col, Container } from 'react-bootstrap';
import { Element } from 'react-scroll';
import { Link } from 'react-router-dom';

// import Logo from '../components/Logo';
import styles from './Landing.module.css';
import {
  FcConferenceCall,
  FcComboChart,
  FcBookmark,
  FcSearch,
} from 'react-icons/fc';
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
          <div className={styles.splashpage + ' mx-auto'}>
            <Row className="mx-auto" style={{ height: '100%' }}>
              <Col lg={6} className="d-flex">
                <div className="m-auto">
                  <h1 className="font-weight-bold text-lg-left mb-4">
                    The best place to shop for classes at Yale.
                  </h1>
                  <Row className={'pb-2 m-auto'}>
                    <span className={styles.feature_text + ' d-inline'}>
                      <FcSearch className="mr-2 my-auto" size={20} />
                      Browse our catalog of{' '}
                      <span style={{ color: '#007bff' }}>20,000+</span> classes
                    </span>
                  </Row>
                  <Row className={'pb-2 m-auto'}>
                    <span className={styles.feature_text}>
                      <FcComboChart className="mr-2 my-auto" size={20} />
                      Read from{' '}
                      <span style={{ color: '#007bff' }}>30,000+</span> student
                      evaluation comments
                    </span>
                  </Row>
                  <Row className={'pb-2 m-auto'}>
                    <span className={styles.feature_text}>
                      <FcBookmark className="mr-2 my-auto" size={20} />
                      Save and view classes in your worksheet
                    </span>
                  </Row>
                  <Row className={'m-auto'}>
                    <span className={styles.feature_text}>
                      <FcConferenceCall className="mr-2 my-auto" size={20} />
                      See what classes your friends are interested in
                    </span>
                  </Row>
                  <Row className="mx-auto mt-4 justify-content-lg-start justify-content-center">
                    <a
                      href="/legacy_api/index.php?forcelogin=1"
                      className={styles.btn + ' ' + styles.login + ' mr-2'}
                    >
                      Login with CAS
                    </a>
                    <Link
                      to="/about"
                      className={styles.btn + ' ' + styles.about}
                    >
                      About Us
                    </Link>
                  </Row>
                </div>
              </Col>
              <Col lg={6} className="d-flex">
                <div className="m-auto font-weight-bold">
                  WHAT GOES HERE ?????
                </div>
              </Col>
            </Row>
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
