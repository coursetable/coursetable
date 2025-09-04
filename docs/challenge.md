# Challenge

This doc describes how our challenge mechanism is implemented.

## How it works

To verify that users have access to course evaluations, we ask them to retrieve rating data from OCE that are then compared with the values in our database. If the responses match, then the user is granted access to CourseTable's evaluations-related data.

Note that the challenge is rarely needed. Most of the time, users are automatically granted access to evaluations data if their Net ID is identified by Yalies as a student.

## Requesting a challenge

The `/api/challenge/request` route accepts GET requests and returns a JSON object with challenge questions.

Before a challenge is generated, we check for a few requirements:

1. The user must be logged in through CAS.
2. The user must exist within our database.
3. The user must not already have evaluations enabled.
4. The user's total number of request/verify attempts is below our threshold (this prevents brute-forcing).

Once these requirements are met, a challenge is produced as follows:

1. We (semi)-randomly select three course evaluation questions that fall under the category of "What is your overall rating of this course?" These questions have five response categories ("poor," "fair," "good," "very good," and "excellent") from which we compute a weighted average between 1 and 5.

   Random selection is implemented by choosing a random float between 1 and 5 and selecting questions with a mean response just above this threshold (accomplished by sorting the responses in order of ascending mean rating and limiting to the first three).

2. For each question, we randomly choose one of the five response options for the user to go fetch the number of respondents. For ease of access, we auto-generate the OCE URL from the template `https://oce.app.yale.edu/ocedashboard/studentViewer/courseSummary?crn=<CRN>&termCode=<SEASON>`.

3. An object containing the question-response bucket combinations, the user's NetID, and a salt value is JSON-stringified and encrypted into a token using a secret unknown to the user. This affords us the following points of security:
   - Because the token is tied to the user, others cannot copy this user's challenge task.
   - Because the token is tied to the questions and response categories, the user cannot pick and choose which questions they want to answer.
   - Together these two properties prevent a single challenge from being used by multiple users, ensuring that each user must answer whichever challenge we give them.

4. The token, salt, and an object containing the title, question, response category, and OCE URL for each token are returned. We also include the number of attempts as well as the maximum allowed. For the exact structure of the response, see [api.md](./api.md#get-apichallengerequest)

## Verifying a response

The `/api/challenge/verify` route accepts POST requests and returns a JSON object specifying whether or not the responses are correct, incorrect, or otherwise malformed.

Before verifying the answers, we check that the user is logged in, within our database, does not have evaluations enabled, and has not hit the challenge attempt limit.

Once these requirements are passed, we perform the following:

1. The token, salt, and answers are extracted from the response body. For the exact structure of the request, see [api.md](./api.md#post-apichallengeverify). We require:
   - The token to be decrypted and parsed to a valid JSON object.
   - The answers and the token to have matching question-response index combinations.
   - The net ID in the token to match the request user's net ID.
2. We retrieve the response numbers for each question from our database. These are then compared with the values in the provided answers. If these are all correct, then a `CORRECT` response is given; otherwise, an `INCORRECT` response is returned.
