import React from 'react';
import { Tabs, Tab, Row } from 'react-bootstrap';
import styles from './EvaluationResponses.module.css';

const CourseModalEvaluations = (props) => {
  const info = props.info;
  let responses = {};
  info.forEach((section) => {
    const crn_code = section.course.listings[0].crn;
    if (crn_code !== props.crn) return;
    const nodes = section.course.evaluation_narratives_aggregate.nodes;
    if (!nodes.length) return;
    nodes.forEach((node) => {
      if (!responses[node.evaluation_question.question_text])
        responses[node.evaluation_question.question_text] = [];
      responses[node.evaluation_question.question_text].push(node.comment);
    });
  });
  const num_questions = Object.keys(responses).length;
  console.log(num_questions);
  let recommend = [];
  let skills = [];
  let strengths = [];
  let summary = [];
  let id = 0;
  for (let key in responses) {
    if (key.includes('summarize')) {
      summary = responses[key].map((response) => {
        return (
          <Row key={id++} className={styles.response + ' m-auto p-2'}>
            {response}
          </Row>
        );
      });
    } else if (key.includes('recommend')) {
      recommend = responses[key].map((response) => {
        return (
          <Row key={id++} className={styles.response + ' m-auto p-2'}>
            {response}
          </Row>
        );
      });
    } else if (key.includes('skills')) {
      skills = responses[key].map((response) => {
        return (
          <Row key={id++} className={styles.response + ' m-auto p-2'}>
            {response}
          </Row>
        );
      });
    } else if (key.includes('strengths')) {
      strengths = responses[key].map((response) => {
        return (
          <Row key={id++} className={styles.response + ' m-auto p-2'}>
            {response}
          </Row>
        );
      });
    }
  }

  return (
    <div>
      <Tabs variant="tabs" transition={false}>
        {recommend.length !== 0 && (
          <Tab eventKey="recommended" title="Recommendations">
            <Row className={styles.question_header + ' m-auto pt-2'}>
              Would you recommend this course to another student? Please
              explain.
            </Row>
            {recommend}
          </Tab>
        )}
        {skills.length !== 0 && (
          <Tab eventKey="knowledge/skills" title="Skills">
            <Row className={styles.question_header + ' m-auto pt-2'}>
              What knowledge, skills, and insights did you develop by taking
              this course?
            </Row>
            {skills}
          </Tab>
        )}
        {strengths.length !== 0 && (
          <Tab eventKey="strengths/weaknesses" title="Pros/Cons">
            <Row className={styles.question_header + ' m-auto pt-2'}>
              What are the strengths and weaknesses of this course and how could
              it be improved?
            </Row>
            {strengths}
          </Tab>
        )}
        {summary.length !== 0 && (
          <Tab eventKey="summary" title="Summary">
            <Row className={styles.question_header + ' m-auto pt-2'}>
              How would you summarize this course? Would you recommend it to
              another student? Why or why not?
            </Row>
            {summary}
          </Tab>
        )}
      </Tabs>
      {!num_questions && <strong>No comments for this course</strong>}
    </div>
  );
};

export default CourseModalEvaluations;
