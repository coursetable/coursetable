import React from 'react';
import { Tabs, Tab, Row, Col, Modal } from 'react-bootstrap';
import { SEARCH_EVALUATION_NARRATIVES } from '../queries/QueryStrings';
import { useQuery } from '@apollo/react-hooks';
import styles from './CourseModalEvaluations.module.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import EvaluationResponses from './EvaluationResponses';

const CourseModalEvaluations = (props) => {
  // console.log(props);

  const goBack = () => {
    props.setSeason('overview');
  };

  return (
    <Modal.Body>
      <Row className="m-auto">
        <Col sm={5} className="px-0 my-0">
          <Row className="m-auto">
            <div onClick={() => goBack()} className={styles.back_arrow}>
              <IoMdArrowRoundBack size={30} />
            </div>
          </Row>
          Charts
        </Col>

        <Col sm={7} className="px-0 my-0">
          <EvaluationResponses
            season_code={props.season_code}
            course_code={props.course_code}
          />
        </Col>
      </Row>
    </Modal.Body>
  );
};

export default CourseModalEvaluations;
