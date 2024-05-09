import React, { useState, useMemo } from 'react';
import * as Sentry from '@sentry/react';
import clsx from 'clsx';
import { Tab, Tabs } from 'react-bootstrap';
import Mark from 'mark.js';
import type { SearchEvaluationNarrativesQuery } from '../../generated/graphql';
import { evalQuestionTags } from '../../utilities/constants';
import { truncatedText } from '../../utilities/course';
import { Input, TextComponent } from '../Typography';
import styles from './EvaluationResponses.module.css';

function CommentRows({
  responses,
  filter,
}: {
  readonly responses: string[];
  readonly filter: string;
}) {
  if (responses.length === 0) return [];
  const filteredResps = responses
    .filter((response) => response.toLowerCase().includes(filter.toLowerCase()))
    .map((response, index) => (
      // .responses is used for highlighting
      <div key={index} className={clsx(styles.commentRow, 'responses')}>
        <TextComponent type="secondary">{response}</TextComponent>
      </div>
    ));
  if (filteredResps.length === 0) {
    return [
      <div key={0} className={styles.commentRow}>
        <TextComponent type="secondary">No matches found.</TextComponent>
      </div>,
    ];
  }
  return filteredResps;
}

function EvaluationResponses({
  info,
}: {
  readonly info:
    | SearchEvaluationNarrativesQuery['computed_listing_info'][number]
    | undefined;
}) {
  // Sort by original order or length?
  const [sortOrder, setSortOrder] = useState('length');

  // Dictionary that holds the comments for each question
  const [origResponses, sortedResponses] = useMemo(() => {
    if (!info) return [{}, {}];
    const tempResponses: {
      [tag: string]: { questionText: string; responses: string[] };
    } = Object.fromEntries(
      evalQuestionTags.map((tag) => [tag, { questionText: '', responses: [] }]),
    );
    info.course.evaluation_narratives.forEach((data) => {
      const questionTag =
        data.evaluation_question.tag ??
        truncatedText(data.evaluation_question.question_text, 15, '');
      const questionInfo = tempResponses[questionTag] ?? {
        questionText: data.evaluation_question.question_text!,
        responses: [],
      };
      if (!questionInfo.questionText) {
        questionInfo.questionText = data.evaluation_question.question_text!;
      } else if (
        data.evaluation_question.question_text !== questionInfo.questionText
      ) {
        Sentry.captureException(
          new Error(
            `Question text mismatch: ${questionTag} ${data.evaluation_question.question_text!} vs. ${questionInfo.questionText}`,
          ),
        );
      }
      if (data.comment) questionInfo.responses.push(data.comment);
      tempResponses[questionTag] = questionInfo;
    });
    const sortedResponses = JSON.parse(
      JSON.stringify(tempResponses),
    ) as typeof tempResponses;
    for (const r of Object.values(tempResponses))
      r.responses.sort((a, b) => b.length - a.length);

    return [tempResponses, sortedResponses];
  }, [info]);

  // Number of questions
  const numQuestions = Object.keys(origResponses).length;

  const [filter, setFilter] = useState('');

  const curResponses = sortOrder === 'length' ? sortedResponses : origResponses;

  const context = document.querySelectorAll('.responses');
  const instance = new Mark(context);

  if (!info || !numQuestions) {
    return (
      <div>
        <strong>No evaluations available</strong>
      </div>
    );
  }
  const enrolled = info.enrolled ?? 0;

  return (
    <div>
      <Input
        id="filter-input"
        type="text"
        placeholder="Search evaluations..."
        value={filter}
        className={styles.filterInput}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFilter(event.target.value);
          instance.unmark({
            done() {
              instance.mark(event.target.value);
            },
          });
        }}
      />
      <div className={styles.sortBy}>
        <span className="fw-bold my-auto me-2">Sort comments by:</span>
        <div className={styles.sortOptions}>
          <button
            type="button"
            className={clsx(
              styles.sortOption,
              sortOrder === 'length' && styles.activeSortOption,
            )}
            onClick={() => setSortOrder('length')}
          >
            original order
          </button>
          <button
            type="button"
            className={clsx(
              styles.sortOption,
              sortOrder === 'original' && styles.activeSortOption,
            )}
            onClick={() => setSortOrder('original')}
          >
            length
          </button>
        </div>
      </div>
      <Tabs
        className={styles.tabs}
        variant="tabs"
        transition={false}
        onSelect={() => {
          // Scroll to top of modal when a different tab is selected
          document
            .querySelector('.modal-body')
            ?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        {Object.entries(curResponses).map(
          ([tag, { questionText, responses }]) =>
            responses.length !== 0 && (
              <Tab eventKey={tag} title={tag} key={tag}>
                <div className={styles.questionHeader}>
                  <TextComponent>{questionText}</TextComponent>
                </div>
                <p className={styles.responseStats}>
                  <TextComponent type="secondary">
                    {responses.length}/{enrolled} (
                    {((responses.length / enrolled) * 100).toFixed(1)}%)
                    responses
                  </TextComponent>
                </p>
                <CommentRows responses={responses} filter={filter} />
              </Tab>
            ),
        )}
      </Tabs>
    </div>
  );
}

export default EvaluationResponses;
