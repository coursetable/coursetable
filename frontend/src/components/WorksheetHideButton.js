import React, { useState } from 'react';
import './WorksheetToggleButton.css';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import { Button } from 'react-bootstrap';

const WorksheetHideButton = (props) => {
  const [hidden, setHidden] = useState(false);
  function toggleWorkSheet(e) {
    e.preventDefault();
    const temp = hidden;
    setHidden(!hidden);
    props.toggleCourse(props.season_code, props.crn, temp);
    // console.log('toggle ', props.crn + ' ' + props.season_code);
  }
  const button_size = 20;
  return (
    <Button variant="toggle" onClick={toggleWorkSheet}>
      {hidden ? (
        <FiSquare color="#d6d6d6" size={button_size} />
      ) : (
        <FiCheckSquare size={button_size} />
      )}
    </Button>
  );
};

export default WorksheetHideButton;
