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
  const questions = [
    'assessment',
    'workload',
    'major',
    'engagement',
    'organized',
    'feedback',
    'challenge',
  ];
  const graph_labels = {
    assessment: ['poor', 'fair', 'good', 'very good', 'excellent'],
    workload: ['much less', 'less', 'same', 'greater', 'much greater'],
    engagement: ['very low', 'low', 'medium', 'high', 'very high'],
    organized: [
      'strongly disagree',
      'disagree',
      'neutral',
      'agree',
      'strongly agree',
    ],
    feedback: [
      'strongly disagree',
      'disagree',
      'neutral',
      'agree',
      'strongly agree',
    ],
    challenge: ['much less', 'less', 'same', 'greater', 'much greater'],
    major: [],
  };
  const graph_titles = {
    assessment: 'Overall',
    workload: 'Workload',
    engagement: 'Engagement',
    organized: 'Organization',
    feedback: 'Feedback Clarity',
    challenge: 'Intellectual Challenge',
    major: 'Taking for Major?',
  };
  let filtered_ratings = {
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

  console.log(filtered_ratings);

  let items = [];
  questions.forEach((question) => {
    if (filtered_ratings[question].length) {
      items.push(
        <div key={question}>
          <Row className="mx-auto mb-1 pl-1 justify-content-center">
            <strong>{graph_titles[question]}</strong>
          </Row>
          <RatingsGraph
            ratings={filtered_ratings[question]}
            reverse={question === 'major' || question === 'workload'}
            labels={graph_labels[question]}
          />
        </div>
      );
    }
  });

  return <div>{items}</div>;
};

export default EvaluationRatings;
