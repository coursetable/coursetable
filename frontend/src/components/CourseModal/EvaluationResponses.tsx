import React, { useState, useMemo } from 'react';
import { Tab, Row, Tabs } from 'react-bootstrap';
import styled from 'styled-components';
import Mark from 'mark.js';
import styles from './EvaluationResponses.module.css';
import type { Crn } from '../../utilities/common';
import { StyledInput, TextComponent } from '../StyledComponents';
import type { SearchEvaluationNarrativesQuery } from '../../generated/graphql';

// Tabs of evaluation comments in modal
const StyledTabs = styled(Tabs)`
  background-color: ${({ theme }) => theme.surface[0]};
  font-weight: 500;
  position: sticky;
  top: -1rem;
  .active {
    background-color: ${({ theme }) => `${theme.surface[0]} !important`};
    color: #468ff2 !important;
    border-bottom: none;
  }
  .nav-item {
    color: ${({ theme }) => theme.text[0]};
  }
  .nav-item:hover {
    background-color: ${({ theme }) => theme.banner};
    color: ${({ theme }) => theme.text[0]};
  }
`;

// Row for each comment
const StyledCommentRow = styled(Row)`
  font-size: 14px;
  font-weight: 450;
  border-bottom: 1px solid ${({ theme }) => theme.multivalue};
`;

// Bubble to choose sort order
const StyledSortOption = styled.span<{ active: boolean }>`
  padding: 3px 5px;
  background-color: ${({ theme, active }) =>
    active ? 'rgba(92, 168, 250,0.5)' : theme.border};
  color: ${({ theme, active }) => (active ? theme.text[0] : theme.text[2])};
  font-weight: 500;
  &:hover {
    background-color: ${({ theme, active }) =>
      active ? 'rgba(92, 168, 250,0.5)' : theme.multivalue};
    cursor: pointer;
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
  const [sortOrder, setSortOrder] = useState('original');

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
          tempResponses[node.evaluation_question.question_text] ||= [];
          tempResponses[node.evaluation_question.question_text].push(
            node.comment,
          );
        }
      });
    });
    const sortedResponses = JSON.parse(
      JSON.stringify(tempResponses),
    ) as typeof tempResponses;
    for (const key of Object.keys(tempResponses))
      sortedResponses[key].sort((a, b) => b.length - a.length);

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
          <StyledCommentRow key={index} className="m-auto p-2 responses">
            <TextComponent type={1}>{response}</TextComponent>
          </StyledCommentRow>
        ));
      if (filteredResps.length === 0) {
        return [
          <StyledCommentRow key={0} className="m-auto p-2">
            <TextComponent type={1}>No matches found.</TextComponent>
          </StyledCommentRow>,
        ];
      }
      return filteredResps;
    };
    for (const key of Object.keys(curResponses)) {
      if (key.includes('summarize')) tempSummary = genTemp(curResponses[key]);
      else if (key.includes('recommend'))
        tempRecommend = genTemp(curResponses[key]);
      else if (key.includes('skills')) tempSkills = genTemp(curResponses[key]);
      else if (key.includes('strengths'))
        tempStrengths = genTemp(curResponses[key]);
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
      <Row className={`${styles.sort_by} mx-auto mb-2 justify-content-center`}>
        <span className="font-weight-bold my-auto mr-2">Sort comments by:</span>
        <div className={styles.sort_options}>
          <StyledSortOption
            active={sortOrder === 'original'}
            onClick={() => setSortOrder('original')}
          >
            original order
          </StyledSortOption>
          <StyledSortOption
            active={sortOrder === 'length'}
            onClick={() => setSortOrder('length')}
          >
            length
          </StyledSortOption>
        </div>
      </Row>
      <StyledTabs
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
            <Row className={`${styles.question_header} m-auto pt-2`}>
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
            <Row className={`${styles.question_header} m-auto pt-2`}>
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
            <Row className={`${styles.question_header} m-auto pt-2`}>
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
            <Row className={`${styles.question_header} m-auto pt-2`}>
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
