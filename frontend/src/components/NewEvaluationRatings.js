import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import NewRatingsGraph from './NewRatingsGraph';
import {
  questions,
  graph_labels,
  graph_titles,
  question_text,
} from '../queries/Constants';
import { TextComponent, StyledSwitch } from './StyledComponents';
import switch_styles from '../pages/Feedback.module.css';

/**
 * Displays Evaluation Graphs
 * @prop crn - integer that holds current listing's crn
 * @prop info - dictionary that holds the eval data for each question
 */

const NewEvaluationRatings = ({ info }) => {
  // List of dictionaries that holds the ratings for each question as well as the question text
  const ratings = [];
  // Loop through each section
  const temp = info.course.evaluation_ratings;
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

  // Dictionary with ratings for each question
  const filtered_ratings = {
    assessment: [],
    workload: [],
    engagement: [],
    organized: [],
    feedback: [],
    challenge: [],
    major: [],
  };
  // Populate the lists above
  ratings.forEach((rating) => {
    questions.forEach((question) => {
      if (rating.question.includes(question))
        filtered_ratings[question] = rating.values;
    });
  });
  const [full_question, setFullQuestion] = useState(false);

  const items = [];
  questions.forEach((question, index) => {
    if (filtered_ratings[question].length) {
      // items.push(
      //   <div key={question}>
      //     <Row className="mx-auto mb-1 pl-1 justify-content-center">
      //       <strong>{graph_titles[question]}</strong>
      //       <small className={`${styles.question_text} text-center`}>
      //         <TextComponent type={1}>{question_text[question]}</TextComponent>
      //       </small>
      //     </Row>
      //     <NewRatingsGraph
      //       ratings={filtered_ratings[question]}
      //       reverse={question === 'major' || question === 'workload'}
      //       labels={graph_labels[question]}
      //     />
      //   </div>
      // );
      items.push(
        <Col md={6} className="mb-4" key={index}>
          <Row className="mx-auto mb-1">
            <strong>{graph_titles[question]}</strong>
            {full_question && (
              <small
                style={{
                  fontSize: '12px',
                  fontStyle: 'italic',
                  fontWeight: 300,
                }}
              >
                <TextComponent type={1}>
                  {question_text[question]}
                </TextComponent>
              </small>
            )}
          </Row>
          <NewRatingsGraph
            ratings={filtered_ratings[question]}
            reverse={question === 'major' || question === 'workload'}
            labels={graph_labels[question]}
          />
        </Col>
      );
    }
  });

  return (
    <>
      <Form.Group
        className="mb-1"
        style={{ cursor: 'pointer !important', paddingLeft: '15px' }}
      >
        <StyledSwitch
          className={switch_styles.hover_pointer}
          type="switch"
          id="full"
          name="full"
          label="Display full question from evaluation form"
          onChange={() => {
            setFullQuestion(!full_question);
          }}
          checked={full_question}
        />
      </Form.Group>
      <Row className="mx-auto">{items}</Row>
    </>
  );
};

export default NewEvaluationRatings;
