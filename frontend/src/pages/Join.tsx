import React, { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import styles from './Join.module.css';
import CustomSelect from '../components/CustomSelect';
import { StyledInput, TextComponent } from '../components/StyledComponents';

/**
 * Renders the Join Us page
 */

function Join() {
  // Has form been validated?
  const [validated, setValidated] = useState(false);
  // Handle form submission
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

  // Formcake submission endpoint
  const submission_endpoint =
    'https://api.formcake.com/api/form/76c03c68-682d-4402-8237-36c105de4aa6/submission';
  return (
    <div className={`${styles.container} mx-auto`}>
      <h1 className={`${styles.join_header} mt-5 mb-1`}>Join Us!</h1>
      <p className={`${styles.join_description} mb-3`}>
        <TextComponent type={1}>We'll be in touch.</TextComponent>
      </p>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        method="POST"
        action={submission_endpoint}
      >
        {/* Email */}
        <Form.Group>
          <StyledInput
            required
            name="email"
            type="email"
            placeholder="Email Address"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address
          </Form.Control.Feedback>
        </Form.Group>
        {/* Role Select */}
        <Form.Group>
          <CustomSelect
            // @ts-ignore
            isMulti
            name="roles[]"
            options={[
              { value: 'Frontend', label: 'Front-end Developer' },
              { value: 'Backend', label: 'Back-end Developer' },
              { value: 'Design', label: 'Designer' },
              { value: 'Other', label: 'Other' },
            ]}
            placeholder="Role(s) of Interest"
          />
        </Form.Group>
        {/* Submit Button */}
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
