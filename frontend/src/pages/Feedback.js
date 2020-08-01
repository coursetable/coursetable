import React, { useState } from 'react';
import { Row, Col, Form, Button, Collapse } from 'react-bootstrap';
import styles from './Feedback.module.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './Feedback.css';

const animatedComponents = makeAnimated();

function Feedback() {
  const [validated, setValidated] = useState(false);
  const [isBug, setIsBug] = useState(true);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  console.log(isBug);

  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.feedback_header + ' mt-5 mb-1'}>Feedback Form</h1>
      <p className={styles.feedback_description + ' mb-3 text-muted'}>
        Feedback Form Description
      </p>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className={styles.form_group}>
          <Form.Label className={styles.form_label}>
            Feedback Type<span style={{ color: '#ff5e5e' }}>{' *'}</span>
          </Form.Label>
          <Select
            defaultValue={{ value: 'bug', label: 'Bug Report' }}
            options={[
              { value: 'bug', label: 'Bug Report' },
              { value: 'feature', label: 'Feature Request' },
              { value: 'other', label: 'Other Comments for the Team' },
            ]}
            onChange={(option) => setIsBug(option.value === 'bug')}
          />
        </Form.Group>

        <Collapse in={isBug}>
          <div>
            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Course(s) Involved?
                <span className="text-muted">{' (Include Season)'}</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. CPSC 323 Spring, 2020"
              />
            </Form.Group>

            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Page(s) Involved?
              </Form.Label>
              <Select
                isMulti
                components={animatedComponents}
                options={[
                  { value: 'login', label: 'Login' },
                  { value: 'home', label: 'Home' },
                  { value: 'catalog', label: 'Catalog' },
                  { value: 'worksheet', label: 'Worksheet' },
                  { value: 'about', label: 'About' },
                  { value: 'faq', label: 'FAQ' },
                  { value: 'changelog', label: 'Changelog' },
                  { value: 'feedback', label: 'Feedback' },
                  { value: 'join', label: 'Join Us' },
                  { value: 'other', label: 'Other (Describe Below)' },
                ]}
              />
            </Form.Group>

            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Browser/System(s) Involved?
              </Form.Label>
              <Select
                isMulti
                components={animatedComponents}
                options={[
                  { value: 'chrome', label: 'Chrome' },
                  { value: 'safari', label: 'Safari' },
                  { value: 'firefox', label: 'Firefox' },
                  { value: 'opera', label: 'Opera' },
                  { value: 'ie', label: 'Internet Explorer/Microsoft Edge' },
                  { value: 'mac', label: 'MacOS' },
                  { value: 'idevice', label: 'iPhone/iPad' },
                  { value: 'windows', label: 'Windows' },
                  { value: 'linux', label: 'Linux' },
                  { value: 'android', label: 'Android phone/tablet' },
                  { value: 'other', label: 'Other (Describe Below)' },
                ]}
              />
            </Form.Group>

            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Your Email Address
                <br />
                <span className={styles.form_secondary_label}>
                  We may contact you if further details are required
                </span>
              </Form.Label>
              <Form.Control type="email" placeholder="name@yale.edu" />
            </Form.Group>
          </div>
        </Collapse>

        <Form.Group className={styles.form_group}>
          <Form.Label className={styles.form_label}>
            Feedback/Bug Description
            <span style={{ color: '#ff5e5e' }}>{' *'}</span>
            <br />
            <span className={styles.form_secondary_label}>
              If you are filing a bug report, please be specific and include
              steps to reproduce the bug
            </span>
          </Form.Label>
          <Form.Control
            required
            as="textarea"
            rows="4"
            placeholder="What's Up?"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a description
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="info" type="submit">
          Submit Form
        </Button>
      </Form>
    </div>
  );
}

export default Feedback;
