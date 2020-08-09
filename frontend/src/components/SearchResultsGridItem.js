import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Badge,
  OverlayTrigger,
  Tooltip,
  Fade,
} from 'react-bootstrap';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants.js';
import chroma from 'chroma-js';

import WorksheetToggleButton from './WorksheetToggleButton';
import styles from './SearchResultsGridItem.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { FcCloseUpMode, FcReading } from 'react-icons/fc';
import { AiFillStar } from 'react-icons/ai';
import { IoMdSunny } from 'react-icons/io';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';
import { useUser } from '../user';
import { FetchWorksheet } from '../queries/GetWorksheetListings';
import { isInWorksheet, checkConflict, unflattenTimes } from '../utilities';

const SearchResultsGridItem = ({
  course,
  isMobile,
  setShowModal,
  setModalCourse,
  executeGetCourseModal,
  num_cols,
  multi_seasons,
}) => {
  const RATINGS_PRECISION = 1;
  const col_width = 12 / num_cols;
  const season_code = course.season_code;
  const season = season_code[5];
  const year = season_code.substr(2, 2);
  const icon_size = 13;
  const seasons = ['spring', 'summer', 'fall'];
  const icon =
    season === '1' ? (
      <FcCloseUpMode className="my-auto" size={icon_size} />
    ) : season === '2' ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={icon_size} />
    ) : (
      <FaCanadianMapleLeaf
        color="#9c0000"
        className="my-auto"
        size={icon_size}
      />
    );
  let key = 0;

  const { user } = useUser();
  const [inWorksheet, setInWorksheet] = useState(
    isInWorksheet(
      course.season_code,
      course['course.listings'][0].crn.toString(),
      user.worksheet
    )
  );
  if (user.worksheet) {
    var { data } = FetchWorksheet(user.worksheet);
  }

  const update = isInWorksheet(
    course.season_code,
    course['course.listings'][0].crn.toString(),
    user.worksheet
  );
  if (inWorksheet !== update) setInWorksheet(update);

  const [conflict, setConflict] = useState(false);
  const times = unflattenTimes(course);

  useEffect(() => {
    const times = unflattenTimes(course);
    if (!data || !times) return;
    if (times === 'TBA' || checkConflict(data, course, times)) {
      setConflict(true);
      return;
    }
    setConflict(false);
  }, [data ? data : []]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small style={{ fontWeight: 500 }}>
        {times === 'TBA' ? 'Invalid Course Time' : 'Scheduling Conflict'}
      </small>
    </Tooltip>
  );

  return (
    <Col
      md={col_width}
      className={styles.container + ' px-2 pt-0 pb-3'}
      style={{ overflow: 'hidden' }}
    >
      <div
        onClick={() => {
          executeGetCourseModal({
            variables: {
              crn: course['course.listings'][0]['crn'],
              season_code: course['season_code'],
            },
          });
          setShowModal(true);
          setModalCourse(course);
        }}
        className={styles.one_line + ' ' + styles.item_container + ' px-3 pb-3'}
        tabIndex="0"
      >
        <Row className="m-auto">
          <Col xs={multi_seasons ? 8 : 12} className="p-0">
            <Row className="mx-auto mt-3">
              <small className={styles.one_line + ' ' + styles.course_codes}>
                {course.course_codes ? course.course_codes.join(' • ') : ''}
              </small>
            </Row>
          </Col>
          {multi_seasons && (
            <Col xs={4} className="p-0">
              <Row className="m-auto">
                <div
                  className={
                    styles.season_tag +
                    ' ml-auto px-1 pb-0 ' +
                    styles[seasons[parseInt(season) - 1]]
                  }
                >
                  <Row className="m-auto">
                    {icon}
                    <small style={{ fontWeight: 550 }}>
                      &nbsp;{"'" + year}
                    </small>
                  </Row>
                </div>
              </Row>
            </Col>
          )}
        </Row>
        <Row className="m-auto">
          <strong className={styles.one_line}>
            {course.title.length > 32
              ? course.title.slice(0, 29) + '...'
              : course.title}
          </strong>
        </Row>
        <Row className="m-auto">
          <span className={styles.one_line + ' ' + styles.professors}>
            {course.professor_names.length > 0
              ? course.professor_names.join(' • ')
              : 'Professor: TBA'}
          </span>
        </Row>
        <Row className="m-auto justify-content-between">
          <Col xs={7} className="p-0">
            <Row className="m-auto">
              <small className={styles.one_line + ' ' + styles.small_text}>
                {course.times_summary === 'TBA'
                  ? 'Times: TBA'
                  : course.times_summary}
              </small>
            </Row>
            <Row className="m-auto">
              <small className={styles.one_line + ' ' + styles.small_text}>
                {course.locations_summary === 'TBA'
                  ? 'Location: TBA'
                  : course.locations_summary}
              </small>
            </Row>
            <Row className="m-auto">
              <div className={tag_styles.skills_areas}>
                {course.skills.map((skill) => (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag}
                    key={key++}
                    style={{
                      color: skillsAreasColors[skill.toUpperCase()],
                      backgroundColor: chroma(
                        skillsAreasColors[skill.toUpperCase()]
                      )
                        .alpha(0.16)
                        .css(),
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
                {course.areas.map((area) => (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag}
                    key={key++}
                    style={{
                      color: skillsAreasColors[area.toUpperCase()],
                      backgroundColor: chroma(
                        skillsAreasColors[area.toUpperCase()]
                      )
                        .alpha(0.16)
                        .css(),
                    }}
                  >
                    {area}
                  </Badge>
                ))}
                {course.skills.length === 0 && course.areas.length === 0 && (
                  <Badge
                    variant="secondary"
                    className={tag_styles.tag}
                    key={key++}
                    style={{
                      color: skillsAreasColors['HU'],
                      backgroundColor: chroma(skillsAreasColors['HU'])
                        .alpha(0.16)
                        .css(),
                      opacity: 0,
                    }}
                  >
                    {'HU'}
                  </Badge>
                )}
              </div>
            </Row>
          </Col>
          <Col xs="auto" className="p-0 d-flex align-items-end">
            <div>
              <Row className="m-auto justify-content-end">
                <div
                  className={styles.rating + ' mr-1'}
                  style={{
                    color: course.average_rating
                      ? ratingColormap(course.average_rating)
                      : 'black',
                  }}
                >
                  {course.average_rating
                    ? course.average_rating.toFixed(RATINGS_PRECISION)
                    : 'N/A'}
                </div>
                <AiFillStar color="#fac000" className="my-auto" />
              </Row>
              <Row className="m-auto justify-content-end">
                <div
                  className={styles.rating + ' mr-1'}
                  style={{
                    color: course.average_workload
                      ? workloadColormap(course.average_workload)
                      : 'black',
                  }}
                >
                  {course.average_workload
                    ? course.average_workload.toFixed(RATINGS_PRECISION)
                    : 'N/A'}
                </div>
                <FcReading className="my-auto" />
              </Row>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.worksheet_btn}>
        {
          <WorksheetToggleButton
            alwaysRed={false}
            crn={course['course.listings'][0].crn}
            season_code={course.season_code}
            modal={false}
            isMobile={isMobile}
            times={unflattenTimes(course)}
          />
        }
      </div>

      <Fade in={!inWorksheet && conflict}>
        <div className={styles.conflict_error}>
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 250 }}
            overlay={renderTooltip}
          >
            <MdErrorOutline color="#fc4103" />
          </OverlayTrigger>
        </div>
      </Fade>
    </Col>
  );
};

export default SearchResultsGridItem;
