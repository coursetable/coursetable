import React, { useState } from 'react';
import './WorksheetToggleButton.css';
import {
  BsBookmark,
  BsBookmarkFill,
  BsBookmarkDash,
  BsBookmarkPlus,
} from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';
import { isInWorksheet } from '../utilities';

const WorksheetToggleButton = (props) => {
  const { user, userRefresh } = useUser();
  var [inWorksheet, setInWorksheet] = useState(
    isInWorksheet(props.season_code, props.crn.toString(), user.worksheet)
  );
  const update = isInWorksheet(
    props.season_code,
    props.crn.toString(),
    user.worksheet
  );
  if (inWorksheet !== update) setInWorksheet(update);
  if (user.worksheet === null) return <div>Signin</div>;

  function add_remove_course() {
    let add_remove;
    inWorksheet ? (add_remove = 'remove') : (add_remove = 'add');
    axios
      .get(
        `/legacy_api/WorksheetActions.php?action=${add_remove}&season=${props.season_code}&ociId=${props.crn}`
      )
      .then((response) => {
        // console.log(response.data);
        userRefresh().catch((err) => {
          toast.error('Failed to update worksheet');
          console.error(err);
        });
        if (props.hasSeason && add_remove === 'remove')
          props.hasSeason(props.season_code, props.crn);
        if (props.setUpdate) props.setUpdate(add_remove);
        if (!props.alwaysRed) setInWorksheet(!inWorksheet);
      });
  }

  function toggleWorkSheet(e) {
    e.preventDefault();
    e.stopPropagation();
    add_remove_course();
    // console.log('toggle ', props.crn + ' ' + props.season_code);
  }
  return (
    <Button variant="toggle" className="p-0" onClick={toggleWorkSheet}>
      {props.bookmark ? (
        inWorksheet ? (
          <BsBookmarkFill color="#ff6969" size={25} />
        ) : (
          <BsBookmark color="#3087ff" size={25} />
        )
      ) : inWorksheet ? (
        <BsBookmarkFill color="#ff6969" size={20} />
      ) : (
        <BsBookmarkPlus color="green" size={20} />
      )}
    </Button>
  );
};

export default WorksheetToggleButton;
