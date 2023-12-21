import React from 'react';
import { Row } from 'react-bootstrap';
import styles from './EvaluationRatings.module.css';
import RatingsGraph from './RatingsGraph';
import type { Crn } from '../../utilities/common';
import {
  questions,
  graphLabels,
  graphTitles,
  questionText,
} from '../../utilities/constants';
import { TextComponent } from '../StyledComponents';
import type { SearchEvaluationNarrativesQuery } from '../../generated/graphql';

/**
 * Displays Evaluation Graphs
 * @prop crn - integer that holds current listing's crn
 * @prop info - dictionary that holds the eval data for each question
 */

function EvaluationRatings({
  crn,
  info,
}: {
  readonly crn: Crn;
  readonly info?: SearchEvaluationNarrativesQuery['computed_listing_info'];
}) {
  // List of dictionaries that holds the ratings for each question as well as
  // the question text
  const ratings = (info || []).flatMap((section) => {
    const crnCode = section.crn;
    // Only fetch ratings data for this section
    if (crnCode !== crn) return [];
    // Loop through each set of ratings
    return section.course.evaluation_ratings.map((x) => ({
      question: x.evaluation_question.question_text || '',
      values: [...x.rating],
    }));
  });

  // Dictionary with ratings for each question
  const filteredRatings: {
    assessment: number[];
    workload: number[];
    engagement: number[];
    organized: number[];
    feedback: number[];
    challenge: number[];
    major: number[];
  } = {
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
        filteredRatings[question] = rating.values;
    });
  });

  const items = questions
    .filter((question) => filteredRatings[question].length)
    .map((question) => (
      <div key={question}>
        <Row className="mx-auto mb-1 pl-1 justify-content-center">
          <strong>{graphTitles[question]}</strong>
          <small className={`${styles.questionText} text-center`}>
            <TextComponent type={1}>{questionText[question]}</TextComponent>
          </small>
        </Row>
        <RatingsGraph
          ratings={filteredRatings[question]}
          reverse={question === 'major' || question === 'workload'}
          labels={graphLabels[question]}
        />
      </div>
    ));

  return <div>{items}</div>;
}

export default EvaluationRatings;
