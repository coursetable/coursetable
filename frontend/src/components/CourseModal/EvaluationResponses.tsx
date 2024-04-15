import React, { useState, useMemo } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import clsx from 'clsx';
import Mark from 'mark.js';
import styles from './EvaluationResponses.module.css';
import { Input, TextComponent } from '../Typography';
import type { SearchEvaluationNarrativesQuery } from '../../generated/graphql';

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
  const [responses, sortedResponses] = useMemo(() => {
    if (!info) return [{}, {}];
    const tempResponses: { [questionText: string]: string[] } = {};
    // Add comments to responses dictionary
    info.course.evaluation_narratives_aggregate.nodes.forEach((node) => {
      if (node.evaluation_question.question_text && node.comment) {
        (tempResponses[node.evaluation_question.question_text] ??= []).push(
          node.comment,
        );
      }
    });
    const sortedResponses = JSON.parse(
      JSON.stringify(tempResponses),
    ) as typeof tempResponses;
    for (const r of Object.values(tempResponses))
      r.sort((a, b) => b.length - a.length);

    return [tempResponses, sortedResponses];
  }, [info]);

  // Number of questions
  const numQuestions = Object.keys(responses).length;

  const [filter, setFilter] = useState('');

  // Generate HTML to hold the responses to each question
  const [recommend, skills, strengths, summary] = useMemo(() => {
    let tempRecommend: JSX.Element[] = [];
    let tempSkills: JSX.Element[] = [];
    let tempStrengths: JSX.Element[] = [];
    let tempSummary: JSX.Element[] = [];
    const curResponses = sortOrder === 'length' ? sortedResponses : responses;
    const genTemp = (resps: string[]) => {
      if (resps.length === 0) return [];
      const filteredResps = resps
        .filter((response) =>
          response.toLowerCase().includes(filter.toLowerCase()),
        )
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
    };
    for (const [question, qResponses] of Object.entries(curResponses)) {
      if (question.includes('summarize')) tempSummary = genTemp(qResponses);
      else if (question.includes('recommend'))
        tempRecommend = genTemp(qResponses);
      else if (question.includes('skills')) tempSkills = genTemp(qResponses);
      else if (question.includes('strengths'))
        tempStrengths = genTemp(qResponses);
    }
    return [tempRecommend, tempSkills, tempStrengths, tempSummary];
  }, [responses, sortOrder, sortedResponses, filter]);

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
        style={{ marginBottom: '5px' }}
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
        {[
          {
            key: 'recommended',
            title: 'Recommend?',
            question:
              'Would you recommend this course to another student? Please explain.',
            responses: recommend,
          },
          {
            key: 'knowledge/skills',
            title: 'Skills',
            question:
              'What knowledge, skills, and insights did you develop by taking this course?',
            responses: skills,
          },
          {
            key: 'strengths/weaknesses',
            title: 'Strengths/Weaknesses',
            question:
              'What are the strengths and weaknesses of this course and how could it be improved?',
            responses: strengths,
          },
          {
            key: 'summary',
            title: 'Summary',
            question:
              'How would you summarize this course? Would you recommend it to another student? Why or why not?',
            responses: summary,
          },
        ].map(
          ({ key, title, question, responses }) =>
            responses.length !== 0 && (
              <Tab eventKey={key} title={title} key={key}>
                <div className={styles.questionHeader}>
                  <TextComponent>{question}</TextComponent>
                </div>
                <p className={styles.responseStats}>
                  <TextComponent type="secondary">
                    {responses.length}/{enrolled} (
                    {((responses.length / enrolled) * 100).toFixed(1)}%)
                    responses
                  </TextComponent>
                </p>
                {responses}
              </Tab>
            ),
        )}
      </Tabs>
    </div>
  );
}

export default EvaluationResponses;
