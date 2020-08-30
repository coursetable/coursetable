import React, { useState, useEffect } from 'react';

import { FetchWorksheet } from '../queries/GetWorksheetListings';
import { Row, Col, Fade } from 'react-bootstrap';
import WeekSchedule from '../components/WeekSchedule';
import WorksheetList from '../components/WorksheetList';
import WorksheetAccordion from '../components/WorksheetAccordion';
import WorksheetExpandedList from '../components/WorksheetExpandedList';
import WorksheetSettingsDropdown from '../components/WorksheetSettingsDropdown';
import CourseModal from '../components/CourseModal';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';

import styles from './Worksheet.module.css';

import { useUser } from '../user';
import { isInWorksheet } from '../utilities';
import NoCoursesFound from '../images/no_courses_found.svg';

function Worksheet() {
  const { user } = useUser();
  const [fb_person, setFbPerson] = useState('me');
  const cur_worksheet =
    fb_person === 'me'
      ? user.worksheet
      : user.fbWorksheets.worksheets[fb_person];
  let season_codes = [];
  const updateRecentSeason = (populate_season_codes, season_code = null) => {
    let recentSeason = '200903';
    if (cur_worksheet) {
      cur_worksheet.forEach((szn) => {
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
  const [init_worksheet, setInitWorksheet] = useState(cur_worksheet);
  const [course_modal, setCourseModal] = useState([false, '']);
  const [hidden_courses, setHiddenCourses] = useState([]);
  const [hover_course, setHoverCourse] = useState();
  const [hover_expand, setHoverExpand] = useState('none');
  const [cur_expand, setCurExpand] = useState('none');
  const [rev_flex_direction, setRevFlexDirection] = useState(false);
  const [start_fade, setStartFade] = useState(false);
  const [end_fade, setEndFade] = useState(false);

  useEffect(() => {
    setListings([]);
    setInitWorksheet(cur_worksheet);
  }, [fb_person]);

  if (cur_worksheet == null) return <div>Please Login</div>;

  const changeSeason = (season_code) => {
    setSeason(season_code);
  };

  const hasSeason = (season_code, crn) => {
    if (season_code !== season) return;
    for (let i = 0; i < cur_worksheet.length; i++) {
      if (
        cur_worksheet[i][0] === season &&
        cur_worksheet[i][1] !== crn.toString()
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

  const { loading, error, data } = FetchWorksheet(init_worksheet);
  if (cur_worksheet.length === 0)
    return (
      <div style={{ height: '93vh', width: '100vw' }} className="d-flex">
        <div className="text-center m-auto">
          <img
            alt="No courses found."
            className="py-5"
            src={NoCoursesFound}
            style={{ width: '25%' }}
          ></img>
          <h3>No courses found</h3>
          <div>Please add courses to your worksheet</div>
        </div>
      </div>
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
      isInWorksheet(listing.season_code, listing.crn.toString(), cur_worksheet)
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
            onTransitionEnd={(e) => {
              // console.log(e.propertyName);
              if (
                e.propertyName === 'transform' &&
                !start_fade &&
                cur_expand === 'list'
              )
                setStartFade(true);
            }}
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
            onTransitionEnd={(e) => {
              // console.log(e.propertyName);
              if (
                e.propertyName === 'flex-basis' &&
                !end_fade &&
                cur_expand === 'list'
              )
                setEndFade(true);
            }}
          >
            <Fade in={start_fade}>
              <div style={{ display: start_fade ? '' : 'none' }}>
                <WorksheetExpandedList
                  courses={filtered_listings}
                  showModal={showModal}
                  end_fade={end_fade}
                  cur_season={season}
                  season_codes={season_codes}
                  onSeasonChange={changeSeason}
                  setFbPerson={setFbPerson}
                  fb_person={fb_person}
                  hasSeason={hasSeason}
                />
              </div>
            </Fade>
            <Fade in={!start_fade}>
              <div style={{ display: !start_fade ? '' : 'none' }}>
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
              </div>
            </Fade>

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
                      if (start_fade === true) setStartFade(false);
                      if (end_fade === true) setEndFade(false);
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
              showModal={showModal}
              setFbPerson={setFbPerson}
              cur_person={fb_person}
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
      {cur_expand !== 'list' && (
        <div className="d-none d-md-block">
          <div className={styles.settings_dropdown}>
            <WorksheetSettingsDropdown
              cur_season={season}
              season_codes={season_codes}
              onSeasonChange={changeSeason}
              setFbPerson={setFbPerson}
              cur_person={fb_person}
              icon_size={25}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Worksheet;
