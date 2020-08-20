import React, { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import styles from './Join.module.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import {
  selectStyles,
} from '../queries/Constants';

const animatedComponents = makeAnimated();

function Join() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const submission_endpoint =
    'https://api.formcake.com/api/form/76c03c68-682d-4402-8237-36c105de4aa6/submission';
  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.join_header + ' mt-5 mb-1'}>Join Us!</h1>
      <p className={styles.join_description + ' mb-3 text-muted'}>
        We'll be in touch.
      </p>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        method="POST"
        action={submission_endpoint}
      >
        <Form.Group className={styles.form_group}>
          <Form.Control
            required
            name="email"
            type="email"
            placeholder="Email Address"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className={styles.form_group}>
          <Select
            isMulti
            name="roles[]"
            components={animatedComponents}
            styles={selectStyles}
            options={[
              { value: 'Frontend', label: 'Front-end Developer' },
              { value: 'Backend', label: 'Back-end Developer' },
              { value: 'Design', label: 'Designer' },
              { value: 'Other', label: 'Other' },
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
