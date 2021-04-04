import React, { useState, useMemo, useCallback } from 'react';
import { Col, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import { toSeasonString } from '../courseUtilities';
import { TextComponent } from './StyledComponents';
import styles from './NewCourseModalEvaluations.module.css';
import styled from 'styled-components';
import { LineChart, PieChart } from 'react-chartkick';
import 'chart.js';
import { useSearchEvaluationNarrativesQuery } from '../generated/graphql';
import NewEvaluationRatings from './NewEvaluationRatings';
import NewEvaluationResponses from './NewEvaluationResponses';

const StyledSeasonHeader = styled(Row)`
  border-top: 1px solid ${({ theme }) => theme.text[3]};
  color: ${({ theme }) => theme.text[3]};
  padding: 5px 0;
  font-size: 18px;
  font-weight: 500;
  transition: font-size 0.3s, color 0.1s;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.text[1]};
  }
  &.last {
    border-bottom: 1px solid ${({ theme }) => theme.text[3]};
    margin-bottom: 2rem;
  }
  &.selected {
    font-size: 22px;
    font-weight: 600;
    color: ${({ theme }) => theme.text[1]};
  }
`;

// Tabs of evaluation comments in modal
export const StyledTabs = styled(Tabs)`
  background-color: ${({ theme }) => theme.surface[0]};
  font-weight: 500;
  position: sticky;
  top: 0rem;
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

const CourseModalEvaluations = ({ all_listings }) => {
  const [selected, setSelected] = useState(null);
  const seasons = Object.keys(all_listings).reverse();
  const workloads = [];
  const overalls = [];
  for (const season in all_listings) {
    const evals = all_listings[season][0].evals;
    workloads.push([
      toSeasonString(season)[0],
      evals ? evals.avg_workload : null,
    ]);
    overalls.push([toSeasonString(season)[0], evals ? evals.avg_rating : null]);
  }
  // console.log(all_listings);
  // console.log(workloads);
  // console.log(overalls);
  // Fetch eval data for this listing
  const { loading, error, data } = useSearchEvaluationNarrativesQuery({
    variables: {
      season_code: selected ? selected.season_code : 'lmao',
      crn: selected ? selected.crn : 69,
    },
  });

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
    if (selected && data) {
      // Loop through each section for this course code
      const {
        nodes,
      } = data.computed_listing_info[0].course.evaluation_narratives_aggregate;
      // Add comments to responses dictionary
      nodes.forEach((node) => {
        if (!temp_responses[node.evaluation_question.question_text])
          temp_responses[node.evaluation_question.question_text] = [];
        temp_responses[node.evaluation_question.question_text].push(
          node.comment
        );
      });
    }

    return [
      temp_responses,
      sortByLength(JSON.parse(JSON.stringify(temp_responses))), // Deep copy temp_responses and sort it
    ];
  }, [selected, data, sortByLength]);

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
      <Col sm={3} className="pr-2">
        <div className={styles.season_col}>
          {seasons.map((cur_season, index) => {
            const season_index = index;
            return all_listings[cur_season].map((cur_listing, index) =>
              cur_listing.evals ? (
                <StyledSeasonHeader
                  key={index}
                  className={`mx-auto justify-content-center ${
                    season_index === seasons.length - 1 &&
                    index === all_listings[cur_season].length - 1
                      ? 'last'
                      : ''
                  } ${
                    selected && cur_listing.crn === selected.crn
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => {
                    setSelected(
                      selected && cur_listing.crn === selected.crn
                        ? null
                        : cur_listing
                    );
                  }}
                >
                  <span className={styles.season_header}>
                    {toSeasonString(cur_season)[0].toUpperCase()}{' '}
                    {cur_listing.section}
                  </span>
                </StyledSeasonHeader>
              ) : null
            );
          })}
        </div>
      </Col>
      <Col sm={9} className="pl-2">
        {selected ? (
          data ? (
            <StyledTabs
              variant="tabs"
              transition={false}
              // onSelect={() => {
              //   // Scroll to top of modal when a different tab is selected
              //   document
              //     .querySelector('.modal-body')
              //     .scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              // }}
            >
              <Tab eventKey="stats" title="Stats">
                <NewEvaluationRatings info={data.computed_listing_info[0]} />
              </Tab>
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
                      What knowledge, skills, and insights did you develop by
                      taking this course?
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
                      What are the strengths and weaknesses of this course and
                      how could it be improved?
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
                      How would you summarize this course? Would you recommend
                      it to another student? Why or why not?
                    </TextComponent>
                  </Row>
                  {summary}
                </Tab>
              )}

              {/* <NewEvaluationResponses info={data.computed_listing_info[0]} /> */}
            </StyledTabs>
          ) : (
            <Row className="mx-auto my-4 justify-content-center">
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Row>
          )
        ) : (
          <LineChart
            round={2}
            data={[
              { name: 'Workload', data: workloads },
              { name: 'Overall', data: overalls },
            ]}
          />
        )}
      </Col>
    </>
  );
};

export default CourseModalEvaluations;
