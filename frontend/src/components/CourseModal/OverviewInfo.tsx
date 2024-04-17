import React, { useMemo, useState } from 'react';
import {
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Collapse,
  Popover,
} from 'react-bootstrap';
import type { OverlayChildren } from 'react-bootstrap/esm/Overlay';
import * as Sentry from '@sentry/react';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { IoIosArrowDown } from 'react-icons/io';
import { HiExternalLink } from 'react-icons/hi';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

import type { RelatedListingInfo } from './CourseModalOverview';

import { CUR_SEASON } from '../../config';
import { useSearch } from '../../contexts/searchContext';
import { TextComponent, InfoPopover, LinkLikeText } from '../Typography';
import {
  getEnrolled,
  toSeasonString,
  to12HourTime,
} from '../../utilities/course';
import { ratingColormap } from '../../utilities/constants';
import type { SameCourseOrProfOfferingsQuery } from '../../generated/graphql';
import type { Weekdays, Listing } from '../../utilities/common';
import styles from './OverviewInfo.module.css';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

type ProfInfo = {
  email: string;
  totalRating: number;
  numCourses: number;
};

const profInfoPopover =
  (profName: string, profInfo: ProfInfo | undefined): OverlayChildren =>
  (props) => (
    <InfoPopover {...props} id="title-popover" className="d-none d-md-block">
      <Popover.Header>
        <div className="mx-auto">
          <strong>{profName}</strong>
        </div>
        <div className="mx-auto">
          <small>
            {profInfo?.email ? (
              <a href={`mailto:${profInfo.email}`}>{profInfo.email}</a>
            ) : (
              <TextComponent type="secondary">N/A</TextComponent>
            )}
          </small>
        </div>
      </Popover.Header>
      <Popover.Body style={{ width: '274px' }}>
        <div className="d-flex mx-auto my-1">
          <Col md={6}>
            <div className="d-flex mx-auto mb-1">
              <strong
                className="mx-auto"
                style={{
                  color: profInfo?.numCourses
                    ? ratingColormap(profInfo.totalRating / profInfo.numCourses)
                        .darken()
                        .saturate()
                        .css()
                    : '#b5b5b5',
                }}
              >
                {
                  // Get average rating
                  profInfo?.numCourses
                    ? (profInfo.totalRating / profInfo.numCourses).toFixed(1)
                    : 'N/A'
                }
              </strong>
            </div>
            <div className="d-flex mx-auto">
              <small className="mx-auto text-center fw-bold">Avg. Rating</small>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex mx-auto mb-1">
              <strong className="mx-auto">
                {profInfo?.numCourses ?? '[unknown]'}
              </strong>
            </div>
            <div className="d-flex mx-auto">
              <small className="mx-auto text-center  fw-bold">
                Classes Taught
              </small>
            </div>
          </Col>
        </div>
      </Popover.Body>
    </InfoPopover>
  );

function Description({ listing }: { readonly listing: Listing }) {
  const [clamped, setClamped] = useState(false);
  const [lines, setLines] = useState(8);
  return (
    <>
      <ResponsiveEllipsis
        className={styles.description}
        text={listing.description ? listing.description : 'no description'}
        maxLine={lines}
        basedOn="words"
        onReflow={(rleState) => setClamped(rleState.clamped)}
      />
      {clamped && (
        <div className="d-flex justify-content-center">
          <LinkLikeText
            onClick={() => {
              setLines(100);
            }}
            title="Read More"
          >
            <IoIosArrowDown size={20} />
          </LinkLikeText>
        </div>
      )}
    </>
  );
}

function DataField({
  name,
  value,
  tooltip,
  collapsible,
  defaultExpanded = true,
}: {
  readonly name: React.ReactNode;
  readonly value: React.ReactNode;
  readonly tooltip?: React.ReactNode;
  readonly collapsible?: true;
  readonly defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  if (value === null) return null;
  const content = (
    <Row className="m-auto py-2">
      <Col sm={4} xs={5} className="px-0">
        <span className={styles.labelBubble}>
          {collapsible ? (
            <button
              type="button"
              className={styles.toggleBubble}
              onClick={() => setExpanded(!expanded)}
            >
              {name}{' '}
              {expanded ? (
                <MdExpandLess size={18} className="my-auto" />
              ) : (
                <MdExpandMore size={18} className="my-auto" />
              )}
            </button>
          ) : (
            name
          )}
        </span>
      </Col>
      <Col sm={8} xs={7} className={styles.metadata}>
        {collapsible ? (
          <Collapse in={expanded}>
            <div>{value}</div>
          </Collapse>
        ) : (
          value
        )}
      </Col>
    </Row>
  );
  if (!tooltip) return content;
  return (
    <OverlayTrigger
      placement="top"
      overlay={(props) => (
        <Tooltip id={`${name}-tooltip`} {...props}>
          {tooltip}
        </Tooltip>
      )}
    >
      {content}
    </OverlayTrigger>
  );
}

function Syllabus({
  data,
  listing,
}: {
  readonly data: SameCourseOrProfOfferingsQuery | undefined;
  readonly listing: Listing;
}) {
  const pastSyllabi = useMemo(() => {
    if (!data) return [];
    // Remove duplicates by syllabus URL
    const courseBySyllabus = new Map<string, RelatedListingInfo>();
    for (const course of data.computed_listing_info) {
      if (
        course.same_course_id !== listing.same_course_id ||
        !course.syllabus_url
      )
        continue;
      if (!courseBySyllabus.has(course.syllabus_url))
        courseBySyllabus.set(course.syllabus_url, course as RelatedListingInfo);
    }
    return [...courseBySyllabus.values()].sort(
      (a, b) =>
        b.season_code.localeCompare(a.season_code, 'en-US') ||
        parseInt(a.section, 10) - parseInt(b.section, 10),
    );
  }, [data, listing.same_course_id]);

  return (
    <div className="mt-2">
      <DataField
        name="Syllabus"
        value={
          listing.syllabus_url ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={listing.syllabus_url}
              className="d-flex"
            >
              View Syllabus
              <HiExternalLink size={18} className="ms-1 my-auto" />
            </a>
          ) : (
            'N/A'
          )
        }
      />
      <DataField
        name={`Past syllabi (${pastSyllabi.length})`}
        value={
          pastSyllabi.length
            ? pastSyllabi.map((course) => (
                <a
                  key={`${course.season_code}-${course.section}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={course.syllabus_url!}
                  className="d-flex"
                >
                  {toSeasonString(course.season_code)} (section {course.section}
                  )
                  <HiExternalLink size={18} className="ms-1 my-auto" />
                </a>
              ))
            : null
        }
        collapsible
        defaultExpanded={pastSyllabi.length < 8}
      />
    </div>
  );
}

function Professors({
  data,
  listing,
}: {
  readonly data: SameCourseOrProfOfferingsQuery | undefined;
  readonly listing: Listing;
}) {
  const profInfo = useMemo(() => {
    const profInfo = new Map(
      listing.professor_names.map((prof): [string, ProfInfo] => [
        prof,
        { numCourses: 0, totalRating: 0, email: '' },
      ]),
    );
    // Only count cross-listed courses once per season
    const countedCourses = new Set<string>();
    if (!data) return profInfo;
    for (const season of data.computed_listing_info as RelatedListingInfo[]) {
      if (countedCourses.has(`${season.season_code}-${season.course_code}`))
        continue;
      if (!season.professor_info) continue;
      season.professor_info.forEach((prof) => {
        if (profInfo.has(prof.name)) {
          const dict = profInfo.get(prof.name)!;
          dict.numCourses++;
          dict.totalRating += prof.average_rating;
          dict.email = prof.email;
          season.all_course_codes.forEach((c) => {
            countedCourses.add(`${season.season_code}-${c}`);
          });
        }
      });
    }
    return profInfo;
  }, [data, listing]);

  return (
    <DataField
      name="Professor"
      value={
        listing.professor_names.length
          ? listing.professor_names.map((prof, index) => (
              <React.Fragment key={prof}>
                {index ? ' • ' : ''}
                <OverlayTrigger
                  trigger="click"
                  rootClose
                  placement="right"
                  overlay={profInfoPopover(prof, profInfo.get(prof))}
                >
                  <LinkLikeText>{prof}</LinkLikeText>
                </OverlayTrigger>
              </React.Fragment>
            ))
          : 'TBA'
      }
    />
  );
}

function TimeLocation({ listing }: { readonly listing: Listing }) {
  const locations = new Map<string, string>();
  const times = new Map<string, Set<Weekdays>>();
  for (const [day, info] of Object.entries(listing.times_by_day)) {
    for (const [startTime, endTime, location, locationURL] of info) {
      if (locations.has(location) && locations.get(location) !== locationURL) {
        Sentry.captureException(
          new Error(
            `${listing.course_code} has duplicate location ${location} with different URLs`,
          ),
        );
      }
      locations.set(location, locationURL);
      const timespan = `${to12HourTime(startTime)}-${to12HourTime(endTime)}`;
      if (!times.has(timespan)) times.set(timespan, new Set());

      // Note! Some classes have multiple places at the same time, particularly
      // if one is "online". Avoid duplicates.
      // See for example: CDE 567, Spring 2023
      times.get(timespan)!.add(day as Weekdays);
    }
  }
  return (
    <>
      <DataField
        name="Time"
        value={[...times.entries()].map(([timespan, days]) => (
          <div key={timespan}>
            {[...days]
              .map((d) =>
                ['Thursday', 'Saturday', 'Sunday'].includes(d)
                  ? d.slice(0, 2)
                  : d[0],
              )
              .join('')}{' '}
            {timespan}
          </div>
        ))}
      />
      <DataField
        name="Location"
        value={[...locations.entries()].map(([location, locationURL]) => (
          <div key={location}>
            {locationURL ? (
              <a target="_blank" rel="noopener noreferrer" href={locationURL}>
                {location}
                <HiExternalLink size={18} className="ms-1 my-auto" />
              </a>
            ) : (
              location
            )}
          </div>
        ))}
      />
    </>
  );
}

function OverviewInfo({
  listing,
  data,
}: {
  readonly listing: Listing;
  readonly data: SameCourseOrProfOfferingsQuery | undefined;
}) {
  const { numFriends } = useSearch();
  const alsoTaking = [
    ...(numFriends[`${listing.season_code}${listing.crn}`] ?? []),
  ];
  return (
    <>
      <Description listing={listing} />
      {listing.requirements && (
        <div className={styles.requirements}>{listing.requirements}</div>
      )}
      <Syllabus data={data} listing={listing} />
      <Professors data={data} listing={listing} />
      <TimeLocation listing={listing} />
      <DataField name="Section" value={listing.section} />
      <DataField
        name="Info"
        value={
          listing.flag_info.length ? (
            <ul className={styles.flagInfo}>
              {listing.flag_info.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          ) : null
        }
      />
      <DataField
        name="Enrollment"
        value={getEnrolled(listing, 'modal')}
        tooltip={
          CUR_SEASON === listing.season_code ? (
            <span>
              Class Enrollment
              <br />
              (how many students took this class the last time it was offered)
            </span>
          ) : (
            <span>
              Previous Class Enrollment
              <br />
              (based on the most recent past instance of this course)
            </span>
          )
        }
      />
      <DataField name="Credits" value={listing.credits} />
      <DataField name="Class Notes" value={listing.classnotes} />
      <DataField name="Registrar Notes" value={listing.regnotes} />
      <DataField name="Reading Period" value={listing.rp_attr} />
      <DataField
        name="Final Exam"
        value={listing.final_exam === 'HTBA' ? null : listing.final_exam}
      />
      <DataField
        name="Friends"
        value={
          alsoTaking.length ? (
            <ul className={styles.friendsList}>
              {alsoTaking.map((friend, index) => (
                <li key={index}>
                  {friend + (index === alsoTaking.length - 1 ? '' : ',')}
                </li>
              ))}
            </ul>
          ) : null
        }
      />
    </>
  );
}

export default OverviewInfo;
