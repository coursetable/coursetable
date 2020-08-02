import React from 'react';
import { Row, Col } from 'react-bootstrap';
import styles from './Changelog.module.css';
import { FcPlus, FcIdea } from 'react-icons/fc';
import { FaWrench } from 'react-icons/fa';

function Changelog() {
  const filler_text =
    'This is some filler text for a list item on ' +
    'this changelog page that takes up multiple lines and enlarges ' +
    'when hovered over cuz y not';
  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.changelog_header + ' mt-5 mb-2'}>Changelog</h1>
      <h1 className={styles.date_header + ' text-muted mb-3'}>
        August 1, 2020
      </h1>
      <Row className="mx-auto my-2">
        <h1 className={styles.col_header}>Bug Fixes</h1>
        <Col md={12} className="pl-3">
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.bug_fix_bullet_point + ' p-0 mb-auto'}
            >
              <FaWrench color="#00a7ff" size={15} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>
                Bug fixed on just one line!
              </p>
            </Col>
          </Row>
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.bug_fix_bullet_point + ' p-0 mb-auto'}
            >
              <FaWrench color="#00a7ff" size={15} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>{filler_text}</p>
            </Col>
          </Row>
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.bug_fix_bullet_point + ' p-0 mb-auto'}
            >
              <FaWrench color="#00a7ff" size={15} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>{filler_text}</p>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mx-auto my-2">
        <h1 className={styles.col_header}>New Features</h1>
        <Col md={12} className="pl-3">
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.new_feature_bullet_point + ' p-0 mb-auto'}
            >
              <FcPlus className={styles.plus_icon} size={16} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>
                New Feature on just one line!
              </p>
            </Col>
          </Row>
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.new_feature_bullet_point + ' p-0 mb-auto'}
            >
              <FcPlus color="blue !important" size={16} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>{filler_text}</p>
            </Col>
          </Row>
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.new_feature_bullet_point + ' p-0 mb-auto'}
            >
              <FcPlus color="blue" size={16} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>{filler_text}</p>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mx-auto my-2">
        <h1 className={styles.col_header}>Coming Soon</h1>
        <Col md={12} className="pl-3">
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.coming_soon_bullet_point + ' p-0 mb-auto'}
            >
              <FcIdea size={16} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>
                Coming soon feature on just one line!
              </p>
            </Col>
          </Row>
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.coming_soon_bullet_point + ' p-0 mb-auto'}
            >
              <FcIdea size={16} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>{filler_text}</p>
            </Col>
          </Row>
          <Row className={styles.list_item + ' mx-auto my-2'}>
            <Col
              xs="auto"
              className={styles.coming_soon_bullet_point + ' p-0 mb-auto'}
            >
              <FcIdea size={16} />
            </Col>
            <Col className="pl-3">
              <p className={styles.list_item_text + ' my-0'}>{filler_text}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Changelog;
