import RatingsGraph from './RatingsGraph';
import type { SearchEvaluationNarrativesQuery } from '../../generated/graphql';
import { evalQuestionTags } from '../../utilities/constants';
import { TextComponent } from '../Typography';
import styles from './EvaluationRatings.module.css';

const tagIndex = Object.fromEntries(
  evalQuestionTags.map((tag, index) => [tag, index]),
);

function EvaluationRatings({
  info,
}: {
  readonly info:
    | SearchEvaluationNarrativesQuery['computed_listing_info'][number]
    | undefined;
}) {
  if (!info) return null;
  const ratings = info.course.evaluation_ratings.map((x) => ({
    tag: x.evaluation_question.tag,
    questionText: x.evaluation_question.question_text!,
    rating: x.rating as number[],
    options: x.evaluation_question.options as string[],
  }));
  ratings.sort((a, b) => {
    if (a.tag && b.tag) return tagIndex[a.tag]! - tagIndex[b.tag]!;
    if (a.tag) return -1;
    if (b.tag) return 1;
    return a.questionText.localeCompare(b.questionText);
  });

  const items = ratings
    .filter((question) => question.rating.length)
    .map(({ tag, questionText, rating, options }) => (
      <div key={tag ?? questionText}>
        <div className={styles.question}>
          {tag && <div className={styles.questionTitle}>{tag}</div>}
          <div className={styles.questionText}>
            <TextComponent type="secondary">{questionText}</TextComponent>
          </div>
        </div>
        <RatingsGraph
          ratings={rating}
          reverse={tag === 'Workload' || tag === 'Intellectual Challenge'}
          labels={options}
          enrolled={info.enrolled ?? 0}
        />
      </div>
    ));

  return <div>{items}</div>;
}

export default EvaluationRatings;
