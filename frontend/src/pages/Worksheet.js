import React, { useState } from 'react';

import { FetchWorksheet } from '../queries/GetWorksheetListings';
import { Row, Col, Fade } from 'react-bootstrap';
import WeekSchedule from '../components/WeekSchedule';
import WorksheetList from '../components/WorksheetList';
import WorksheetAccordion from '../components/WorksheetAccordion';
import CourseModal from '../components/CourseModal';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';

import styles from './Worksheet.module.css';

import { useUser } from '../user';
import { isInWorksheet } from '../utilities';

function Worksheet() {
  const { user } = useUser();
  let season_codes = [];
  const updateRecentSeason = (populate_season_codes, season_code = null) => {
    let recentSeason = '200903';
    if (user.worksheet) {
      user.worksheet.forEach((szn) => {
        if (szn[0] !== season_code && szn[0] > recentSeason)
          recentSeason = szn[0];
        if (populate_season_codes && season_codes.indexOf(szn[0]) === -1)
          season_codes.push(szn[0]);
      });
    }
    return recentSeason;
  };
  season_codes.sort();
  season_codes.reverse();
  const [season, setSeason] = useState(updateRecentSeason(true));
  const [listings, setListings] = useState([]);
  const [worksheet_init, setWorksheetInit] = useState(user.worksheet);
  const [course_modal, setCourseModal] = useState([false, '']);
  const [hidden_courses, setHiddenCourses] = useState([]);
  const [hover_course, setHoverCourse] = useState();
  const [hover_expand, setHoverExpand] = useState('none');
  const [cur_expand, setCurExpand] = useState('none');
  const [rev_flex_direction, setRevFlexDirection] = useState(false);

  if (user.worksheet == null) return <div>Please Login</div>;

  const changeSeason = (season_code) => {
    setSeason(season_code);
  };

  const hasSeason = (season_code, crn) => {
    if (season_code !== season) return;
    for (let i = 0; i < user.worksheet.length; i++) {
      if (
        user.worksheet[i][0] === season &&
        user.worksheet[i][1] !== crn.toString()
      )
        return;
    }
    changeSeason(updateRecentSeason(false, season_code));
  };

  const showModal = (listing) => {
    setCourseModal([true, listing]);
  };

  const hideModal = () => {
    setCourseModal([false, '']);
    setHoverExpand(cur_expand);
  };

  const isHidden = (season_code, crn) => {
    for (let i = 0; i < hidden_courses.length; i++) {
      if (hidden_courses[i][0] === season_code && hidden_courses[i][1] === crn)
        return i;
    }
    return -1;
  };

  const toggleCourse = (season_code, crn, hidden) => {
    if (!hidden) {
      setHiddenCourses([...hidden_courses, [season_code, crn]]);
    } else {
      let temp = [...hidden_courses];
      temp.splice(isHidden(season_code, crn), 1);
      setHiddenCourses(temp);
    }
  };

  const sortByCourseCode = (a, b) => {
    if (a.course_code < b.course_code) return -1;
    return 1;
  };

  if (user.worksheet.length === 0)
    return <div>Please add courses to your worksheet</div>;

  const { loading, error, data } = FetchWorksheet(
    listings.length ? worksheet_init : user.worksheet
  );
  if (loading || error) return <div>Loading...</div>;
  if (data === undefined || !data.length) return <div>Error with Query</div>;
  const colors = [
    'rgba(108, 194, 111, ',
    'rgba(202, 95, 83, ',
    'rgba(49, 164, 212, ',
    'rgba(223, 134, 83, ',
    'rgba(38, 186, 154, ',
    'rgba(186, 120, 129, ',
  ];

  if (!listings.length) {
    let temp = [...data];
    for (let i = 0; i < data.length; i++) {
      temp[i].color = colors[i % colors.length];
    }
    temp.sort(sortByCourseCode);
    setListings(temp);
  }

  let filtered_listings = [];
  listings.forEach((listing) => {
    if (
      isInWorksheet(listing.season_code, listing.crn.toString(), user.worksheet)
    )
      filtered_listings.push(listing);
  });

  let season_listings = [];
  filtered_listings.forEach((listing) => {
    if (
      listing.season_code === season &&
      isHidden(listing.season_code, listing.crn) === -1
    )
      season_listings.push(listing);
  });

  const expand_btn_size = 18;

  return (
    <div className={styles.container}>
      {/* Desktop View */}
      <div className="d-none d-md-block">
        <Row
          className={'m-4 ' + (rev_flex_direction ? 'flex-wrap-reverse' : '')}
        >
          <Col
            md={cur_expand === 'calendar' ? 12 : 9}
            className={
              styles.calendar +
              ' m-0 p-0 ' +
              (rev_flex_direction
                ? styles.calendar_hidden
                : styles.calendar_expand) +
              ' ' +
              (cur_expand === 'list' ? styles.hidden + ' ' : '') +
              (cur_expand === 'calendar' ? styles.delay : '')
            }
            onMouseEnter={() => setHoverExpand('calendar')}
            onMouseLeave={() => setHoverExpand('none')}
          >
            <WeekSchedule
              className=""
              showModal={showModal}
              courses={season_listings}
              hover_course={hover_course}
            />
            <Fade in={hover_expand === 'calendar'}>
              <div style={{ zIndex: 420 }}>
                {cur_expand === 'none' ? (
                  <FaExpandAlt
                    className={styles.expand_btn + ' ' + styles.top_right}
                    size={expand_btn_size}
                    onClick={() => {
                      setCurExpand('calendar');
                      setRevFlexDirection(false);
                    }}
                  />
                ) : (
                  <FaCompressAlt
                    className={styles.expand_btn + ' ' + styles.top_right}
                    size={expand_btn_size}
                    onClick={() => {
                      setCurExpand('none');
                      setHoverExpand('list');
                    }}
                  />
                )}
              </div>
            </Fade>
          </Col>

          <Col
            md={cur_expand === 'list' ? 12 : 3}
            className={
              styles.table +
              ' pl-4 ml-auto ' +
              (rev_flex_direction ? styles.table_expand : styles.table_hidden) +
              ' ' +
              (cur_expand === 'list' ? styles.delay + ' pr-4 ' : 'pr-0 ') +
              (cur_expand === 'calendar' ? styles.hidden : '')
            }
            onMouseEnter={() => setHoverExpand('list')}
            onMouseLeave={() => setHoverExpand('none')}
          >
            <WorksheetList
              onSeasonChange={changeSeason}
              toggleCourse={toggleCourse}
              showModal={showModal}
              courses={filtered_listings}
              season_codes={season_codes}
              cur_season={season}
              hidden_courses={hidden_courses}
              hasSeason={hasSeason}
              setHoverCourse={setHoverCourse}
            />
            <Fade in={hover_expand === 'list'}>
              <div style={{ zIndex: 420 }}>
                {cur_expand === 'none' ? (
                  <FaExpandAlt
                    className={styles.expand_btn + ' ' + styles.top_left}
                    size={expand_btn_size}
                    onClick={() => {
                      setCurExpand('list');
                      setRevFlexDirection(true);
                    }}
                  />
                ) : (
                  <FaCompressAlt
                    className={styles.expand_btn + ' ' + styles.top_left}
                    size={expand_btn_size}
                    onClick={() => {
                      setCurExpand('none');
                      setHoverExpand('calendar');
                    }}
                  />
                )}
              </div>
            </Fade>
          </Col>
        </Row>
      </div>
      {/* Mobile View */}
      <div className="d-md-none">
        <Row className={styles.accordion + ' m-0 p-3'}>
          <Col className="p-0">
            <WorksheetAccordion
              onSeasonChange={changeSeason}
              cur_season={season}
              season_codes={season_codes}
              courses={season_listings}
              hasSeason={hasSeason}
            />
          </Col>
        </Row>
      </div>
      <CourseModal
        hideModal={hideModal}
        show={course_modal[0]}
        listing={course_modal[1]}
        hasSeason={hasSeason}
      />
    </div>
  );
}

export default Worksheet;
