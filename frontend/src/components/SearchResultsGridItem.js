import React, { useState, useEffect } from 'react';
import { Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  ratingColormap,
  workloadColormap,
  skillsAreasColors,
} from '../queries/Constants.js';
import chroma from 'chroma-js';

import WorksheetToggleButton from './WorksheetToggleButton';
import CourseConflictIcon from './CourseConflictIcon';
import styles from './SearchResultsGridItem.module.css';
import tag_styles from './SearchResultsItem.module.css';
import { FcCloseUpMode, FcReading } from 'react-icons/fc';
import { AiFillStar } from 'react-icons/ai';
import { IoMdSunny } from 'react-icons/io';
import { FaCanadianMapleLeaf, FaAppleAlt } from 'react-icons/fa';

const SearchResultsGridItem = ({
  course,
  isMobile,
  showModal,
  num_cols,
  multiSeasons,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted]);
  let key = 0;

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <small>
        {seasons[season - 1].charAt(0).toUpperCase() +
          seasons[season - 1].slice(1) +
          ' ' +
          season_code.substr(0, 4)}
      </small>
    </Tooltip>
  );

  const class_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Class</span>
    </Tooltip>
  );

  const prof_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Professor</span>
    </Tooltip>
  );

  const workload_tooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span>Workload</span>
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
          showModal(course);
        }}
        className={styles.one_line + ' ' + styles.item_container + ' px-3 pb-3'}
        tabIndex="0"
      >
        <Row className="m-auto">
          <Col xs={multiSeasons ? 8 : 12} className="p-0">
            <Row className="mx-auto mt-3">
              <small className={styles.one_line + ' ' + styles.course_codes}>
                {course.course_code ? course.course_code : ''}
              </small>
            </Row>
          </Col>
          {multiSeasons && (
            <Col xs={4} className="p-0">
              <Row className="m-auto">
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 500, hide: 250 }}
                  overlay={renderTooltip}
                >
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
                </OverlayTrigger>
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
        <Row className="m-auto justify-content-between">
          <Col xs={7} className="p-0">
            <Row className="m-auto">
              <span className={styles.one_line + ' ' + styles.professors}>
                {course.professor_names.length > 0
                  ? course.professor_names.join(' • ')
                  : 'Professor: TBA'}
              </span>
            </Row>
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
                      color: skillsAreasColors[skill],
                      backgroundColor: chroma(skillsAreasColors[skill])
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
                      color: skillsAreasColors[area],
                      backgroundColor: chroma(skillsAreasColors[area])
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
                      color: skillsAreasColors['Hu'],
                      backgroundColor: chroma(skillsAreasColors['Hu'])
                        .alpha(0.16)
                        .css(),
                      opacity: 0,
                    }}
                  >
                    {'Hu'}
                  </Badge>
                )}
              </div>
            </Row>
          </Col>
          <Col xs="auto" className="p-0 d-flex align-items-end">
            <div>
              <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 250 }}
                overlay={class_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    className={styles.rating + ' mr-1'}
                    style={{
                      color: course.average_rating
                        ? ratingColormap(course.average_rating)
                            .darken()
                            .saturate()
                        : '#cccccc',
                    }}
                  >
                    {course.average_rating
                      ? course.average_rating.toFixed(RATINGS_PRECISION)
                      : 'N/A'}
                  </div>
                  <AiFillStar color="#fac000" className="my-auto" />
                </Row>
              </OverlayTrigger>
              <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 250 }}
                overlay={prof_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    className={styles.rating + ' mr-1'}
                    style={{
                      color: course.professor_avg_rating
                        ? ratingColormap(course.professor_avg_rating)
                            .darken()
                            .saturate()
                        : '#cccccc',
                    }}
                  >
                    {course.professor_avg_rating
                      ? course.professor_avg_rating
                      : 'N/A'}
                  </div>
                  <FaAppleAlt color="#fa6e6e" className="my-auto" />
                </Row>
              </OverlayTrigger>
              <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 250 }}
                overlay={workload_tooltip}
              >
                <Row className="m-auto justify-content-end">
                  <div
                    className={styles.rating + ' mr-1'}
                    style={{
                      color: course.average_workload
                        ? workloadColormap(course.average_workload)
                            .darken()
                            .saturate()
                        : '#cccccc',
                    }}
                  >
                    {course.average_workload
                      ? course.average_workload.toFixed(RATINGS_PRECISION)
                      : 'N/A'}
                  </div>
                  <FcReading className="my-auto" />
                </Row>
              </OverlayTrigger>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.worksheet_btn}>
        {
          <WorksheetToggleButton
            alwaysRed={false}
            crn={course.crn}
            season_code={course.season_code}
            modal={false}
            isMobile={isMobile}
          />
        }
      </div>
      {mounted && (
        <div className={styles.conflict_error}>
          <CourseConflictIcon course={course} />
        </div>
      )}
    </Col>
  );
};

export default SearchResultsGridItem;
