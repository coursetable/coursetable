import React, { useState, useMemo } from 'react';
import { Tab, Row, Tabs } from 'react-bootstrap';
import styled from 'styled-components';
import clsx from 'clsx';
import Mark from 'mark.js';
import styles from './EvaluationResponses.module.css';
import type { Crn } from '../../utilities/common';
import { StyledInput, TextComponent } from '../StyledComponents';
import type { SearchEvaluationNarrativesQuery } from '../../generated/graphql';

// Tabs of evaluation comments in modal
const StyledTabs = styled(Tabs)`
  background-color: ${({ theme }) => theme.surface[0]};
  .active {
    background-color: ${({ theme }) => theme.surface[0]} !important;
  }
  .nav-item {
    color: ${({ theme }) => theme.text[0]};
  }
  .nav-item:hover {
    background-color: ${({ theme }) => theme.banner};
    color: ${({ theme }) => theme.text[0]};
  }
`;

/**
 * Displays Evaluation Comments
 * @prop crn - integer that holds current listing's crn
 * @prop info - dictionary that holds the eval data for each question
 */

function EvaluationResponses({
  crn,
  info,
}: {
  readonly crn: Crn;
  readonly info?: SearchEvaluationNarrativesQuery['computed_listing_info'];
}) {
  // Sort by original order or length?
  const [sortOrder, setSortOrder] = useState('length');

  // Dictionary that holds the comments for each question
  const [responses, sortedResponses] = useMemo(() => {
    const tempResponses: { [questionText: string]: string[] } = {};
    // Loop through each section for this course code
    (info || []).forEach((section) => {
      const crnCode = section.crn;
      // Only fetch comments for this section
      if (crnCode !== crn) return;
      const { nodes } = section.course.evaluation_narratives_aggregate;
      // Return if no comments
      if (!nodes.length) return;
      // Add comments to responses dictionary
      nodes.forEach((node) => {
        if (node.evaluation_question.question_text && node.comment) {
          // There are a lot of ESLint bugs with index signatures and
          // no-unnecessary-condition
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          (tempResponses[node.evaluation_question.question_text] ??= []).push(
            node.comment,
          );
        }
      });
    });
    const sortedResponses = JSON.parse(
      JSON.stringify(tempResponses),
    ) as typeof tempResponses;
    for (const r of Object.values(tempResponses))
      r.sort((a, b) => b.length - a.length);

    return [tempResponses, sortedResponses];
  }, [info, crn]);

  // Number of questions
  const numQuestions = Object.keys(responses).length;

  const [filter, setFilter] = useState('');

  // Generate HTML to hold the responses to each question
  const [recommend, skills, strengths, summary] = useMemo(() => {
    // Lists that hold the html for the comments for a specific question
    let tempRecommend: JSX.Element[] = [];
    let tempSkills: JSX.Element[] = [];
    let tempStrengths: JSX.Element[] = [];
    let tempSummary: JSX.Element[] = [];
    const curResponses = sortOrder === 'length' ? sortedResponses : responses;
    // Populate the lists above
    const genTemp = (resps: string[]) => {
      if (resps.length === 0) return [];
      const filteredResps = resps
        .filter((response) =>
          response.toLowerCase().includes(filter.toLowerCase()),
        )
        .map((response, index) => (
          <Row
            key={index}
            className={clsx(styles.commentRow, 'm-auto p-2 responses')}
          >
            <TextComponent type={1}>{response}</TextComponent>
          </Row>
        ));
      if (filteredResps.length === 0) {
        return [
          <Row key={0} className={clsx(styles.commentRow, 'm-auto p-2')}>
            <TextComponent type={1}>No matches found.</TextComponent>
          </Row>,
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

  return (
    <div>
      <StyledInput
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
      <Row
        className={clsx(styles.sortBy, 'mx-auto mb-2 justify-content-center')}
      >
        <span className="font-weight-bold my-auto mr-2">Sort comments by:</span>
        <div className={styles.sortOptions}>
          {/* TODO */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <span
            className={clsx(
              styles.sortOption,
              sortOrder === 'length' && styles.activeSortOption,
            )}
            onClick={() => setSortOrder('length')}
          >
            original order
          </span>
          {/* TODO */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <span
            className={clsx(
              styles.sortOption,
              sortOrder === 'original' && styles.activeSortOption,
            )}
            onClick={() => setSortOrder('original')}
          >
            length
          </span>
        </div>
      </Row>
      <StyledTabs
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
        {/* Recommend Question */}
        {recommend.length !== 0 && (
          <Tab eventKey="recommended" title="Recommend?">
            <Row className={clsx(styles.questionHeader, 'm-auto pt-2')}>
              <TextComponent type={0}>
                Would you recommend this course to another student? Please
                explain.
              </TextComponent>
            </Row>
            {recommend}
          </Tab>
        )}
        {/* Knowledge/Skills Question */}
        {skills.length !== 0 && (
          <Tab eventKey="knowledge/skills" title="Skills">
            <Row className={clsx(styles.questionHeader, 'm-auto pt-2')}>
              <TextComponent type={0}>
                What knowledge, skills, and insights did you develop by taking
                this course?
              </TextComponent>
            </Row>
            {skills}
          </Tab>
        )}
        {/* Strengths/Weaknesses Question */}
        {strengths.length !== 0 && (
          <Tab eventKey="strengths/weaknesses" title="Strengths/Weaknesses">
            <Row className={clsx(styles.questionHeader, 'm-auto pt-2')}>
              <TextComponent type={0}>
                What are the strengths and weaknesses of this course and how
                could it be improved?
              </TextComponent>
            </Row>
            {strengths}
          </Tab>
        )}
        {/* Summarize Question */}
        {summary.length !== 0 && (
          <Tab eventKey="summary" title="Summary">
            <Row className={clsx(styles.questionHeader, 'm-auto pt-2')}>
              <TextComponent type={0}>
                How would you summarize this course? Would you recommend it to
                another student? Why or why not?
              </TextComponent>
            </Row>
            {summary}
          </Tab>
        )}
      </StyledTabs>
      {!numQuestions && <strong>No comments for this course</strong>}
    </div>
  );
}

export default EvaluationResponses;
