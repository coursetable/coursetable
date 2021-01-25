import React, { useState } from 'react';
import { Form, Button, Collapse } from 'react-bootstrap';
import styles from './Feedback.module.css';
import './Feedback.css';
import CustomSelect from '../components/CustomSelect';
import { StyledInput, TextComponent } from '../components/StyledComponents';
import styled from 'styled-components';

// Custom radio buttons
const StyledRadio = styled(Form.Check)`
  /* Hide previous button */
  input[type='radio'] {
    opacity: 0;
  }
  /* Default state = grey border and same background as other input components */
  input[type='radio'] + label:after {
    width: 15px;
    height: 15px;
    border-radius: 100%;
    top: 2px;
    left: calc(-100% - 4px);
    position: relative;
    background-color: ${({ theme }) => theme.select};
    content: '';
    display: inline-block;
    visibility: visible;
    border: 3px solid #cccccc;
    transition: background-color 0.2s linear;
  }
  /* Active state = blue border */
  input[type='radio']:checked + label:after {
    border: 3px solid ${({ theme }) => theme.primary} !important;
  }
  /* Hover effect = dark grey border */
  &:hover {
    input[type='radio']:after {
      border: 3px solid #bbbbb;
    }
  }
`;

// Custom switch toggle
const StyledSwitch = styled(Form.Check)`
  /* Default state = grey border and same background as other input components*/
  .custom-control-input ~ .custom-control-label::before {
    border-color: #cccccc;
    background-color: ${({ theme }) => theme.select};
    transition: background-color 0.2s linear;
  }

  /* Enabled state = blue border+background */
  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => theme.primary};
  }
`;

/**
 * Renders the Feedback page
 */

function Feedback() {
  // Formcake submission endpoint
  const submission_endpoint =
    'https://api.formcake.com/api/form/2100a266-5b01-49d8-bec9-0ec2abd4e185/submission';

  // Feedback types and content.
  const feedback_types = ['general', 'feature', 'bug'] as const;
  type FeedbackType = typeof feedback_types[number];
  const descriptions = {
    general:
      'What did you like about your experience on the site? What did you dislike about your experience on the site? Please let us know your honest thoughts and opinions.',
    feature: 'What new features would you like to see implemented in the site?',
    bug: 'Please be specific and include steps to reproduce the bug.',
  };
  const placeholders = {
    general: 'I like/dislike...',
    feature: 'I wish...',
    bug: 'When I was...',
  };
  const radio_labels = {
    general: 'General',
    feature: 'Feature Request',
    bug: 'Bug Report',
  };

  // Has the form been validated for submission?
  const [validated, setValidated] = useState(false);
  // Feedback type
  const [type, setType] = useState<FeedbackType>('general');

  // Handle form submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    // Don't submit if form is invalid
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Form has been validated
    setValidated(true);
  };

  // Handle type select
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.currentTarget.value as FeedbackType);
  };

  return (
    <div className={`${styles.container} mx-auto`}>
      <h1 className={`${styles.feedback_header} mt-5 mb-1`}>Feedback Form</h1>
      <p className={`${styles.feedback_description} mb-3`}>
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
          <br />
          {(['general', 'feature', 'bug'] as const).map((feedback_type) => (
            <StyledRadio
              className={styles.hover_pointer}
              name="feedback_type"
              type="radio"
              inline
              value={feedback_type}
              id={feedback_type}
              checked={type === feedback_type}
              onClick={handleSelect}
              label={radio_labels[feedback_type]}
            />
          ))}
        </Form.Group>
        {/* Hide if not submitting a bug report */}
        <Collapse in={type === 'bug'}>
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
            Feedback Description
            <span style={{ color: '#ff5e5e' }}>{' *'}</span>
            <br />
            <span className={styles.form_secondary_label}>
              {descriptions[type]}
            </span>
          </Form.Label>
          <StyledInput
            required
            as="textarea"
            name="description"
            rows={4}
            placeholder={placeholders[type]}
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
        {/* Follow up permission switch */}
        <Form.Group className={styles.form_group}>
          <StyledSwitch
            className={styles.hover_pointer}
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
