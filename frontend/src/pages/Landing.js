import React from 'react';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { Button, Row, Col } from 'react-bootstrap';
import { Link, Element, animateScroll as scroll, scroller } from 'react-scroll';

import styles from './Landing.module.css';

function App() {
  const scrollTo = () => {
    console.log('scroll');
    scroller.scrollTo('featurepage', {
      smooth: true,
      duration: 500,
    });
  };

  return (
    <div className={styles.container}>
      <Element name="splashpage">
        <div className={styles.splashpage}>
          <div className={styles.coursetable_window}>
            <h1 className={styles.title + ' ' + styles.coursetable_logo}>
              Course<span style={{ color: '#92bcea' }}>Table</span>
            </h1>
            <p className={styles.description}>
              The best place to shop for classes at Yale.
            </p>
            <Col className="mt-4">
              <Row className={styles.btn_container}>
                <Col md={4} className="p-0 mx-2">
                  <Button
                    href="/legacy_api/index.php?forcelogin=1"
                    variant="primary"
                    className={styles.btns}
                    size="lg"
                  >
                    Login
                  </Button>
                </Col>
                <Col md={4} className="p-0 mx-2">
                  <Button
                    size="lg"
                    className={styles.btns}
                    variant="dark"
                    onClick={scrollTo}
                  >
                    Features
                  </Button>
                </Col>
              </Row>
            </Col>
          </div>
          <div onClick={scrollTo} className={styles.chevron}>
            <BsChevronDoubleDown size={30} />
          </div>
        </div>
      </Element>
      <Element name="featurepage">
        <div className={styles.feature_page}>
          <h1 className={styles.whyCourseTable}>Why CourseTable?</h1>
        </div>
      </Element>
    </div>
  );
}

export default App;
