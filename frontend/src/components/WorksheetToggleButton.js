import React, { useState } from 'react';
import styles from './WorksheetToggleButton.css';
import { BsPlusCircle, BsXCircle } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';
import { isInWorksheet } from '../utilities';

const WorksheetToggleButton = props => {
  const { user, userRefresh } = useUser();
  var [inWorksheet, setInWorksheet] = useState(
    isInWorksheet(props.season_code, props.crn.toString(), user.worksheet)
  );
  if (user.worksheet === null) return <div>Signin</div>;

  function add_remove_course() {
    let add_remove;
    inWorksheet ? (add_remove = 'remove') : (add_remove = 'add');
    axios
      .get(
        `/legacy_api/WorksheetActions.php?action=${add_remove}&season=${
          props.season_code
        }&ociId=${props.crn}`
      )
      .then(response => {
        console.log(response.data);
        userRefresh().catch(err => {
          toast.error('Failed to update worksheet');
          console.error(err);
        });
        setInWorksheet(!inWorksheet);
      });
  }

  function toggleWorkSheet(e) {
    e.preventDefault();
    add_remove_course();
    console.log('toggle ', props.crn + ' ' + props.season_code);
  }
  return (
    <Button
      variant="toggle"
      onClick={toggleWorkSheet}
      className={inWorksheet ? 'redColor' : 'greenColor'}
    >
      {inWorksheet ? <BsXCircle /> : <BsPlusCircle />}
    </Button>
  );
};

export default WorksheetToggleButton;
