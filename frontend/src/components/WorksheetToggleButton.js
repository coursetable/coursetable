import React, { useState, useEffect } from 'react';
import './WorksheetToggleButton.css';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../user';
import { toast } from 'react-toastify';
import { isInWorksheet } from '../utilities';
import { FetchWorksheetLazy } from '../queries/GetWorksheetListings';
import moment from 'moment';
import { FaCalendarDay } from 'react-icons/fa';

const WorksheetToggleButton = (props) => {
  const { user, userRefresh } = useUser();
  const [fetchWorksheetListings, { loading, data }] = FetchWorksheetLazy(
    user.worksheet
  );
  const [show, setShow] = useState(false);
  const [inWorksheet, setInWorksheet] = useState(
    isInWorksheet(props.season_code, props.crn.toString(), user.worksheet)
  );
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    if (!data || !props.times) return;
    if (props.times === 'TBA') {
      setConflict(true);
      return;
    }
    const listings = data.listings;
    for (let i = 0; i < listings.length; i++) {
      if (listings[i].season_code !== props.season_code) continue;
      const listing = listings[i];
      const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      for (let day = 0; day < 5; day++) {
        const info = listing.course.times_by_day[weekdays[day]];
        if (info === undefined) continue;
        let listing_start = moment(info[0][0], 'HH:mm');
        let listing_end = moment(info[0][1], 'HH:mm');
        if (listing_start.hour() < 8) listing_start.add(12, 'h');
        if (listing_end.hour() < 8) listing_end.add(12, 'h');
        if (props.times[day][0] === '') continue;
        let cur_start = moment(props.times[day][0], 'HH:mm');
        let cur_end = moment(props.times[day][1], 'HH:mm');
        if (!(listing_start > cur_end || cur_start > listing_end)) {
          setConflict(true);
          return;
        }
      }
    }
  }, [data ? data : [], show]);

  useEffect(() => {
    if (inWorksheet) setShow(false);
  }, [inWorksheet]);
  const update = isInWorksheet(
    props.season_code,
    props.crn.toString(),
    user.worksheet
  );
  if (inWorksheet !== update) setInWorksheet(update);
  if (user.worksheet === null) return <div className="mt-1">N/A</div>;

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

  const handleMouseEnter = () => {
    if (!inWorksheet) {
      fetchWorksheetListings();
      setShow(true);
    }
  };

  const handleMouseLeave = () => {
    setShow(false);
    setConflict(false);
  };

  return (
    <Button
      variant="toggle"
      className={'p-0 bookmark_fill ' + (props.modal ? '' : 'bookmark_move')}
      onClick={toggleWorkSheet}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {inWorksheet ? (
        <BsBookmarkFill
          className={'bookmark_fill ' + (props.modal ? '' : 'bookmark_move')}
          color="#007bff"
          size={25}
        />
      ) : (
        <BsBookmark
          color={
            props.times && show && data
              ? !conflict
                ? '#00d962' // No conflicts
                : '#ff6969' // Conflicts
              : '#007bff'
          }
          size={25}
          style={{ transition: '0.3s' }}
        />
      )}
    </Button>
  );
};

export default WorksheetToggleButton;
