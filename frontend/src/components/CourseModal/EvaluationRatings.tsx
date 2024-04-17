import React from 'react';
import RatingsGraph from './RatingsGraph';
import type { SearchEvaluationNarrativesQuery } from '../../generated/graphql';
import { evalQuestions } from '../../utilities/constants';
import { TextComponent } from '../Typography';
import styles from './EvaluationRatings.module.css';

const questions = Object.keys(evalQuestions) as (keyof typeof evalQuestions)[];

function EvaluationRatings({
  info,
}: {
  readonly info:
    | SearchEvaluationNarrativesQuery['computed_listing_info'][number]
    | undefined;
}) {
  if (!info) return null;
  const ratings = info.course.evaluation_ratings.map((x) => ({
    question: x.evaluation_question.question_text ?? '',
    values: [...((x.rating as number[] | null) ?? [])],
  }));

  // Dictionary with ratings for each question
  const filteredRatings: { [code in keyof typeof evalQuestions]: number[] } = {
    assessment: [],
    workload: [],
    engagement: [],
    organized: [],
    feedback: [],
    challenge: [],
  };
  // Populate the lists above
  ratings.forEach((rating) => {
    questions.forEach((question) => {
      // TODO: this logic is too hacky. We shouldn't be comparing a question
      // text to an abstract code. Instead, let GraphQL return the code directly
      // (Which is going to save some network bandwidth too!)
      if (rating.question.includes(question))
        filteredRatings[question] = rating.values;
    });
  });

  const items = questions
    .filter((question) => filteredRatings[question].length)
    .map((question) => (
      <div key={question}>
        <div className={styles.question}>
          <div className={styles.questionTitle}>
            {evalQuestions[question].title}
          </div>
          <div className={styles.questionText}>
            <TextComponent type="secondary">
              {evalQuestions[question].question}
            </TextComponent>
          </div>
        </div>
        <RatingsGraph
          ratings={filteredRatings[question]}
          reverse={question === 'workload' || question === 'challenge'}
          labels={evalQuestions[question].labels}
          enrolled={info.enrolled ?? 0}
        />
      </div>
    ));

  return <div>{items}</div>;
}

export default EvaluationRatings;
