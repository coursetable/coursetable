import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import styles from './Join.module.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

function Join() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.join_header + ' mt-5 mb-1'}>Join Us!</h1>
      <p className={styles.join_description + ' mb-3 text-muted'}>
        Join Us Description
      </p>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className={styles.form_group}>
          <Form.Control required type="email" placeholder="Email Address" />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className={styles.form_group}>
          <Select
            isMulti
            components={animatedComponents}
            options={[
              { value: 'frontend', label: 'Front-end Developer' },
              { value: 'backend', label: 'Back-end Developer' },
              { value: 'design', label: 'Designer' },
            ]}
            placeholder={'Role(s) of Interest'}
          />
        </Form.Group>
        <Row className="m-auto">
          <Button variant="primary" type="submit" className="mx-auto">
            Send me updates
          </Button>
        </Row>
      </Form>
    </div>
  );
}

export default Join;
