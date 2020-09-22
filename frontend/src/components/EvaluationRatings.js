import React from 'react';
import { Row } from 'react-bootstrap';
// import styles from './EvaluationRatings.module.css';
import RatingsGraph from './RatingsGraph';

/**
 * Displays Evaluation Graphs
 * @prop crn - integer that holds current listing's crn
 * @prop info - dictionary that holds the eval data for each question
 */

const EvaluationRatings = ({ crn, info }) => {
  // List of dictionaries that holds the ratings for each question as well as the question text
  let ratings = [];
  // Loop through each section
  info.forEach((section) => {
    const crn_code = section.crn;
    // Only fetch ratings data for this section
    if (crn_code !== crn) return;
    const temp = section.course.evaluation_ratings;
    // Loop through each set of ratings
    for (let i = 0; i < temp.length; i++) {
      ratings.push({
        question: temp[i].evaluation_question.question_text,
        values: [],
      });
      // Store the counts for each rating in the values list
      for (let j = 0; j < temp[i].rating.length; j++) {
        ratings[i].values.push(temp[i].rating[j]);
      }
    }
  });

  // Each of the following lists will store the values for a specific question
  let assessment = [];
  let workload = [];
  let engagement = [];
  let organized = [];
  let feedback = [];
  let challenge = [];
  let major = [];
  // Populate the lists above
  ratings.forEach((rating) => {
    if (rating.question.includes('assessment')) assessment = rating.values;
    else if (rating.question.includes('workload')) workload = rating.values;
    else if (rating.question.includes('engagement')) engagement = rating.values;
    else if (rating.question.includes('organized')) organized = rating.values;
    else if (rating.question.includes('feedback')) feedback = rating.values;
    else if (rating.question.includes('challenge')) challenge = rating.values;
    else if (rating.question.includes('major')) major = rating.values;
  });

  return (
    <div>
      {assessment.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1 justify-content-center">
            <strong>Overall</strong>
          </Row>
          <RatingsGraph ratings={assessment} reverse={false} />
        </div>
      )}
      {workload.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1 justify-content-center">
            <strong>Workload</strong>
          </Row>
          <RatingsGraph ratings={workload} reverse={true} />
        </div>
      )}
      {major.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1 justify-content-center">
            <strong>Taking for major?</strong>
          </Row>
          <RatingsGraph ratings={major} reverse={true} />
        </div>
      )}
      {engagement.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1 justify-content-center">
            <strong>Engagement</strong>
          </Row>
          <RatingsGraph ratings={engagement} reverse={false} />
        </div>
      )}
      {organized.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1 justify-content-center">
            <strong>Organization</strong>
          </Row>
          <RatingsGraph ratings={organized} reverse={false} />
        </div>
      )}
      {feedback.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1 justify-content-center">
            <strong>Feedback clarity</strong>
          </Row>
          <RatingsGraph ratings={feedback} reverse={false} />
        </div>
      )}
      {challenge.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1 justify-content-center">
            <strong>Intellectual Challenge</strong>
          </Row>
          <RatingsGraph ratings={challenge} reverse={false} />
        </div>
      )}
    </div>
  );
};

export default EvaluationRatings;
