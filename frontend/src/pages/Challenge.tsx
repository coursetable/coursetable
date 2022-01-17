import React, { useState, useEffect, ReactElement } from 'react';
import qs from 'qs';
import axios from 'axios';
import { useHistory, NavLink } from 'react-router-dom';
import { Form, Button, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useApolloClient } from '@apollo/client';

import { FiExternalLink } from 'react-icons/fi';
import { useUser } from '../contexts/userContext';
import styles from './Challenge.module.css';

import ChallengeError from '../images/error.svg';
import {
  TextComponent,
  SurfaceComponent,
} from '../components/StyledComponents';

import { API_ENDPOINT } from '../config';

type ResBody = {
  token: string;
  salt: string;
  course_info: {
    courseId: number;
    courseTitle: string;
    courseRatingIndex: number;
    courseQuestionTexts: string;
    courseOceUrl: string;
  }[];
  challengeTries: number;
  maxChallengeTries: number;
};

type Answer = {
  courseRatingId: number | undefined;
  courseRatingIndex: number | undefined;
  answer: string;
};

/**
 * Renders the OCE Challenge page if the user hasn't completed yet
 */

const Challenge: React.VFC = () => {
  // Apollo client
  const client = useApolloClient();
  // Get user context info and refresh
  const { userRefresh } = useUser();
  // react-router history to redirect to catalog
  const history = useHistory();
  // Has the form been validated for submission?
  const [validated, setValidated] = useState(false);
  // Stores body of response for the /api/challenge/request API call
  const [res_body, setResBody] = useState<ResBody | null>(null);
  // Stores user's answers
  const [answers, setAnswers] = useState<Answer[]>([
    { answer: '', courseRatingId: undefined, courseRatingIndex: undefined },
    { answer: '', courseRatingId: undefined, courseRatingIndex: undefined },
    { answer: '', courseRatingId: undefined, courseRatingIndex: undefined },
  ]);

  // error code from requesting challenge
  const [requestError, setRequestError] = useState(null);
  // error code from verifying challenge
  const [verifyError, setVerifyError] = useState<string | null>(null);
  // error message to render after verification (if applicable)
  const [verifyErrorMessage, setVerifyErrorMessage] =
    useState<ReactElement | null>(null);

  // number of challenge attempts
  const [numTries, setNumTries] = useState(null);
  // max number of attempts allowed
  const [maxTries, setMaxTries] = useState(null);

  // get the challenge questions
  const fetchQuestions = () => {
    axios
      .get(`${API_ENDPOINT}/api/challenge/request`, { withCredentials: true })
      .then((res) => {
        // Questions not properly fetched
        if (!res.data || !res.data.body) {
          toast.error('Error with /api/challenge/request API call');
        }
        // Successfully fetched questions so update body and set max tries
        else {
          setResBody(res.data.body);
          setNumTries(res.data.body.challengeTries);
          setMaxTries(res.data.body.maxChallengeTries);
        }
      })
      .catch((err) => {
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
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    const form = event.currentTarget;
    // Prevent default page reload
    event.preventDefault();
    // Form is invalid
    if (form.checkValidity() === false) {
      // Don't submit
      event.stopPropagation();
    }
    // Form is valid
    else if (res_body != null) {
      // Body data to be passed in post request
      const post_body = {
        token: res_body.token,
        salt: res_body.salt,
        answers,
      };
      // Config header for urlencoded
      const config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        withCredentials: true,
      };
      // Verify answers
      axios
        .post(
          `${API_ENDPOINT}/api/challenge/verify`,
          qs.stringify(post_body),
          config
        )
        .then((res) => {
          // Answers not properly verified
          if (!res.data || !res.data.body) {
            toast.error('Error with /api/challenge/verify API call');
          }
          // Correct responses
          else if (res.data.body.message === 'CORRECT') {
            userRefresh()
              .then(() => {
                return client.resetStore();
              })
              .then(() => {
                toast.success('All of your responses were correct!');
                history.goBack();
              })
              .catch((err) => {
                toast.error('Failed to update evaluation status');
                // console.error(err);
              });
          }
          // Incorrect responses
          else {
            toast.error('Incorrect responses. Please try again.');

            setVerifyError('INCORRECT');

            setVerifyErrorMessage(
              <div>Incorrect responses. Please try again.</div>
            );

            setValidated(false);
            setNumTries(res.data.body.challengeTries);
            setMaxTries(res.data.body.maxChallengeTries);
          }
        })
        .catch((err) => {
          if (err.response.data) {
            const { error } = err.response.data;

            setVerifyError(error);

            // Max attempts reached
            if (error === 'MAX_TRIES_REACHED') {
              setVerifyErrorMessage(
                <div>
                  You've used up all your challenge attempts. Please{' '}
                  <NavLink to="/feedback">contact us</NavLink> if you would like
                  to gain access.
                </div>
              );
            }
            // Bad token
            else if (error === 'INVALID_TOKEN') {
              setVerifyErrorMessage(
                <div>
                  Your answers aren't formatted correctly. Please{' '}
                  <NavLink to="/feedback">contact us</NavLink> if you think this
                  is an error.
                </div>
              );
            }
            // Bad answers
            else if (error === 'MALFORMED_ANSWERS') {
              setVerifyErrorMessage(
                <div>
                  Your answers aren't formatted correctly. Please{' '}
                  <NavLink to="/feedback">contact us</NavLink> if you think this
                  is an error.
                </div>
              );
            }
            // Other errors
            else {
              setVerifyErrorMessage(
                <div>
                  Looks like we messed up. Please{' '}
                  <a
                    href={`${API_ENDPOINT}/api/canny/board`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    let us know
                  </a>{' '}
                  what went wrong.
                </div>
              );
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
  const question_html: ReactElement[] = [];
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
                {course.courseTitle}{' '}
                <FiExternalLink
                  // Better spacing for the link icon
                  className="mb-1"
                />
              </a>
            </strong>
          </Row>
          {/* Question with link to OCE Page */}
          <Row className="mx-auto mb-1">
            How many students responded to the&nbsp;
            <span className="font-weight-bold">"overall assessment"</span>
            &nbsp;question with&nbsp;
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
            onChange={(event) => {
              // Copy answers state into a new variable
              const new_answers = [...answers];
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

  // If error in requesting challenge, render error message
  if (requestError) {
    let errorTitle;
    let errorMessage;

    // If user is not logged in
    if (requestError === 'NOT_AUTHENTICATED') {
      errorTitle = 'Please log in!';
      errorMessage = (
        <div>
          You need to be logged in via CAS to enable your account.
          <br />
          <a
            href="/api/auth/cas?redirect=catalog"
            className="btn btn-primary mt-3"
          >
            Log in
          </a>
        </div>
      );
    }
    // If user is not in database
    else if (requestError === 'USER_NOT_FOUND') {
      errorTitle = 'Account not found!';
      errorMessage = (
        <div>
          Please make sure you are logged in via CAS.
          <br />
          <a
            href="/api/auth/cas?redirect=catalog"
            className="btn btn-primary mt-3"
          >
            Log in
          </a>
        </div>
      );
    }
    // Evaluations already enabled
    else if (requestError === 'ALREADY_ENABLED') {
      errorTitle = "You've already passed!";
      errorMessage = (
        <div>
          You've completed the challenge already - no need to do it again.
          <br />
          <div
            onClick={() => {
              history.goBack();
            }}
            className="btn btn-primary mt-3"
          >
            Go back
          </div>
        </div>
      );
    }
    // Maximum attempts
    else if (requestError === 'MAX_TRIES_REACHED') {
      errorTitle = 'Max attempts reached!';
      errorMessage = (
        <div>
          You've used up all your challenge attempts. Please{' '}
          <NavLink to="/feedback">contact us</NavLink> if you would like to gain
          access.
        </div>
      );
    }
    // Cannot get properly formed ratings
    else if (requestError === 'RATINGS_RETRIEVAL_ERROR') {
      errorTitle = 'Challenge generation error!';
      errorMessage = (
        <div>
          We couldn't find a challenge. Please{' '}
          <a
            href={`${API_ENDPOINT}/api/canny/board`}
            target="_blank"
            rel="noopener noreferrer"
          >
            let us know
          </a>{' '}
          what went wrong.
        </div>
      );
    }
    // Other errors
    else {
      errorTitle = 'Internal error!';
      errorMessage = (
        <div>
          Looks like we messed up. Please{' '}
          <a
            href={`${API_ENDPOINT}/api/canny/board`}
            target="_blank"
            rel="noopener noreferrer"
          >
            let us know
          </a>{' '}
          what went wrong.
        </div>
      );
    }
    return (
      <div
        className="py-5"
        style={{ backgroundColor: 'rgba(255, 170, 165, 0.5)' }}
      >
        <SurfaceComponent
          layer={0}
          className="container col-sm-8 col-md-6 col-lg-4 text-center p-5 rounded shadow"
        >
          <img
            alt="No courses found."
            className="w-50 md:w-25 py-5"
            src={ChallengeError}
          />
          <h3>{errorTitle}</h3>
          <div>{errorMessage}</div>
        </SurfaceComponent>
      </div>
    );
  }

  return (
    <div
      className="py-5"
      style={{ backgroundColor: 'rgba(168, 216, 234, 0.5)' }}
    >
      <SurfaceComponent
        layer={0}
        className="container col-sm-10 col-md-8 col-lg-6 p-5 rounded shadow"
      >
        {/* Page Header */}
        <h1 className="font-weight-bold mb-2">Enable evaluations</h1>
        {/* Page Description */}
        <TextComponent type={1}>
          <p className={`${styles.challenge_description} mb-2`}>
            To confirm that you have access to course evaluations, we ask that
            you retrieve the number of people who responded to a specific
            question for three courses (linked below). If your responses match
            the values in our database, you'll be good to go!
            <br />
            If the challenge is not working for you, please{' '}
            <a
              href={`${API_ENDPOINT}/api/canny/board`}
              target="_blank"
              rel="noopener noreferrer"
            >
              let us know
            </a>{' '}
            and we can grant you access manually.
          </p>
        </TextComponent>
        {/* Track number of attempts */}
        {numTries !== null && (
          <div className="mb-2">
            <span className="font-weight-bold mb-6">
              {numTries}/{maxTries}
            </span>{' '}
            {numTries === 1 ? 'attempt' : 'attempts'} used
          </div>
        )}
        {/* Error messages from verification */}
        {verifyError && (
          <div className="text-danger mb-2">{verifyErrorMessage}</div>
        )}
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
          <Row className="mx-auto py-5 my-5">
            <Spinner
              className={styles.loading_spinner}
              animation="border"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Row>
        )}
      </SurfaceComponent>
    </div>
  );
};

export default Challenge;
