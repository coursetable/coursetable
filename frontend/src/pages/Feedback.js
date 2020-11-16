import React, { useState } from 'react';
import { Form, Button, Collapse } from 'react-bootstrap';
import styles from './Feedback.module.css';
import './Feedback.css';
import CustomSelect from '../components/CustomSelect';
import { StyledInput, TextComponent } from '../components/StyledComponents';

/**
 * Renders the Feedback page
 */

function Feedback() {
  // Has the form been validated for submission?
  const [validated, setValidated] = useState(false);
  // Is the user inputting a bug report?
  const [isBug, setIsBug] = useState(true);
  // Formcake submission endpoint
  const submission_endpoint =
    'https://api.formcake.com/api/form/2100a266-5b01-49d8-bec9-0ec2abd4e185/submission';

  // Handle form submit
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    // Don't submit if form is invalid
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Form has been validated
    setValidated(true);
  };

  return (
    <div className={styles.container + ' mx-auto'}>
      <h1 className={styles.feedback_header + ' mt-5 mb-1'}>Feedback Form</h1>
      <p className={styles.feedback_description + ' mb-3'}>
        <TextComponent type={1}>Let us know what you think!</TextComponent>
      </p>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        method="POST"
        action={submission_endpoint}
      >
        {/* Feedback Type */}
        <Form.Group className={styles.form_group}>
          <Form.Label className={styles.form_label}>
            Feedback Type<span style={{ color: '#ff5e5e' }}>{' *'}</span>
          </Form.Label>
          <CustomSelect
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
        {/* Hide if not submitting a bug report */}
        <Collapse in={isBug}>
          <div>
            {/* Courses Involved */}
            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Course(s) Involved?
                <TextComponent type={1}>{' (Include season)'}</TextComponent>
              </Form.Label>
              <StyledInput
                type="text"
                name="course"
                placeholder="e.g. CPSC 323, Spring 2020"
              />
            </Form.Group>
            {/* Pages involved */}
            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Page(s) Involved?
              </Form.Label>
              <CustomSelect
                isMulti
                name="page[]"
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
            {/* Browser/System(s) Involved */}
            <Form.Group className={styles.form_group}>
              <Form.Label className={styles.form_label}>
                Browser/System(s) Involved?
              </Form.Label>
              <CustomSelect
                isMulti
                name="system[]"
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
          </div>
        </Collapse>
        {/* Description */}
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
          <StyledInput
            required
            as="textarea"
            name="description"
            rows="4"
            placeholder="What's up?"
            style={{ width: '100%' }}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a description
          </Form.Control.Feedback>
        </Form.Group>
        {/* Email */}
        <Form.Group className={styles.form_group}>
          <Form.Label className={styles.form_label}>
            Your Email Address
            <span style={{ color: '#ff5e5e' }}>{' *'}</span>
            <br />
            <span className={styles.form_secondary_label}>
              We may contact you if further details are required and we have
              your permission
            </span>
          </Form.Label>
          <StyledInput
            required
            type="email"
            name="email"
            placeholder="name@yale.edu"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address
          </Form.Control.Feedback>
        </Form.Group>
        {/* Follow up permission checkbox */}
        <Form.Group className={styles.form_group}>
          <Form.Check
            type="switch"
            id="permission"
            name="permission"
            label="Permission to follow up with me about my feedback"
          />
        </Form.Group>
        {/* Submit Button */}
        <Button variant="info" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Feedback;
