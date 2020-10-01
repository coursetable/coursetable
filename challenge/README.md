# User challenge

This module provides an API for verifying that a user has access to the Yale course evaluations at OCE (Online Course Evaluations). 

**TODO**:

- Link to mysql database for the following:
  - Require user to be logged in via CAS beforehand
  - Limit number of attempts per user
  - Keep track of enabled users
- Update `crypto.createCipher` and `crypto.createDecipher` (now deprecated) in `utils.js` to `crypto.createCipheriv` and `crypto.createDecipheriv`.

## How it works

To verify that users have access to course evaluations, we ask them to retrieve some rating data from OCE that are then compared with the values in our database. If the responses match, then the user is granted access to CourseTable's data.

### Requesting a challenge

The `/challenge/request` route accepts GET requests and returns a JSON object with challenge questions. This is done as follows:

1. We (semi)-randomly select three course evaluation questions that fall under the category of "What is your overall rating of this course?" and have five response options with counts as well as a mean. This random selection is implemented by choosing a random float between 1 and 5 and selecting questions with a mean response just above this threshold (accomplished by sorting the responses in order of ascending mean rating and limiting the first three).

2. For each question, we randomly choose one of the five response options for the user to go fetch the number of respondents. For ease of access, we auto-generate the OCE URL since it is of the format `https://oce.app.yale.edu/oce-viewer/studentSummary/index?crn=<CRN>&term_code=<SEASON>`.

3. An object containing the question-response bucket combinations along with a salt value is JSON-stringified and encrypted into a token using a secret unknown to the user. This prevents the user from tampering with the questions when submitting their response for verification, which guards against a possible attack in which someone leaks a single set of correct questions that can be used by anyone.

4. The token, salt, and an object containing the title, question, response category, and OCE URL for each token are returned. In particular, this object is of the following structure:

  ```javascript
  {
    token: ...,
    salt: ...,
    course_info: [
      {
      courseTitle: ...,
      courseRatingIndex: ...,
      courseQuestionTexts: ...,
      courseOceUrl: ...,
      },
      ...
    ]
  }
  ```

### Verifying a response

The `/challenge/verify` route accepts POST requests and returns a JSON object specifying whether or not the responses are correct, incorrect, or otherwise malformed. 

This route expects a URL-encoded body containing the following:

- The token and salt previously from `/challenge/request`.

- An answers object of the following structure:

  ```javascript
  [
    { courseRatingId: ..., courseRatingIndex: ..., answer: ... },
  	...
  ]
  ```

  where `courseRatingId` and `courseRatingIndex` are the question ID and response bucket previously given by `/challenge/verify`, and `answer` is the user's response to the number of responses in the given category and question.

With a request body, we perform the following:

1. The token, salt, and answers are extracted from the response body.
2. The token is decrypted and parsed back into a JSON object. If JSON parsing fails, an `INVALID_TOKEN` response is given.
3. The answers (which are sent as a string) are parsed into a JSON object. If JSON parsing fails, an `INVALID_ANSWERS` response is given.
4. The `courseRatingId` and `courseRatingIndex` values from the token and the answer are compared. If these are inconsistent, we assume the token has been tampered with and respond with `INVALID_TOKEN`.
5. If everything has passed so far, we retrieve the response numbers for each question from our database. These are then compared with the values in the provided answers. If these are all correct, then a `CORRECT` response is given; otherwise, an `INCORRECT` response is returned.
