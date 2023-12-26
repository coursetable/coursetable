import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { useNavigate, NavLink, type NavigateFunction } from 'react-router-dom';
import { Form, Button, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';
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
  courseInfo: {
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
  courseRatingId: number;
  courseRatingIndex: number;
  answer: number;
};

function renderRequestError(requestError: {}, navigate: NavigateFunction) {
  if (requestError === 'USER_NOT_FOUND') {
    return {
      errorTitle: 'Please log in!',
      errorMessage: (
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
      ),
    };
  } else if (requestError === 'ALREADY_ENABLED') {
    return {
      errorTitle: "You've already passed!",
      errorMessage: (
        <div>
          You've completed the challenge already - no need to do it again.
          <br />
          {/* TODO */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div onClick={() => navigate(-1)} className="btn btn-primary mt-3">
            Go back
          </div>
        </div>
      ),
    };
  } else if (requestError === 'MAX_TRIES_REACHED') {
    return {
      errorTitle: 'Max attempts reached!',
      errorMessage: (
        <div>
          You've used up all your challenge attempts. Please{' '}
          <NavLink to="/feedback">contact us</NavLink> if you would like to gain
          access.
        </div>
      ),
    };
  }
  return {
    errorTitle: 'Internal error!',
    errorMessage: (
      <div>
        Looks like we messed up. Please{' '}
        <a
          href="https://feedback.coursetable.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          let us know
        </a>{' '}
        what went wrong. Error: {String(requestError)}
      </div>
    ),
  };
}

function renderVerifyError(verifyError: {}, navigate: NavigateFunction) {
  if (verifyError === 'INCORRECT') {
    return <div>Incorrect responses. Please try again.</div>;
  } else if (verifyError === 'INVALID_REQUEST') {
    return (
      <div>
        Your answers aren't formatted correctly. Please{' '}
        <NavLink to="/feedback">contact us</NavLink> if you think this is an
        error.
      </div>
    );
  }
  return renderRequestError(verifyError, navigate).errorMessage;
}

/**
 * Renders the OCE Challenge page if the user hasn't completed yet
 */

function Challenge() {
  // Apollo client
  const client = useApolloClient();
  // Get user context info and refresh
  const { userRefresh } = useUser();
  const navigate = useNavigate();
  // Has the form been validated for submission?
  const [validated, setValidated] = useState(false);
  // Stores body of response for the /api/challenge/request API call
  const [resBody, setResBody] = useState<ResBody | null>(null);
  // Stores user's answers
  const [answers, setAnswers] = useState<Answer[]>([
    { answer: -1, courseRatingId: -1, courseRatingIndex: -1 },
    { answer: -1, courseRatingId: -1, courseRatingIndex: -1 },
    { answer: -1, courseRatingId: -1, courseRatingIndex: -1 },
  ]);

  // Error code from requesting challenge
  const [requestError, setRequestError] = useState<{} | null>(null);
  // Error code from verifying challenge
  const [verifyError, setVerifyError] = useState<{} | null>(null);

  // Number of challenge attempts
  const [numTries, setNumTries] = useState<number | null>(null);
  // Max number of attempts allowed
  const [maxTries, setMaxTries] = useState<number | null>(null);

  // Fetch questions on component mount
  useEffect(() => {
    async function requestChallenge() {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/challenge/request`, {
          method: 'POST',
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) {
          setRequestError(data.error);
        } else {
          setResBody(data);
          setNumTries(data.challengeTries);
          setMaxTries(data.maxChallengeTries);
        }
      } catch (err) {
        toast.error(`Failed to request challenge. ${String(err)}`);
        Sentry.captureException(err);
      }
    }
    void requestChallenge();
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    const form = event.currentTarget;
    // Prevent default page reload
    event.preventDefault();
    if (!form.checkValidity()) {
      // Form is invalid; don't submit
      event.stopPropagation();
      return;
    } else if (!resBody) {
      // No challenge yet
      return;
    }
    try {
      const res = await fetch(`${API_ENDPOINT}/api/challenge/verify`, {
        body: qs.stringify({
          token: resBody.token,
          salt: resBody.salt,
          answers,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setVerifyError(data.error);
      } else if (data.message === 'CORRECT') {
        try {
          await userRefresh();
          await client.resetStore();
          toast.success(
            "All of your responses were correct! Refresh the page if the courses aren't showing.",
          );
          navigate(-1);
        } catch {
          toast.error('Failed to update evaluation status');
        }
      } else {
        setVerifyError('INCORRECT');
        setValidated(false);
        setNumTries(data.challengeTries);
        setMaxTries(data.maxChallengeTries);
      }
    } catch (err) {
      toast.error(`Failed to verify challenge. ${String(err)}`);
      Sentry.captureException(err);
    }
    // Form has been validated
    setValidated(true);
  };

  // Student response buckets
  const ratingOptions = ['poor', 'fair', 'good', 'very good', 'excellent'];

  // If error in requesting challenge, render error message
  if (requestError) {
    const { errorTitle, errorMessage } = renderRequestError(
      requestError,
      navigate,
    );

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
          <p className="mb-2">
            To confirm that you have access to course evaluations, we ask that
            you retrieve the number of people who responded to a specific
            question for three courses (linked below). If your responses match
            the values in our database, you'll be good to go!
            <br />
            If the challenge is not working for you, please{' '}
            <a
              href="https://feedback.coursetable.com/"
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
          <div className="text-danger mb-2">
            {renderVerifyError(verifyError, navigate)}
          </div>
        )}
        {resBody ? (
          // Show form when questions have been fetched
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {resBody.courseInfo.map((course, index) => (
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
                    "{ratingOptions[course.courseRatingIndex]}"
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
                    const newAnswers = [...answers];
                    // Update new answers
                    newAnswers[index].courseRatingId = course.courseId;
                    newAnswers[index].courseRatingIndex =
                      course.courseRatingIndex;
                    newAnswers[index].answer = parseInt(event.target.value, 10);
                    // Update old answers state with new answers
                    setAnswers(newAnswers);
                  }}
                />
              </Form.Group>
            ))}
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
}

export default Challenge;
