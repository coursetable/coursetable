import React, { useState, useEffect } from 'react';
import qs from 'qs';
import axios from 'axios';
import { useHistory, NavLink } from 'react-router-dom';
import { Form, Button, Row, Spinner } from 'react-bootstrap';
import styles from './Challenge.module.css';
import { toast } from 'react-toastify';

import { FiExternalLink } from 'react-icons/fi';

import ChallengeError from '../images/error.svg';

/**
 * Renders the OCE Challenge page if the user hasn't completed yet
 */

function Challenge() {
  // react-router history to redirect to catalog
  let history = useHistory();
  // Has the form been validated for submission?
  const [validated, setValidated] = useState(false);
  // Stores body of response for the /api/challenge/request API call
  const [res_body, setResBody] = useState(null);
  // Stores user's answers
  const [answers, setAnswers] = useState([
    { answer: '' },
    { answer: '' },
    { answer: '' },
  ]);

  const [requestError, setRequestError] = useState(null);
  const [verifyError, setVerifyError] = useState(null);

  const fetchQuestions = () => {
    axios
      .get('/api/challenge/request')
      .then(res => {
        // Questions not properly fetched
        if (!res.data || !res.data.body) {
          toast.error('Error with /api/challenge/request API call');
        }
        // Successfully fetched questions so update res_body state
        else {
          // console.log(res.data.body);
          setResBody(res.data.body);
        }
      })
      .catch(err => {
        if (err.response.data) {
          setRequestError(err.response.data.error);
        }
      });
  };

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle form submit
  const handleSubmit = event => {
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
        .post('/api/challenge/verify', qs.stringify(post_body), config)
        .then(res => {
          // Answers not properly verified
          if (!res.data || !res.data.body) {
            toast.error('Error with /api/challenge/verify API call');
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
              // setAnswers([{ answer: '' }, { answer: '' }, { answer: '' }]);
              setValidated(false);
              fetchQuestions();
            }
          }
        })
        .catch(err => {
          if (err.response.data) {
            setVerifyError(err.response.data.error);
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
            <strong>
              <a
                href={course.courseOceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {course.courseTitle} <FiExternalLink />
              </a>
            </strong>
          </Row>
          {/* Question with link to OCE Page */}
          <Row className="mx-auto mb-1">
            How many students responded to the&nbsp;
            <span className="font-weight-bold">"overall assessment"</span>{' '}
            question with&nbsp;
            <span className="font-weight-bold">
              "{rating_options[course.courseRatingIndex]}"
            </span>
            ?
          </Row>
          {/* Number Input Box */}
          <Form.Control
            type="number"
            required
            placeholder="Number of students"
            value={answers[index].answer}
            onChange={event => {
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

  const goBack = () => {
    history.goBack();
  };

  if (requestError) {
    let errorTitle;
    let errorMessage;
    if (requestError === 'NOT_AUTHENTICATED') {
      errorTitle = 'Please log in!';
      errorMessage = (
        <div>
          You need to be logged in via CAS to enable your account.
          <br />
          <a
            href="/legacy_api/index.php?forcelogin=1"
            className="btn btn-primary mt-3"
          >
            Log in
          </a>
        </div>
      );
    } else if (requestError === 'USER_NOT_FOUND') {
      errorTitle = 'Account not found!';
      errorMessage = (
        <div>
          Please make sure you are logged in via CAS.
          <br />
          <a
            href="/legacy_api/index.php?forcelogin=1"
            className="btn btn-primary mt-3"
          >
            Log in
          </a>
        </div>
      );
    } else if (requestError === 'ALREADY_ENABLED') {
      errorTitle = "You've already passed!";
      errorMessage = (
        <div>
          You've completed the challenge already - no need to do it again.
          <br />
          <div onClick={goBack} className="btn btn-primary mt-3">
            Go back
          </div>
        </div>
      );
    } else if (requestError === 'MAX_TRIES_REACHED') {
      errorTitle = 'Max attempts reached!';
      errorMessage = (
        <div>
          You've used up all your challenge attempts. Please{' '}
          <NavLink to="/feedback">contact us</NavLink> if you would like to gain
          access.
        </div>
      );
    } else if (requestError === 'RATINGS_RETRIEVAL_ERROR') {
      errorTitle = 'Challenge generation error!';
      errorMessage = (
        <div>
          We couldn't find a challenge. Please{' '}
          <NavLink to="/feedback">let us know</NavLink> what went wrong.
        </div>
      );
    } else {
      errorTitle = 'Internal error!';
      errorMessage = (
        <div>
          Looks like we messed up. Please{' '}
          <NavLink to="/feedback">let us know</NavLink> what went wrong.
        </div>
      );
    }
    return (
      <div className="py-5" style={{ background: '#ffaaa5' }}>
        <div className="bg-white container col-sm-8 col-md-6 col-lg-4 text-center p-5 rounded shadow">
          <img
            alt="No courses found."
            className="w-50 md:w-25 py-5"
            src={ChallengeError}
          ></img>
          <h3>{errorTitle}</h3>
          <div>{errorMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5" style={{ background: '#a8d8ea' }}>
      <div className="bg-white container col-sm-10 col-md-8 col-lg-6 p-5 rounded shadow">
        {/* Page Header */}
        <h1 className={'font-weight-bold mb-2'}>Enable evaluations</h1>
        {/* Page Description */}
        <p className={styles.challenge_description + ' mb-4 text-muted'}>
          To confirm that you're a Yale student with access to course
          evaluations, we ask that you retrieve the number of people who
          responded to a specific question for three courses (linked below). If
          your responses match the values in our database, you'll be good to go!
        </p>
        {verifyError && verifyError}
        {res_body ? (
          // Show form when questions have been fetched
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {question_html}
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        ) : (
          // Loading spinner while fetching questions
          <Row className="m-auto" style={{ height: '45vh' }}>
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
    </div>
  );
}

export default Challenge;
