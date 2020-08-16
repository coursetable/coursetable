import React, { useState } from 'react';
import { Form, Button, Collapse } from 'react-bootstrap';
import styles from './Feedback.module.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './Feedback.css';

const animatedComponents = makeAnimated();

function Feedback() {
  const [validated, setValidated] = useState(false);
  const [isBug, setIsBug] = useState(true);
  const submission_endpoint =
    'https://api.formcake.com/api/form/aaa0fe2f-df06-457d-8510-ef386265d48d/submission';

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
      <h1 className={styles.feedback_header + ' mt-5 mb-1'}>Feedback Form</h1>
      <p className={styles.feedback_description + ' mb-3 text-muted'}>
        Feedback Form Description
      </p>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        method="POST"
        action={submission_endpoint}
      >
        <Form.Group className={styles.form_group}>
          <Form.Label className={styles.form_label}>
            Feedback Type<span style={{ color: '#ff5e5e' }}>{' *'}</span>
          </Form.Label>
          <Select
            defaultValue={{ value: 'bug report', label: 'Bug Report' }}
            options={[
              { value: 'Bug Report', label: 'Bug Report' },
              { value: 'Feature Request', label: 'Feature Request' },
              { value: 'Other', label: 'Other Comments for the Team' },
            ]}
            onChange={(option) => setIsBug(option.value === 'Bug Report')}
            name="feedback_type"
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
                name="course"
                placeholder="e.g. CPSC 323 Spring, 2020"
              />
            </Form.Group>

            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Page(s) Involved?
              </Form.Label>
              <Select
                isMulti
                name="page[]"
                components={animatedComponents}
                options={[
                  { value: 'Login', label: 'Login' },
                  { value: 'Home', label: 'Home' },
                  { value: 'Catalog', label: 'Catalog' },
                  { value: 'Worksheet', label: 'Worksheet' },
                  { value: 'About', label: 'About' },
                  { value: 'Faq', label: 'FAQ' },
                  { value: 'Changelog', label: 'Changelog' },
                  { value: 'Feedback', label: 'Feedback' },
                  { value: 'Join', label: 'Join Us' },
                  { value: 'Other', label: 'Other (Describe Below)' },
                ]}
              />
            </Form.Group>

            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Browser/System(s) Involved?
              </Form.Label>
              <Select
                isMulti
                name="system[]"
                components={animatedComponents}
                options={[
                  { value: 'Chrome', label: 'Chrome' },
                  { value: 'Safari', label: 'Safari' },
                  {
                    value: 'IE/Edge',
                    label: 'Internet Explorer/Microsoft Edge',
                  },
                  { value: 'Firefox', label: 'Firefox' },
                  { value: 'Mac', label: 'MacOS' },
                  { value: 'iPhone/iPad', label: 'iPhone/iPad' },
                  { value: 'Windows', label: 'Windows' },
                  { value: 'Linux', label: 'Linux' },
                  { value: 'Android', label: 'Android phone/tablet' },
                  { value: 'Other', label: 'Other (Describe Below)' },
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
              <Form.Control
                type="email"
                name="email"
                placeholder="name@yale.edu"
              />
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
            name="description"
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
