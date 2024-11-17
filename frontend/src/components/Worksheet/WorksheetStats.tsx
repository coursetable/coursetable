import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Button, Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';
import chroma from 'chroma-js';
import { useWorksheet, WorksheetCourse } from '../../contexts/worksheetContext';
import { useCourseData, seasons } from '../../contexts/ferryContext';
import { useStore } from '../../store';
import { ratingColormap } from '../../utilities/constants';
import {
  getOverallRatings,
  getWorkloadRatings,
  isDiscussionSection,
  linkDataToCourses,
} from '../../utilities/course';
import SkillBadge from '../SkillBadge';
import { compressToEncodedURIComponent } from 'lz-string';

import styles from './WorksheetStats.module.css';

// const lzma = new LZMA();

function StatPill({
  colorMap,
  stat,
  children,
}: {
  readonly colorMap: chroma.Scale;
  readonly stat: number;
  readonly children: React.ReactNode;
}) {
  const theme = useStore((state) => state.theme);
  return (
    <dd
      className={styles.statPill}
      style={{
        backgroundColor: colorMap(stat)
          .alpha(theme === 'light' ? 1 : 0.75)
          .css(),
      }}
    >
      {children}
    </dd>
  );
}

const courseNumberColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([4, 6]);
const creditColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([4, 5.5]);
const workloadColormap = chroma
  .scale(['#63b37b', '#ffeb84', '#f8696b'])
  .domain([12, 20]);

const formatter = new Intl.ListFormat('en-US', {
  style: 'long',
  type: 'conjunction',
});

function NoStatsTip({
  coursesWithoutRating,
  coursesWithRating,
}: {
  readonly coursesWithoutRating: string[];
  readonly coursesWithRating: number;
}) {
  return (
    coursesWithoutRating.length > 0 && (
      <OverlayTrigger
        placement="top"
        overlay={(props) => (
          <Tooltip {...props} id="conflict-icon-button-tooltip">
            <small>
              Computed with {coursesWithRating} course
              {coursesWithRating === 1 ? '' : 's'}.{' '}
              {formatter.format(coursesWithoutRating)} ha
              {coursesWithoutRating.length > 1 ? 've' : 's'} no ratings.
            </small>
          </Tooltip>
        )}
      >
        <span>
          <MdInfoOutline className={styles.infoIcon} />
        </span>
      </OverlayTrigger>
    )
  );
}

export default function WorksheetStats() {
  const [shown, setShown] = useState(true);
  const [copied, setCopied] = useState(false);
  const [linkCourses, setLinkCourses] = useState<WorksheetCourse[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { courses, curSeason } = useWorksheet();
  const countedCourseCodes = new Set();
  let courseCnt = 0;
  let credits = 0;
  let workload = 0;
  let rating = 0;
  const skillsAreas: string[] = [];
  const coursesWithoutRating: string[] = [];
  const coursesWithoutWorkload: string[] = [];

  async function handleExport(courses: WorksheetCourse[]) {
    let wsSerial = `${curSeason}`;
    for (const { crn, listing, hidden, color } of courses) {
      const courseSerial = `${crn}_${color}_${hidden ? 't' : 'f'}`;
      if (wsSerial != '') {
        wsSerial += '|';
      }
      wsSerial += courseSerial;
    }

    if (!navigator.clipboard) {
      throw new Error("Browser don't have support for native clipboard.");
    }

    // future: LZMA compression
    //const base64: string = btoa(wsSerial);
    //const compressed = await lzma.compress(wsSerial, 9);
    //const binaryCompressed = Array.from(compressed, (byte) => String.fromCodePoint(byte+128)).join("")
    await navigator.clipboard.writeText(
      `https://localhost:3000/worksheet?ws=${compressToEncodedURIComponent(wsSerial)}`,
    );
    console.log('Copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  const {
    loading: coursesLoading,
    courses: courseData,
    error: courseLoadError,
  } = useCourseData(seasons.slice(1, 15));

  useEffect(() => {
    const data = searchParams.get('ws');
    if (!data) return;
    console.log('effect');
    const courseObjects = linkDataToCourses(courseData, curSeason, data);
    setLinkCourses(courseObjects);
    // import courses
  }, [coursesLoading]);

  for (const { listing, hidden } of linkCourses.length == 0
    ? courses
    : linkCourses) {
    const alreadyCounted = listing.course.listings.some((l) =>
      countedCourseCodes.has(l.course_code),
    );

    // Don't count in one of the following cases:
    // - Cross-listing has been counted
    // - Another section has been counted (we just randomly pick one)
    // - Is discussion section (no ratings or credits)
    // - Is hidden
    if (alreadyCounted || hidden || isDiscussionSection(listing)) continue;

    // Mark codes as counted, no double counting
    listing.course.listings.forEach((l) => {
      countedCourseCodes.add(l.course_code);
    });
    const courseRating = getOverallRatings(listing.course, 'stat');
    const courseWorkload = getWorkloadRatings(listing.course, 'stat');
    if (!courseRating) coursesWithoutRating.push(listing.course_code);
    if (!courseWorkload) coursesWithoutWorkload.push(listing.course_code);
    courseCnt++;
    credits += listing.course.credits ?? 0;
    workload += courseWorkload ?? 0;
    rating += courseRating ?? 0;
    skillsAreas.push(...listing.course.skills, ...listing.course.areas);
  }
  const coursesWithWorkload = courseCnt - coursesWithoutWorkload.length;
  const coursesWithRating = courseCnt - coursesWithoutRating.length;

  const avgRating = coursesWithRating === 0 ? 0 : rating / coursesWithRating;
  return (
    <div className={clsx(shown ? 'dropdown' : 'dropup', styles.statsContainer)}>
      <div className={styles.toggleButton}>
        <button
          type="button"
          className="dropdown-toggle"
          onClick={() => setShown(!shown)}
        >
          Summary
        </button>
      </div>
      <Collapse in={shown}>
        <div>
          <div className={styles.stats}>
            <dl>
              <div>
                <dt>Total courses</dt>
                <StatPill colorMap={courseNumberColormap} stat={courseCnt}>
                  {courseCnt}
                </StatPill>
              </div>
              <div>
                <dt>Total credits</dt>
                <StatPill colorMap={creditColormap} stat={credits}>
                  {credits}
                </StatPill>
              </div>
              <div>
                <dt>
                  Total workload
                  <NoStatsTip
                    coursesWithoutRating={coursesWithoutWorkload}
                    coursesWithRating={coursesWithWorkload}
                  />
                </dt>
                <StatPill colorMap={workloadColormap} stat={workload}>
                  {workload.toFixed(2)}
                </StatPill>
              </div>
              <div>
                <dt>
                  Average rating
                  <NoStatsTip
                    coursesWithoutRating={coursesWithoutRating}
                    coursesWithRating={coursesWithRating}
                  />
                </dt>
                <StatPill colorMap={ratingColormap} stat={avgRating}>
                  {avgRating.toFixed(2)}
                </StatPill>
              </div>
              <div className={styles.wide}>
                <dt>Skills & Areas</dt>
                <dd>
                  {skillsAreas.sort().map((skill, i) => (
                    <SkillBadge skill={skill} key={i} />
                  ))}
                </dd>
              </div>
            </dl>
            <div className={styles.spacer}></div>
            <dl>
              {searchParams.get('ws') ? (
                <div className={styles.wide}>
                  <dt>Viewing exported worksheet</dt>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setSearchParams({});
                      window.location.reload();
                    }}
                  >
                    Exit
                  </Button>
                </div>
              ) : (
                <div className={styles.wide}>
                  <dt>
                    {copied
                      ? 'Copied!'
                      : courses.length == 0
                        ? 'Nothing to export'
                        : 'Export Worksheet to URL'}
                  </dt>
                  <Button
                    variant="primary"
                    disabled={courses.length == 0}
                    onClick={() => handleExport(courses)}
                  >
                    Go
                  </Button>
                </div>
              )}
            </dl>
          </div>
        </div>
      </Collapse>
    </div>
  );
}
