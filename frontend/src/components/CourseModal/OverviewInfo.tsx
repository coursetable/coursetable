import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Collapse,
  Popover,
} from 'react-bootstrap';
import type { OverlayChildren } from 'react-bootstrap/esm/Overlay';
import { HiExternalLink } from 'react-icons/hi';
import { IoIosArrowDown } from 'react-icons/io';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';

import type { CourseModalHeaderData } from './CourseModal';

import { useSearch } from '../../contexts/searchContext';
import type {
  SameCourseOrProfOfferingsQuery,
  PrereqLinkInfoQuery,
} from '../../generated/graphql-types';
import { usePrereqLinkInfoQuery } from '../../queries/graphql-queries';
import type { Weekdays } from '../../queries/graphql-types';
import { ratingColormap } from '../../utilities/constants';
import {
  abbreviateWorkdays,
  getEnrolled,
  toSeasonString,
  to12HourTime,
} from '../../utilities/course';
import { createCourseModalLink } from '../../utilities/display';
import { TextComponent, InfoPopover, LinkLikeText } from '../Typography';
import styles from './OverviewInfo.module.css';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

type CourseInfo = SameCourseOrProfOfferingsQuery['self'][0]['course'];

const profInfoPopover =
  (
    profInfo: CourseInfo['course_professors'][number]['professor'],
  ): OverlayChildren =>
  (props) => (
    <InfoPopover {...props} id="title-popover" className="d-none d-md-block">
      <Popover.Header>
        <div className="mx-auto">
          <strong>{profInfo.name}</strong>
        </div>
        <div className="mx-auto">
          <small>
            {profInfo.email ? (
              <a href={`mailto:${profInfo.email}`}>{profInfo.email}</a>
            ) : (
              <TextComponent type="secondary">N/A</TextComponent>
            )}
          </small>
        </div>
      </Popover.Header>
      <Popover.Body className={styles.profInfoBody}>
        <div className="d-flex mx-auto my-1">
          <Col md={6}>
            <div className="d-flex mx-auto mb-1">
              <strong
                className="mx-auto"
                style={{
                  color: profInfo.average_rating
                    ? ratingColormap(profInfo.average_rating)
                        .darken()
                        .saturate()
                        .css()
                    : '#b5b5b5',
                }}
              >
                {profInfo.average_rating
                  ? profInfo.average_rating.toFixed(1)
                  : 'N/A'}
              </strong>
            </div>
            <div className="d-flex mx-auto">
              <small className="mx-auto text-center fw-bold">Avg. Rating</small>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex mx-auto mb-1">
              <strong className="mx-auto">{profInfo.courses_taught}</strong>
            </div>
            <div className="d-flex mx-auto">
              <small className="mx-auto text-center fw-bold">
                Classes Taught
              </small>
            </div>
          </Col>
        </div>
      </Popover.Body>
    </InfoPopover>
  );

function Description({ course }: { readonly course: CourseInfo }) {
  const [clamped, setClamped] = useState(false);
  const [lines, setLines] = useState(8);
  return (
    <>
      <ResponsiveEllipsis
        className={styles.description}
        text={course.description || 'no description'}
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

type Segment =
  | { type: 'text'; text: string }
  | { type: 'course'; text: string; course: string };

function parsePrereqs(requirements: string | null) {
  if (!requirements) return null;
  // We don't want to match "and 223", but we want to match "math 223"
  // We want to match "CHEM 134L" but not "CPSC 223a" (CPSC 381 says this)
  const codePattern =
    /\b(?<subject>(?!and|AND)[A-Za-z&]{3,4}) ?(?<number>\d{3,4}[A-Z]?)(?!\d)/uy;
  // Prereqs often say "MATH 225 or 226" and we want to match on "226", where
  // the subject is implied (taken from the previous match)
  const partialCodePattern = /\b\d{3,4}[A-Z]?(?!\d)/uy;
  let lastSubject = '';
  const segments: Segment[] = [];
  let lastIndex = 0;
  for (let i = 0; i < requirements.length; i++) {
    codePattern.lastIndex = i;
    partialCodePattern.lastIndex = i;
    const match = codePattern.exec(requirements);
    if (!match) {
      if (!lastSubject) continue;
      const partialMatch = partialCodePattern.exec(requirements);
      if (!partialMatch) continue;
      segments.push({ type: 'text', text: requirements.slice(lastIndex, i) });
      segments.push({
        type: 'course',
        text: partialMatch[0],
        course: `${lastSubject} ${partialMatch[0]}`,
      });
      i += partialMatch[0].length;
      lastIndex = i;
      continue;
    }
    let subject = match.groups!.subject!;
    const number = match.groups!.number!;
    subject = subject.toUpperCase();
    lastSubject = subject;
    segments.push({ type: 'text', text: requirements.slice(lastIndex, i) });
    segments.push({
      type: 'course',
      text: match[0],
      course: `${subject} ${number}`,
    });
    i += match[0].length;
    lastIndex = i;
  }
  segments.push({ type: 'text', text: requirements.slice(lastIndex) });
  return segments;
}

type PrereqLinkInfo = PrereqLinkInfoQuery['listings'][number];

function Prereqs({
  course,
  season,
  onNavigation,
}: {
  readonly course: CourseInfo;
  readonly season: string;
  readonly onNavigation: (x: CourseModalHeaderData, goToEvals: boolean) => void;
}) {
  const segments = parsePrereqs(course.requirements);
  const [searchParams] = useSearchParams();
  const { data, error, loading } = usePrereqLinkInfoQuery({
    variables: {
      courseCodes:
        segments
          ?.filter(
            // TODO: remove after TS 5.5
            (s): s is Extract<Segment, { type: 'course' }> =>
              s.type === 'course',
          )
          .map((s) => s.course) ?? [],
    },
    skip: !segments,
  });
  if (!segments) return null;
  const codeToListings = new Map<string, PrereqLinkInfo[]>();
  if (data) {
    for (const l of data.listings) {
      const codeData = codeToListings.get(l.course_code) ?? [];
      codeData.push(l);
      codeToListings.set(l.course_code, codeData);
    }
    for (const listings of codeToListings.values())
      listings.sort((a, b) => b.season_code.localeCompare(a.season_code));
  }
  return (
    <div className={styles.requirements}>
      {segments.map((s, i) => {
        if (s.type === 'text') return s.text;
        const allInfo = codeToListings.get(s.course);
        // Choose the first listing that was offered *before* this one.
        // We do this instead of showing the latest:
        // - Course codes may be reused, so the latest listing may be incorrect
        // - Syllabus/description may have changed
        // - ...
        // Usually they can still navigate to the latest one from the modal,
        // so it's not a big problem
        const info =
          allInfo?.find((l) => l.season_code <= season) ?? allInfo?.[0];
        return (
          <OverlayTrigger
            key={i}
            placement="top"
            overlay={(props) => (
              <Tooltip id={`${s.course}-tooltip`} {...props}>
                {s.course}{' '}
                {info
                  ? info.course.title
                  : error
                    ? '(Error)'
                    : loading
                      ? '(Loading)'
                      : '(Not found)'}
              </Tooltip>
            )}
          >
            {info ? (
              <Link
                to={createCourseModalLink(info, searchParams)}
                onClick={() => {
                  onNavigation(info, false);
                }}
              >
                {s.text}
              </Link>
            ) : (
              <span className={styles.unavailableLink}>{s.text}</span>
            )}
          </OverlayTrigger>
        );
      })}
    </div>
  );
}

function DataField({
  name,
  value,
  tooltip,
  collapsible,
  defaultExpanded = true,
}: {
  readonly name: string;
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
  course,
  sameCourse,
}: {
  readonly course: CourseInfo;
  readonly sameCourse: SameCourseOrProfOfferingsQuery['sameCourse'];
}) {
  const pastSyllabi = useMemo(() => {
    // Remove duplicates by syllabus URL
    const courseBySyllabus = new Map<
      string,
      SameCourseOrProfOfferingsQuery['sameCourse'][number]
    >();
    for (const other of sameCourse) {
      if (other.syllabus_url && !courseBySyllabus.has(other.syllabus_url))
        courseBySyllabus.set(other.syllabus_url, other);
    }
    return [...courseBySyllabus.values()].sort(
      (a, b) =>
        b.season_code.localeCompare(a.season_code, 'en-US') ||
        parseInt(a.section, 10) - parseInt(b.section, 10),
    );
  }, [sameCourse]);

  return (
    <div className="mt-2">
      <DataField
        name="Syllabus"
        value={
          course.syllabus_url ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={course.syllabus_url}
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
            ? pastSyllabi.map((c) => (
                <a
                  key={`${c.season_code}-${c.section}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={c.syllabus_url!}
                  className="d-flex"
                >
                  {toSeasonString(c.season_code)} (section {c.section}
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

function Professors({ course }: { readonly course: CourseInfo }) {
  return (
    <DataField
      name="Professor"
      value={
        course.course_professors.length
          ? course.course_professors.map(({ professor }, index) => (
              <React.Fragment key={professor.name}>
                {index ? ' • ' : ''}
                <OverlayTrigger
                  trigger="click"
                  rootClose
                  placement="right"
                  overlay={profInfoPopover(professor)}
                >
                  <LinkLikeText>{professor.name}</LinkLikeText>
                </OverlayTrigger>
              </React.Fragment>
            ))
          : 'TBA'
      }
    />
  );
}

function TimeLocation({ course }: { readonly course: CourseInfo }) {
  const locations = new Map<string, string>();
  const times = new Map<string, Set<Weekdays>>();
  for (const [day, info] of Object.entries(course.times_by_day)) {
    for (const [startTime, endTime, location, locationURL] of info) {
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
            {abbreviateWorkdays([...days]).join('')} {timespan}
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
  onNavigation,
  data,
}: {
  readonly onNavigation: (x: CourseModalHeaderData, goToEvals: boolean) => void;
  readonly data: SameCourseOrProfOfferingsQuery;
}) {
  const { numFriends } = useSearch();
  const listing = data.self[0]!;
  const alsoTaking = [
    ...(numFriends[`${listing.season_code}${listing.crn}`] ?? []),
  ];
  const { course } = listing;
  const [enrollment, isRealData] = getEnrolled(course, 'modal');
  return (
    <>
      <Description course={course} />
      <Prereqs
        course={course}
        season={listing.season_code}
        onNavigation={onNavigation}
      />
      <Syllabus course={course} sameCourse={data.sameCourse} />
      <Professors course={course} />
      <TimeLocation course={course} />
      <DataField name="Section" value={course.section} />
      <DataField
        name="Info"
        value={
          course.course_flags.length ? (
            <ul className={styles.flagInfo}>
              {course.course_flags.map(({ flag: { flag_text: text } }) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          ) : null
        }
      />
      <DataField
        name="Enrollment"
        value={enrollment}
        tooltip={
          isRealData ? (
            <span>
              Actual number of students enrolled for this season's offering,
              sourced from evaluations data
            </span>
          ) : (
            <span>
              How many students took this class the last time it was offered
            </span>
          )
        }
      />
      <DataField name="Credits" value={course.credits} />
      <DataField name="Class Notes" value={course.classnotes} />
      <DataField name="Registrar Notes" value={course.regnotes} />
      <DataField name="Reading Period" value={course.rp_attr} />
      <DataField
        name="Final Exam"
        value={course.final_exam === 'HTBA' ? null : course.final_exam}
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
