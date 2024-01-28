import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, type NavigateFunction } from 'react-router-dom';
import { Form, Button, Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';
import { useApolloClient } from '@apollo/client';
import z from 'zod';

import { FiExternalLink } from 'react-icons/fi';
import { useUser } from '../contexts/userContext';
import styles from './Challenge.module.css';

import ChallengeError from '../images/error.svg';
import {
  TextComponent,
  SurfaceComponent,
} from '../components/StyledComponents';

import { API_ENDPOINT } from '../config';

type Answer = {
  courseRatingId: number;
  courseRatingIndex: number;
  answer: string;
};

const requestResSchema = z.object({
  token: z.string(),
  salt: z.string(),
  courseInfo: z.array(
    z.object({
      courseId: z.number(),
      courseTitle: z.string(),
      courseRatingIndex: z.number(),
      courseOceUrl: z.string(),
    }),
  ),
  challengeTries: z.number(),
  maxChallengeTries: z.number(),
});

type RequestResBody = z.infer<typeof requestResSchema>;

const verifyResSchema = z.object({
  results: z.array(z.boolean()),
  challengeTries: z.number(),
  maxChallengeTries: z.number(),
});

function renderRequestError(requestError: string, navigate: NavigateFunction) {
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

function renderVerifyError(verifyError: string, navigate: NavigateFunction) {
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
  const [resBody, setResBody] = useState<RequestResBody | null>(null);
  // Stores user's answers
  const [answers, setAnswers] = useState<Answer[]>([
    { answer: '', courseRatingId: -1, courseRatingIndex: -1 },
    { answer: '', courseRatingId: -1, courseRatingIndex: -1 },
    { answer: '', courseRatingId: -1, courseRatingIndex: -1 },
  ]);

  // Error code from requesting challenge
  const [requestError, setRequestError] = useState<string | null>(null);
  // Error code from verifying challenge
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  // Number of challenge attempts
  const [numTries, setNumTries] = useState<number | null>(null);
  // Max number of attempts allowed
  const [maxTries, setMaxTries] = useState<number | null>(null);

  // Fetch questions on component mount
  useEffect(() => {
    async function requestChallenge() {
      try {
        const res = await fetch(`${API_ENDPOINT}/api/challenge/request`, {
          credentials: 'include',
        });
        const rawData: unknown = await res.json();
        if (!res.ok) {
          setRequestError(
            (rawData as { error?: string }).error ?? res.statusText,
          );
          return;
        }
        const data = requestResSchema.parse(rawData);
        setResBody(data);
        setNumTries(data.challengeTries);
        setMaxTries(data.maxChallengeTries);
      } catch (err) {
        Sentry.addBreadcrumb({
          category: 'challenge',
          message: 'Requesting challenge',
          level: 'info',
        });
        Sentry.captureException(err);
        toast.error(`Failed to request challenge. ${String(err)}`);
      }
    }
    void requestChallenge();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    // Prevent default page reload
    event.preventDefault();
    if (!form.checkValidity()) {
      // Form is invalid; don't submit
      event.stopPropagation();
      setValidated(true);
      return;
    } else if (!resBody) {
      // No challenge yet
      return;
    }
    // In all other cases: do not show validation results. Currently we can only
    // validate that number fields are filled, but we can't show which answers
    // are correct, and showing checkmarks for everything is confusing.
    // TODO: fix this
    setValidated(false);
    const body = JSON.stringify({
      token: resBody.token,
      salt: resBody.salt,
      answers: answers.map((x) => ({ ...x, answer: Number(x.answer) })),
    });
    try {
      const res = await fetch(`${API_ENDPOINT}/api/challenge/verify`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const rawData: unknown = await res.json();
      if (!res.ok) {
        setVerifyError((rawData as { error?: string }).error ?? res.statusText);
        return;
      }
      const data = verifyResSchema.parse(rawData);
      if (data.results.every((x) => x)) {
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
        setVerificationResults(data.results);
        setNumTries(data.challengeTries);
        setMaxTries(data.maxChallengeTries);
      }
    } catch (err) {
      Sentry.addBreadcrumb({
        category: 'challenge',
        message: `Verifying challenge ${body}`,
        level: 'info',
      });
      Sentry.captureException(err);
      toast.error(`Failed to verify challenge. ${String(err)}`);
    }
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
                  value={answers[index]!.answer}
                  isValid={verificationResults[index]}
                  onChange={(event) => {
                    // Copy answers state into a new variable
                    const newAnswers = [...answers];
                    // Update new answers
                    newAnswers[index]!.courseRatingId = course.courseId;
                    newAnswers[index]!.courseRatingIndex =
                      course.courseRatingIndex;
                    newAnswers[index]!.answer = event.target.value;
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
              className={styles.loadingSpinner}
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
