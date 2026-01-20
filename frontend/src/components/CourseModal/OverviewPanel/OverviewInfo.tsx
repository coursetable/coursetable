import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Row, Col, OverlayTrigger, Tooltip, Collapse } from 'react-bootstrap';
import { BsEyeSlash } from 'react-icons/bs';
import { HiExternalLink } from 'react-icons/hi';
import { IoIosArrowDown } from 'react-icons/io';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';

import { useModalHistory } from '../../../contexts/modalHistoryContext';
import { useSearch } from '../../../contexts/searchContext';
import type {
  CourseModalOverviewDataQuery,
  PrereqLinkInfoQuery,
} from '../../../generated/graphql-types';
import { usePrereqLinkInfoQuery } from '../../../queries/graphql-queries';
import { useStore } from '../../../store';
import { schools } from '../../../utilities/constants';
import {
  toWeekdaysDisplayString,
  getEnrolled,
  toSeasonString,
  to12HourTime,
} from '../../../utilities/course';
import {
  createCourseModalLink,
  createProfModalLink,
} from '../../../utilities/display';
import { LinkLikeText } from '../../Typography';
import type { ModalNavigationFunction } from '../CourseModal';
import styles from './OverviewInfo.module.css';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

type CourseInfo = NonNullable<CourseModalOverviewDataQuery['self']>['course'];

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
            title="Read more"
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
  readonly onNavigation: ModalNavigationFunction;
}) {
  const user = useStore((state) => state.user);
  const segments = parsePrereqs(course.requirements);
  const [searchParams] = useSearchParams();
  const { data, error, loading } = usePrereqLinkInfoQuery({
    variables: {
      courseCodes:
        segments?.filter((s) => s.type === 'course').map((s) => s.course) ?? [],
      hasEvals: Boolean(user?.hasEvals),
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
    for (const listings of codeToListings.values()) {
      listings.sort((a, b) =>
        b.course.season_code.localeCompare(a.course.season_code),
      );
    }
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
          allInfo?.find((l) => l.course.season_code <= season) ?? allInfo?.[0];
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
                  onNavigation('push', info, 'overview');
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
  readonly sameCourse: CourseModalOverviewDataQuery['sameCourse'];
}) {
  const pastSyllabi = useMemo(() => {
    // Remove duplicates by syllabus URL
    const courseBySyllabus = new Map<
      string,
      CourseModalOverviewDataQuery['sameCourse'][number]
    >();
    for (const other of sameCourse) {
      // Some courses have mistakenly put the syllabus URL in the course home
      // URL. Since 2015, no course has a home URL that's not going to Canvas.
      const otherSyllabus = other.syllabus_url ?? other.course_home_url;
      if (otherSyllabus && !courseBySyllabus.has(otherSyllabus))
        courseBySyllabus.set(otherSyllabus, other);
    }
    return [...courseBySyllabus.entries()].sort(
      ([, a], [, b]) =>
        b.season_code.localeCompare(a.season_code, 'en-US') ||
        parseInt(a.section, 10) - parseInt(b.section, 10),
    );
  }, [sameCourse]);
  const syllabusLink = course.syllabus_url ?? course.course_home_url;

  return (
    <div className="mt-2">
      <DataField
        name="Syllabus"
        value={
          syllabusLink ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={syllabusLink}
              className="d-flex"
            >
              View syllabus
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
            ? pastSyllabi.map(([link, c]) => (
                <a
                  key={`${c.season_code}-${c.section}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={link}
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
  const { navigate } = useModalHistory();
  const [searchParams] = useSearchParams();
  if (!course.course_professors.length)
    return <DataField name="Professor" value="TBA" />;

  return (
    <DataField
      name="Professor"
      value={course.course_professors.map(({ professor }, index) => (
        <React.Fragment key={professor.name}>
          {index ? ' • ' : ''}
          <Link
            to={createProfModalLink(professor.professor_id, searchParams)}
            onClick={() => {
              navigate('push', {
                type: 'professor',
                data: professor.professor_id,
              });
            }}
          >
            {professor.name}
          </Link>
        </React.Fragment>
      ))}
    />
  );
}

function TimeLocation({
  course,
  hasEvals,
}: {
  readonly course: CourseInfo;
  readonly hasEvals: boolean;
}) {
  return (
    <DataField
      name="Meetings"
      value={course.course_meetings.map((session, i) => {
        const locationTexts = [];
        if (session.location && hasEvals) {
          locationTexts.push(session.location.building.code);
          // TODO use a tooltip instead
          if (session.location.building.building_name)
            locationTexts.push(`(${session.location.building.building_name})`);
          if (session.location.room) locationTexts.push(session.location.room);
        }
        return (
          <div key={i}>
            {toWeekdaysDisplayString(session.days_of_week)}{' '}
            {to12HourTime(session.start_time)}–{to12HourTime(session.end_time)}
            {hasEvals && session.location && (
              <>
                {' '}
                at{' '}
                {session.location.building.url ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={session.location.building.url}
                  >
                    {locationTexts.join(' ')}
                    <HiExternalLink size={18} className="ms-1 my-auto" />
                  </a>
                ) : (
                  locationTexts.join(' ')
                )}
              </>
            )}
            {!hasEvals && (
              <>
                {' '}
                <OverlayTrigger
                  placement="top"
                  overlay={(props) => (
                    <Tooltip id="location-hidden-tooltip" {...props}>
                      Sign in to see location
                    </Tooltip>
                  )}
                >
                  <span>
                    <BsEyeSlash />
                  </span>
                </OverlayTrigger>
              </>
            )}
          </div>
        );
      })}
    />
  );
}

function OverviewInfo({
  onNavigation,
  listing,
  sameCourse,
}: {
  readonly onNavigation: ModalNavigationFunction;
  readonly listing: NonNullable<CourseModalOverviewDataQuery['self']>;
  readonly sameCourse: CourseModalOverviewDataQuery['sameCourse'];
}) {
  const { numFriends } = useSearch();
  const user = useStore((state) => state.user);
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
      <Syllabus course={course} sameCourse={sameCourse} />
      <Professors course={course} />
      <TimeLocation course={course} hasEvals={Boolean(user?.hasEvals)} />
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
      <DataField name="School" value={schools[listing.school]} />
      <DataField name="Class notes" value={course.classnotes} />
      <DataField name="Registrar notes" value={course.regnotes} />
      <DataField name="Reading period" value={course.rp_attr} />
      <DataField
        name="Final exam"
        value={course.final_exam === 'HTBA' ? null : course.final_exam}
      />
      <DataField
        name="Date added"
        value={
          course.time_added
            ? new Date(course.time_added as string).toLocaleDateString()
            : null
        }
        tooltip={<span>When this course was added to our catalog.</span>}
      />
      <DataField
        name="Last updated"
        value={
          course.last_updated
            ? new Date(course.last_updated as string).toLocaleDateString()
            : null
        }
        tooltip={
          <span>
            The last time the course details (e.g., syllabus, location) were
            modified.
          </span>
        }
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
