import React, { useState, useMemo, useCallback } from 'react';
import { Tab, Row, Tabs } from 'react-bootstrap';
import styled from 'styled-components';
import styles from './EvaluationResponses.module.css';
import { TextComponent } from './StyledComponents';

// Row for each comment
const StyledCommentRow = styled(Row)`
  font-size: 14px;
  font-weight: 450;
  border-bottom: 1px solid ${({ theme }) => theme.multivalue};
`;

// Bubble to choose sort order
const StyledSortOption = styled.span`
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
 * @prop info - dictionary that holds the eval data for each question
 */

const NewEvaluationResponses = ({ info }) => {
  // Sort by original order or length?
  const [sort_order, setSortOrder] = useState('original');

  const sortByLength = useCallback((responses) => {
    for (const key in responses) {
      responses[key].sort(function (a, b) {
        return b.length - a.length;
      });
    }
    return responses;
  }, []);

  // Dictionary that holds the comments for each question
  const [responses, sorted_responses] = useMemo(() => {
    const temp_responses = {};
    // Loop through each section for this course code
    const { nodes } = info.course.evaluation_narratives_aggregate;
    // Add comments to responses dictionary
    nodes.forEach((node) => {
      if (!temp_responses[node.evaluation_question.question_text])
        temp_responses[node.evaluation_question.question_text] = [];
      temp_responses[node.evaluation_question.question_text].push(node.comment);
    });

    return [
      temp_responses,
      sortByLength(JSON.parse(JSON.stringify(temp_responses))), // Deep copy temp_responses and sort it
    ];
  }, [info, sortByLength]);

  // Number of questions
  const num_questions = Object.keys(responses).length;

  // Generate HTML to hold the responses to each question
  const [recommend, skills, strengths, summary] = useMemo(() => {
    // Lists that hold the html for the comments for a specific question
    let temp_recommend = [];
    let temp_skills = [];
    let temp_strengths = [];
    let temp_summary = [];
    const cur_responses =
      sort_order === 'length' ? sorted_responses : responses;
    // Populate the lists above
    for (const key in cur_responses) {
      if (key.includes('summarize')) {
        temp_summary = cur_responses[key].map((response, index) => {
          return (
            <StyledCommentRow key={index} className="m-auto p-2">
              <TextComponent type={1}>{response}</TextComponent>
            </StyledCommentRow>
          );
        });
      } else if (key.includes('recommend')) {
        temp_recommend = cur_responses[key].map((response, index) => {
          return (
            <StyledCommentRow key={index} className="m-auto p-2">
              <TextComponent type={1}>{response}</TextComponent>
            </StyledCommentRow>
          );
        });
      } else if (key.includes('skills')) {
        temp_skills = cur_responses[key].map((response, index) => {
          return (
            <StyledCommentRow key={index} className="m-auto p-2">
              <TextComponent type={1}>{response}</TextComponent>
            </StyledCommentRow>
          );
        });
      } else if (key.includes('strengths')) {
        temp_strengths = cur_responses[key].map((response, index) => {
          return (
            <StyledCommentRow key={index} className="m-auto p-2">
              <TextComponent type={1}>{response}</TextComponent>
            </StyledCommentRow>
          );
        });
      }
    }
    return [temp_recommend, temp_skills, temp_strengths, temp_summary];
  }, [responses, sort_order, sorted_responses]);

  return (
    <>
      {recommend.length !== 0 && (
        <Tab eventKey="recommended" title="Q1">
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
        <Tab eventKey="knowledge/skills" title="Q2">
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
        <Tab eventKey="strengths/weaknesses" title="Q3">
          <Row className={`${styles.question_header} m-auto pt-2`}>
            <TextComponent type={0}>
              What are the strengths and weaknesses of this course and how could
              it be improved?
            </TextComponent>
          </Row>
          {strengths}
        </Tab>
      )}
      {/* Summarize Question */}
      {summary.length !== 0 && (
        <Tab eventKey="summary" title="Q1">
          <Row className={`${styles.question_header} m-auto pt-2`}>
            <TextComponent type={0}>
              How would you summarize this course? Would you recommend it to
              another student? Why or why not?
            </TextComponent>
          </Row>
          {summary}
        </Tab>
      )}
    </>
  );
};

export default NewEvaluationResponses;
