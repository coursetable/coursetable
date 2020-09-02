import React, { useState } from 'react';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import Styles from './Login.module.css';

const App = () => (
  <Row className={Styles.login_background}>
  <Col md={6} lg={4} sm={8} className={`shadow ${Styles.login_outer}`}>
    <Container className="px-4 pt-5 pb-4 text-center">
      <div className={Styles.login_header}>Yale ID required</div>
      <div className={`${Styles.login_description} my-4`}>
        To view this page, please authenticate with Yale CAS.
      </div>
      <Button
        href="/legacy_api/index.php?forcelogin=1"
        variant="primary"
        className="my-3 btn-block"
      >
        Log in on CAS
      </Button>
      <NavLink to="/" className={Styles.go_back}>
        Return home
      </NavLink>
    </Container>
  </Col>
  </Row>
);

export default App;
