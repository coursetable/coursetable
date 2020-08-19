import React, { useState } from 'react';
import './WorksheetToggleButton.css';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';
import { isInWorksheet } from '../utilities';
import { FetchWorksheetLazy } from '../queries/GetWorksheetListings';

const WorksheetToggleButton = (props) => {
  const { user, userRefresh } = useUser();
  if (user.worksheet) {
    var [fetchWorksheetListings, { loading, data }] = FetchWorksheetLazy(
      user.worksheet,
      props.season_code
    );
  }
  const [inWorksheet, setInWorksheet] = useState(
    isInWorksheet(props.season_code, props.crn.toString(), user.worksheet)
  );

  const update = isInWorksheet(
    props.season_code,
    props.crn.toString(),
    user.worksheet
  );
  if (inWorksheet !== update) setInWorksheet(update);
  if (user.worksheet === null)
    return (
      <Button onClick={toggleWorkSheet} className="p-0 disabled-button">
        <BsBookmark size={25} className="disabled-button-icon" />
      </Button>
    );

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

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>
        {inWorksheet ? 'Remove from worksheet' : 'Add to worksheet'}
      </small>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 1000, hide: 250 }}
      overlay={renderTooltip}
    >
      <Button
        variant="toggle"
        className={'p-0 bookmark_fill ' + (props.modal ? '' : 'bookmark_move')}
        onClick={toggleWorkSheet}
      >
        {inWorksheet ? (
          <BsBookmarkFill
            className={'bookmark_fill ' + (props.modal ? '' : 'bookmark_move')}
            color="#3396ff"
            size={25}
          />
        ) : (
          <BsBookmark
            color={'#3396ff'}
            size={25}
            style={{ transition: '0.3s' }}
          />
        )}
      </Button>
    </OverlayTrigger>
  );
};

export default WorksheetToggleButton;
