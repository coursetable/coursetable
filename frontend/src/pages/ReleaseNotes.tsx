import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './ReleaseNotes.module.css';

const ReleaseNotes: React.FC = () => (
    <Container className={styles.releaseNotesContainer}>
      <Row>
        <Col>
          <h1 className={styles.releaseNotesHeader}>Release Notes</h1>
          <ul>
            <li>
              <Link to="/releases/fall23" className={styles.releaseLink}>
                Fall 2023 Release
              </Link>
            </li>
            <li>
              <Link to="/releases/quist" className={styles.releaseLink}>
                Quist Release
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );

export default ReleaseNotes;
