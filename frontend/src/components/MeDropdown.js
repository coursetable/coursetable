import React from 'react';

import styles from './MeDropdown.module.css';
import { Row, Col, Collapse } from 'react-bootstrap';
import { FaFacebookSquare } from 'react-icons/fa';
import { FcCalendar } from 'react-icons/fc';

function MeDropdown(props) {
  const handleFBClick = () => {};
  const handleExportClick = () => {};
  const handleDropdownClick = () => {
    props.setIsComponentVisible(true);
  };
  return (
    <div className={styles.collapse_container} onClick={handleDropdownClick}>
      <Collapse in={props.profile_expanded}>
        <Col className={styles.collapse_col + ' px-3'}>
          <Row className=" py-3 m-auto">
            <FaFacebookSquare
              className="mr-2 my-auto"
              size={20}
              color="#007bff"
            />
            <span onClick={handleFBClick} className={styles.collapse_text}>
              Connect to FB
            </span>
          </Row>
          <Row className=" pb-3 m-auto">
            <FcCalendar className="mr-2 my-auto" size={20} />
            <span onClick={handleExportClick} className={styles.collapse_text}>
              Export Worksheet
            </span>
          </Row>
        </Col>
      </Collapse>
    </div>
  );
}

export default MeDropdown;
