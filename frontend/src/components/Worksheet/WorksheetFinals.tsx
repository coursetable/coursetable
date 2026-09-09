import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import chroma from 'chroma-js';
import { useShallow } from 'zustand/react/shallow';

import FriendsDropdown from './FriendsDropdown';
import SeasonDropdown from './SeasonDropdown';
import WorksheetNumDropdown from './WorksheetNumberDropdown';
import WorksheetStats from './WorksheetStats';
import type { WorksheetCourse } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';
import { createCourseModalLink } from '../../utilities/display';
import {
  getFinalsWeekRange,
  parseFinalExamDate,
} from '../../utilities/finalExam';
import { SurfaceComponent } from '../Typography';

import styles from './WorksheetFinals.module.css';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

function ExamChip({
  entry,
  searchParams,
}: {
  readonly entry: FinalExamEntry;
  readonly searchParams: URLSearchParams;
}) {
  const { course, date } = entry;
  const color = chroma(course.color);
  const textColor =
    chroma.contrast(course.color, 'white') > 2 ? 'white' : 'black';
  return (
    <Link
      to={createCourseModalLink(course.listing, searchParams)}
      className={styles.examChip}
      style={{
        backgroundColor: color.alpha(0.85).css(),
        borderColor: color.css(),
        color: textColor,
      }}
    >
      <span className={styles.examChipTime}>{formatExamTime(date)}</span>
      <span className={styles.examChipCode}>{course.listing.course_code}</span>
    </Link>
  );
}

function WorksheetFinals() {
  const [searchParams] = useSearchParams();
  const { courses, isMobile, isExoticWorksheet } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      isMobile: state.isMobile,
      isExoticWorksheet: state.worksheetMemo.getIsExoticWorksheet(state),
    })),
  );

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

  const range = useMemo(
    () => getFinalsWeekRange(entries.map((entry) => entry.date)),
    [entries],
  );

  const weeks = useMemo(() => {
    if (!range) return [];
    const days: Date[] = [];
    for (
      const cur = new Date(range.start);
      cur.getTime() <= range.end.getTime();
      cur.setDate(cur.getDate() + 1)
    )
      days.push(new Date(cur));
    const result: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) result.push(days.slice(i, i + 7));
    return result;
  }, [range]);

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
        {weeks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No final exam dates found yet.</p>
            <p className="mb-0 text-muted">
              Final exam times are set by the registrar and will show up here
              once they&apos;re announced.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.weekRow}>
              {WEEKDAY_LABELS.map((label) => (
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
      <div className={styles.sidebar}>
        <WorksheetStats />
      </div>
    </div>
  );
}

export default WorksheetFinals;
