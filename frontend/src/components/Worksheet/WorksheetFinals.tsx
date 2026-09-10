import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCalendarWeek, FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import chroma from 'chroma-js';
import { useShallow } from 'zustand/react/shallow';

import FriendsDropdown from './FriendsDropdown';
import SeasonDropdown from './SeasonDropdown';
import WorksheetCalendarList from './WorksheetCalendarList';
import WorksheetNumDropdown from './WorksheetNumberDropdown';
import WorksheetStats from './WorksheetStats';
import { academicCalendars } from '../../config';
import type { WorksheetCourse } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import { createCourseModalLink } from '../../utilities/display';
import {
  getFinalsWeekRange,
  isWeekendDate,
  parseFinalExamDate,
  readingPeriodStart,
} from '../../utilities/finalExam';
import { SurfaceComponent } from '../Typography';

import styles from './WorksheetFinals.module.css';

const SHOW_WEEKENDS_STORAGE_KEY = 'finals-calendar-show-weekends';
const WEEKDAY_LABELS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_LABELS_WEEKDAYS_ONLY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

type FinalExamEntry = {
  course: WorksheetCourse;
  date: Date;
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatExamTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Mirrors `useEventStyle` in CalendarEvent.tsx, so hovering a course in the
// sidebar list highlights it the same way in both the Calendar and Finals
// views.
function ExamChip({
  entry,
  searchParams,
}: {
  readonly entry: FinalExamEntry;
  readonly searchParams: URLSearchParams;
}) {
  const { course, date } = entry;
  const hoverCourse = useStore((state) => state.hoverCourse);
  const isMobile = useStore((state) => state.isMobile);
  const { crn } = course.listing;
  const color = chroma(course.color);
  let backgroundColor = color.alpha(0.85).css();
  let borderColor = color.css();
  const isMatch = hoverCourse === crn;
  if (!isMobile && hoverCourse) {
    if (isMatch) {
      const emphasized = color.saturate(1);
      backgroundColor = emphasized.alpha(0.9).css();
      borderColor = emphasized.css();
    } else {
      backgroundColor = color.alpha(0.3).css();
      borderColor = color.alpha(0.3).css();
    }
  }
  const textColor =
    chroma.contrast(course.color, 'white') > 2 ? 'white' : 'black';
  return (
    <Link
      to={createCourseModalLink(course.listing, searchParams)}
      className={styles.examChip}
      style={{
        backgroundColor,
        borderColor,
        color: textColor,
        zIndex: !isMobile && isMatch ? 2 : undefined,
      }}
    >
      <strong className={styles.examChipCode}>
        {course.listing.course_code}
      </strong>
      <span className={styles.examChipTime}>{formatExamTime(date)}</span>
    </Link>
  );
}

function WorksheetFinals() {
  const [searchParams] = useSearchParams();
  const {
    courses,
    isMobile,
    isExoticWorksheet,
    viewedSeason,
    exoticWorksheet,
  } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      isMobile: state.isMobile,
      isExoticWorksheet: state.worksheetMemo.getIsExoticWorksheet(state),
      viewedSeason: state.viewedSeason,
      exoticWorksheet: state.exoticWorksheet,
    })),
  );
  const effectiveSeason = exoticWorksheet?.data.season ?? viewedSeason;
  const emptyMissingBuildingCodes = useMemo(() => new Set<string>(), []);
  const [expanded, setExpanded] = useState(false);
  const [showWeekends, setShowWeekends] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = window.localStorage.getItem(SHOW_WEEKENDS_STORAGE_KEY);
    return saved === '1' || saved === 'true';
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      SHOW_WEEKENDS_STORAGE_KEY,
      showWeekends ? '1' : '0',
    );
  }, [showWeekends]);

  const { entries, unscheduled } = useMemo(() => {
    const scheduledEntries: FinalExamEntry[] = [];
    const unscheduledCourses: WorksheetCourse[] = [];
    for (const course of courses) {
      if (course.hidden) continue;
      const date = parseFinalExamDate(course.listing.course.final_exam);
      if (date) scheduledEntries.push({ course, date });
      else unscheduledCourses.push(course);
    }
    scheduledEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
    return { entries: scheduledEntries, unscheduled: unscheduledCourses };
  }, [courses]);

  // Yale no longer schedules finals on weekends, so hide those columns by
  // default; but never hide a real scheduled weekend exam, in case that
  // changes or an older worksheet still has one.
  const hasWeekendExam = useMemo(
    () => entries.some((entry) => isWeekendDate(entry.date)),
    [entries],
  );
  const effectiveShowWeekends = showWeekends || hasWeekendExam;
  const weekdayLabels = effectiveShowWeekends
    ? WEEKDAY_LABELS_FULL
    : WEEKDAY_LABELS_WEEKDAYS_ONLY;

  const range = useMemo(() => {
    // Anchor to the day after the last day of class (start of reading
    // period) so the finals view is meaningful even before every exam has
    // been announced, and always spans the reading + exam period fully.
    const calendar = academicCalendars[effectiveSeason];
    const anchor = calendar ? readingPeriodStart(calendar.end) : undefined;
    return getFinalsWeekRange(
      entries.map((entry) => entry.date),
      anchor,
    );
  }, [entries, effectiveSeason]);

  const weeks = useMemo(() => {
    if (!range) return [];
    const days: Date[] = [];
    for (
      const cur = new Date(range.start);
      cur.getTime() <= range.end.getTime();
      cur.setDate(cur.getDate() + 1)
    ) {
      if (effectiveShowWeekends || !isWeekendDate(cur))
        days.push(new Date(cur));
    }
    const daysPerWeek = effectiveShowWeekends ? 7 : 5;
    const result: Date[][] = [];
    for (let i = 0; i < days.length; i += daysPerWeek)
      result.push(days.slice(i, i + daysPerWeek));
    return result;
  }, [range, effectiveShowWeekends]);

  const entriesByDay = useMemo(() => {
    const map = new Map<string, FinalExamEntry[]>();
    for (const entry of entries) {
      const key = entry.date.toDateString();
      const existing = map.get(key);
      if (existing) existing.push(entry);
      else map.set(key, [entry]);
    }
    return map;
  }, [entries]);

  const today = new Date();
  const FullScreenIcon = expanded ? FaCompressAlt : FaExpandAlt;
  const fullScreenLabel = expanded
    ? 'Compress finals calendar'
    : 'Expand finals calendar';
  const weekendLabel = `${showWeekends ? 'Hide' : 'Show'} weekends`;

  return (
    <div className={styles.container}>
      {isMobile && !isExoticWorksheet && (
        <div className={styles.dropdowns}>
          <WorksheetNumDropdown mobile />
          <div className="d-flex">
            <SeasonDropdown mobile />
            <FriendsDropdown mobile />
          </div>
        </div>
      )}
      <SurfaceComponent className={styles.finalsCard}>
        {!isMobile && (
          <div className={styles.finalsControls}>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="finals-fullscreen-tooltip">
                  {fullScreenLabel}
                </Tooltip>
              }
            >
              <button
                type="button"
                className={styles.controlsTrigger}
                onClick={() => setExpanded((x) => !x)}
                aria-label={fullScreenLabel}
              >
                <FullScreenIcon className={styles.triggerIcon} size={11} />
              </button>
            </OverlayTrigger>
            <div className={styles.controlsMenu}>
              <button
                type="button"
                className={clsx(
                  styles.controlBtn,
                  showWeekends && styles.controlBtnActive,
                )}
                onClick={() => setShowWeekends((x) => !x)}
                aria-label={weekendLabel}
                title={weekendLabel}
              >
                <FaCalendarWeek size={11} />
              </button>
            </div>
          </div>
        )}
        {weeks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No final exam dates found yet.</p>
            <p className="mb-0 text-muted">
              Final exam times are set by the registrar and will show up here
              once they&apos;re announced.
            </p>
          </div>
        ) : (
          <div
            className={styles.grid}
            data-export-target="finals-calendar"
            style={
              {
                '--finals-columns': weekdayLabels.length,
              } as CSSProperties
            }
          >
            <div className={styles.weekRow}>
              {weekdayLabels.map((label) => (
                <div key={label} className={styles.weekdayLabel}>
                  {label}
                </div>
              ))}
            </div>
            {weeks.map((week) => (
              <div key={week[0]!.toISOString()} className={styles.weekRow}>
                {week.map((day) => {
                  const dayEntries = entriesByDay.get(day.toDateString()) ?? [];
                  return (
                    <div
                      key={day.toISOString()}
                      className={clsx(
                        styles.dayCell,
                        isSameDay(day, today) && styles.dayCellToday,
                      )}
                    >
                      <div className={styles.dayNumber}>
                        {day.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className={styles.dayEvents}>
                        {dayEntries.map((entry) => (
                          <ExamChip
                            key={entry.course.crn}
                            entry={entry}
                            searchParams={searchParams}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        {unscheduled.length > 0 && (
          <div className={styles.unscheduled}>
            <span className={styles.unscheduledLabel}>
              No exam scheduled yet:
            </span>
            <div className={styles.unscheduledList}>
              {unscheduled.map((course) => (
                <Link
                  key={course.crn}
                  to={createCourseModalLink(course.listing, searchParams)}
                  className={styles.unscheduledChip}
                >
                  {course.listing.course_code}
                </Link>
              ))}
            </div>
          </div>
        )}
      </SurfaceComponent>
      {(isMobile || !expanded) && (
        <div className={styles.sidebar}>
          <WorksheetStats />
          <WorksheetCalendarList
            highlightBuilding={null}
            showLocation={false}
            showMissingLocationIcon={false}
            controlsMode="full"
            missingBuildingCodes={emptyMissingBuildingCodes}
            hideTooltipContext="calendar"
          />
        </div>
      )}
    </div>
  );
}

export default WorksheetFinals;
