import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import type chroma from 'chroma-js';
import * as Sentry from '@sentry/react';
import { AiOutlineStar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BiBookOpen } from 'react-icons/bi';
import { FcCloseUpMode } from 'react-icons/fc';
import { IoMdSunny } from 'react-icons/io';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import clsx from 'clsx';

import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import {
  ratingColormap,
  workloadColormap,
  subjects,
} from '../../utilities/constants';
import WorksheetToggleButton from '../Worksheet/WorksheetToggleButton';
import styles from './ResultsGridItem.module.css';
import tagStyles from './ResultsItem.module.css';
import { TextComponent } from '../Typography';
import { generateRandomColor, type Listing } from '../../utilities/common';
import {
  getOverallRatings,
  getWorkloadRatings,
  getProfessorRatings,
  toSeasonString,
  isInWorksheet,
} from '../../utilities/course';
import SkillBadge from '../SkillBadge';

type RatingInfo = {
  name: 'Class' | 'Professor' | 'Workload';
  getRating?: {
    (course: Listing, usage: 'stat'): number | null;
    (course: Listing, usage: 'display'): string;
  };
  colorMap: chroma.Scale;
  Icon: React.ElementType;
};

function RatingRows({ course }: { readonly course: Listing }) {
  const { user } = useUser();
  const ratings: RatingInfo[] = [
    {
      name: 'Class',
      getRating: getOverallRatings,
      colorMap: ratingColormap,
      Icon: AiOutlineStar,
    },
    {
      name: 'Professor',
      getRating: getProfessorRatings,
      colorMap: ratingColormap,
      Icon: IoPersonOutline,
    },
    {
      name: 'Workload',
      getRating: getWorkloadRatings,
      colorMap: workloadColormap,
      Icon: BiBookOpen,
    },
  ];

  return (
    <>
      {ratings.map(({ name, getRating, colorMap, Icon }) =>
        user.hasEvals ? (
          <OverlayTrigger
            key={name}
            placement="right"
            overlay={(props) => (
              <Tooltip id={`${name}-tooltip`} {...props}>
                {name}
              </Tooltip>
            )}
          >
            <Row className="m-auto justify-content-end">
              <RatingCell
                rating={getRating!(course, 'stat')}
                colorMap={colorMap}
              >
                {getRating!(course, 'display')}
              </RatingCell>
              <div className={styles.iconContainer}>
                <Icon className={styles.icon} />
              </div>
            </Row>
          </OverlayTrigger>
        ) : (
          <Row key={name} className="m-auto justify-content-end">
            <div
              className={clsx(styles.rating, 'mr-1')}
              style={{
                backgroundColor: generateRandomColor(
                  course.crn + course.season_code + name,
                ),
                filter: 'blur(3px)',
              }}
            >
              &nbsp; {/* A number if we want */}
            </div>
            <div className={styles.iconContainer}>
              <Icon className={styles.icon} />
            </div>
          </Row>
        ),
      )}
    </>
  );
}

function RatingCell({
  rating,
  colorMap,
  children,
}: {
  readonly rating: number | null;
  readonly colorMap: chroma.Scale;
  readonly children?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(styles.rating, 'mr-1')}
      style={{
        color: rating ? colorMap(rating).darken().saturate().css() : '#cccccc',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Renders a grid item for a search result
 * @prop course data for the current course
 * @prop numCols integer that holds how many columns in grid view
 * @prop multiSeasons are we displaying courses across multiple seasons
 */

function ResultsGridItem({
  course,
  numCols,
  multiSeasons,
}: {
  readonly course: Listing;
  readonly numCols: number;
  readonly multiSeasons: boolean;
}) {
  const [, setSearchParams] = useSearchParams();
  // Bootstrap column width depending on the number of columns
  const colWidth = 12 / numCols;
  const { user } = useUser();
  const { worksheetNumber } = useWorksheet();

  // Season code for this listing
  const seasons = ['spring', 'summer', 'fall'] as const;
  const season = Number(course.season_code[5]);
  const year = course.season_code.substring(2, 4);
  // Size of season icons
  const iconSize = 13;
  // Determine the icon for this season
  const icon =
    season === 1 ? (
      <FcCloseUpMode className="my-auto" size={iconSize} />
    ) : season === 2 ? (
      <IoMdSunny color="#ffaa00" className="my-auto" size={iconSize} />
    ) : (
      <FaCanadianMapleLeaf className="my-auto" size={iconSize} />
    );

  const inWorksheet = useMemo(
    () =>
      isInWorksheet(
        course.season_code,
        course.crn,
        worksheetNumber,
        user.worksheets,
      ),
    [course.crn, course.season_code, worksheetNumber, user.worksheets],
  );

  const [subjectCode, courseCode] = course.course_code.split(' ') as [
    string,
    string,
  ];

  return (
    <Col
      md={colWidth}
      className={clsx(styles.container, 'px-2 pt-0 pb-3')}
      style={{ overflow: 'hidden' }}
    >
      {/* TODO */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        onClick={() => {
          setSearchParams((prev) => {
            prev.set('course-modal', `${course.season_code}-${course.crn}`);
            return prev;
          });
        }}
        className={clsx(
          styles.oneLine,
          styles.resultItem,
          inWorksheet && styles.inWorksheetResultItem,
          'px-3 pb-3',
        )}
        // TODO
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <Row className="m-auto">
          {/* Course Code */}
          <Col xs={multiSeasons ? 8 : 12} className="p-0">
            <Row className="mx-auto mt-3">
              <small className={styles.courseCodes}>
                {course.course_code && (
                  <>
                    <OverlayTrigger
                      placement="top"
                      overlay={(props) => {
                        const subjectName = subjects[subjectCode];
                        if (!subjectName) {
                          Sentry.captureException(
                            new Error(`Subject ${subjectCode} has no label`),
                          );
                        }
                        return (
                          <Tooltip id="button-tooltip" {...props}>
                            <small>{subjectName ?? '[unknown]'}</small>
                          </Tooltip>
                        );
                      }}
                    >
                      <span>{subjectCode}</span>
                    </OverlayTrigger>{' '}
                    {courseCode}
                  </>
                )}
                {course.section
                  ? ` ${course.section.length > 1 ? '' : '0'}${course.section}`
                  : ''}
              </small>
            </Row>
          </Col>
          {/* Season tag */}
          {multiSeasons && (
            <Col xs={4} className="p-0">
              <Row className="m-auto">
                <OverlayTrigger
                  placement="top"
                  overlay={(props) => (
                    <Tooltip id="button-tooltip" {...props}>
                      <small>{toSeasonString(course.season_code)}</small>
                    </Tooltip>
                  )}
                >
                  <div
                    className={clsx(
                      styles.seasonTag,
                      'ml-auto px-1 pb-0',
                      tagStyles[seasons[(season - 1) as 0 | 1 | 2]],
                    )}
                  >
                    <Row className="m-auto">
                      {icon}
                      <small style={{ fontWeight: 550 }}>
                        &nbsp;{`'${year}`}
                      </small>
                    </Row>
                  </div>
                </OverlayTrigger>
              </Row>
            </Col>
          )}
        </Row>
        {/* Course Title */}
        <Row className="m-auto">
          <strong className={styles.oneLine}>{course.title}</strong>
        </Row>
        <Row className="m-auto justify-content-between">
          <Col xs={7} className="p-0">
            {/* Course Professors */}
            <Row className="m-auto">
              <TextComponent
                type="secondary"
                className={clsx(styles.oneLine, styles.professors)}
              >
                {course.professor_names.length > 0
                  ? course.professor_names.join(' • ')
                  : 'Professor: TBA'}
              </TextComponent>
            </Row>
            {/* Course Times */}
            <Row className="m-auto">
              <small className={clsx(styles.oneLine, styles.smallText)}>
                <TextComponent type="secondary">
                  {course.times_summary === 'TBA'
                    ? 'Times: TBA'
                    : course.times_summary}
                </TextComponent>
              </small>
            </Row>
            {/* Course Location */}
            <Row className="m-auto">
              <small className={clsx(styles.oneLine, styles.smallText)}>
                <TextComponent type="secondary">
                  {course.locations_summary === 'TBA'
                    ? 'Location: TBA'
                    : course.locations_summary}
                </TextComponent>
              </small>
            </Row>
            {/* Course Skills and Areas */}
            <Row className="m-auto">
              <div className={tagStyles.skillsAreas}>
                {course.skills.map((skill) => (
                  <SkillBadge skill={skill} key={skill} />
                ))}
                {course.areas.map((area) => (
                  <SkillBadge skill={area} key={area} />
                ))}
                {/* Render hidden badge as a spacer if no skills/areas */}
                {course.skills.length === 0 && course.areas.length === 0 && (
                  <SkillBadge skill="Hu" hidden />
                )}
              </div>
            </Row>
          </Col>
          <Col xs={5} className="p-0 d-flex align-items-end">
            <div className="ml-auto">
              {user.hasEvals ? (
                <RatingRows course={course} />
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="blur-rating-tooltip">
                      These colors are randomly generated. Sign in to see real
                      ratings.
                    </Tooltip>
                  }
                >
                  <div>
                    <RatingRows course={course} />
                  </div>
                </OverlayTrigger>
              )}
            </div>
          </Col>
        </Row>
      </div>
      {/* Add/remove from worksheet button */}
      <div className={styles.worksheetBtn}>
        <WorksheetToggleButton
          listing={course}
          modal={false}
          inWorksheet={inWorksheet}
        />
      </div>
    </Col>
  );
}

export default ResultsGridItem;
