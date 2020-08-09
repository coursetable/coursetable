import React from 'react';
import { Row } from 'react-bootstrap';
// import styles from './EvaluationRatings.module.css';
import RatingsGraph from './RatingsGraph';

const EvaluationRatings = (props) => {
  const info = props.info;
  let ratings = [];
  info.forEach((section) => {
    const crn_code = section.course.listings[0].crn;
    if (crn_code !== props.crn) return;
    const temp = section.course.evaluation_ratings;
    for (let i = 0; i < temp.length; i++) {
      ratings.push({
        question: temp[i].evaluation_question.question_text,
        values: [],
      });
      for (let j = 0; j < temp[i].rating.length; j++) {
        ratings[i].values.push(temp[i].rating[j]);
      }
    }
  });
  // const num_questions = ratings.length;
  let assessment = [];
  let workload = [];
  let engagement = [];
  let organized = [];
  let feedback = [];
  let challenge = [];
  let major = [];
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
          <Row className="mx-auto mb-1 pl-1">
            <strong>Overall</strong>
          </Row>
          <RatingsGraph ratings={assessment} reverse={false} />
        </div>
      )}
      {workload.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1">
            <strong>Workload</strong>
          </Row>
          <RatingsGraph ratings={workload} reverse={true} />
        </div>
      )}
      {major.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1">
            <strong>Taking for Major?</strong>
          </Row>

          <RatingsGraph ratings={major} reverse={true} />
        </div>
      )}
      {engagement.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1">
            <strong>Engagement</strong>
          </Row>
          <RatingsGraph ratings={engagement} reverse={false} />
        </div>
      )}
      {organized.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1">
            <strong>Organization</strong>
          </Row>
          <RatingsGraph ratings={organized} reverse={false} />
        </div>
      )}
      {feedback.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1">
            <strong>Feedback Clarity</strong>
          </Row>
          <RatingsGraph ratings={feedback} reverse={false} />
        </div>
      )}
      {challenge.length > 0 && (
        <div>
          <Row className="mx-auto mb-1 pl-1">
            <strong>Intellectual Challenge</strong>
          </Row>
          <RatingsGraph ratings={challenge} reverse={false} />
        </div>
      )}
    </div>
  );
};

export default EvaluationRatings;
