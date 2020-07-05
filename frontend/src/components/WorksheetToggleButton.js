import React, { useState } from 'react';
import styles from './WorksheetToggleButton.css';
import { BsPlusCircle, BsXCircle } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';

const WorksheetToggleButton = props => {
  var [inWorksheet, setInWorksheet] = useState(-1);
  const { user, userRefresh } = useUser();
  if (user.worksheet === null) return <div>Signin</div>;
  if (inWorksheet === -1) {
    for (let i = 0; i < user.worksheet.length; i++) {
      if (
        user.worksheet[i][0] === props.season_code &&
        user.worksheet[i][1] === props.crn.toString()
      ) {
        setInWorksheet(1);
        break;
      }
    }
  }

  function add_remove_course() {
    let add_remove;
    inWorksheet === 1 ? (add_remove = 'remove') : (add_remove = 'add');
    axios
      .get(
        `/legacy_api/WorksheetActions.php?action=${add_remove}&season=${
          props.season_code
        }&ociId=${props.crn}`
      )
      .then(response => {
        console.log(response.data);
      });
    if (inWorksheet === 1) setInWorksheet(0);
    else setInWorksheet(1);
  }

  function toggleWorkSheet(e) {
    e.preventDefault();
    add_remove_course();
    userRefresh().catch(err => {
      toast.error('Failed to update worksheet');
      console.error(err);
    });
    // setInWorksheet(1 - inWorksheet);
    console.log('toggle ', props.crn + ' ' + props.season_code);
  }
  return (
    <Button
      // variant={inWorksheet === 1 ? 'danger' : 'success'}
      variant="toggle"
      onClick={toggleWorkSheet}
      className={inWorksheet === 1 ? 'redColor' : 'greenColor'}
    >
      {inWorksheet === 1 ? <BsXCircle /> : <BsPlusCircle />}
    </Button>
  );
};

export default WorksheetToggleButton;
