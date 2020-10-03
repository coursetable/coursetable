import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { Form, Button, Row, Spinner } from 'react-bootstrap';
import styles from './Challenge.module.css';
import { toast } from 'react-toastify';

/**
 * Renders the OCE Challenge page if the user hasn't completed yet
 */

function Challenge() {
  // react-router history to redirect to catalog
  let history = useHistory();
  // Has the form been validated for submission?
  const [validated, setValidated] = useState(false);
  // Stores body of response for the /challenge/request API call
  const [res_body, setResBody] = useState(null);
  // Stores user's answers
  const [answers, setAnswers] = useState([
    { answer: '' },
    { answer: '' },
    { answer: '' },
  ]);

  const fetchQuestions = () => {
    axios.get('/challenge/request').then((res) => {
      // Questions not properly fetched
      if (!res.data || !res.data.body) {
        toast.error('Error with /challenge/request API call');
      }
      // Successfully fetched questions so update res_body state
      else {
        // console.log(res.data.body);
        setResBody(res.data.body);
      }
    });
  };

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle form submit
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    // Prevent default page reload
    event.preventDefault();
    // Form is invalid
    if (form.checkValidity() === false) {
      // Don't submit
      event.stopPropagation();
    }
    // Form is valid
    else {
      // Body data to be passed in post request
      const post_body = {
        token: res_body.token,
        salt: res_body.salt,
        answers: answers,
      };
      // Config header for urlencoded
      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      };
      // Verify answers
      axios
        .post('/challenge/verify', qs.stringify(post_body), config)
        .then((res) => {
          // Answers not properly verified
          if (!res.data || !res.data.body) {
            toast.error('Error with /challenge/verify API call');
          } else {
            // Correct responses
            if (res.data.body === 'CORRECT') {
              toast.success('All of your responses were correct!');
              history.push('/catalog');
            }
            // Incorrect responses
            else {
              toast.error('Incorrect responses. Try again.');
              // Reset questions and form
              setAnswers([{ answer: '' }, { answer: '' }, { answer: '' }]);
              setValidated(false);
              fetchQuestions();
            }
          }
        });
    }
    // Form has been validated
    setValidated(true);
  };

  // Student response buckets
  const rating_options = ['poor', 'fair', 'good', 'very good', 'excellent'];
  // Holds the html for each form question
  let question_html = [];
  if (res_body && res_body.course_info) {
    // Loop over each question
    res_body.course_info.forEach((course, index) => {
      // Add question html to list
      question_html.push(
        <Form.Group controlId={`question#${index + 1}`} key={index}>
          {/* Course Title */}
          <Row className="mx-auto">
            <strong>{course.courseTitle}</strong>
          </Row>
          {/* Question with link to OCE Page */}
          <Row className="mx-auto mb-1">
            <small>
              <a
                href={course.courseOceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                How many students responded to the{' '}
                <span className="font-weight-bold">overall assessment</span>{' '}
                question with
                <span className="font-weight-bold">
                  {' "' + rating_options[course.courseRatingIndex]}"
                </span>
                ?
              </a>
            </small>
          </Row>
          {/* Number Input Box */}
          <Form.Control
            type="number"
            required
            placeholder="Enter rating"
            value={answers[index].answer}
            onChange={(event) => {
              // Copy answers state into a new variable
              let new_answers = [...answers];
              // Update new answers
              new_answers[index].courseRatingId = course.courseId;
              new_answers[index].courseRatingIndex = course.courseRatingIndex;
              new_answers[index].answer = event.target.value;
              // Update old answers state with new answers
              setAnswers(new_answers);
            }}
          />
        </Form.Group>
      );
    });
  }

  return (
    <div className={styles.container + ' mx-auto'}>
      {/* Page Header */}
      <h1 className={styles.challenge_header + ' mt-5 mb-1'}>
        Looks like this is your first time signing in
      </h1>
      {/* Page Description */}
      <p className={styles.challenge_description + ' mb-4 text-muted'}>
        Please complete the following challenge to confirm you have access to
        Yale OCE
      </p>
      {res_body ? (
        // Show form when questions have been fetched
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {question_html}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      ) : (
        // Loading spinner while fetching questions
        <Row className="m-auto" style={{ height: '55vh' }}>
          <Spinner
            className={styles.loading_spinner}
            animation="border"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Row>
      )}
    </div>
  );
}

export default Challenge;
