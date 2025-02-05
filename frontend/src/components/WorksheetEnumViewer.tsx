import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { Calendar } from 'react-big-calendar';
import { useStore } from '../store';
import { localizer, getCalendarEvents } from '../utilities/calendar';
import { toRangeTime } from '../utilities/course';
import styles from './WorksheetEnumViewer.module.css';

type Meeting = {
  days_of_week: number;
  start_time: string;
  end_time: string;
};

type CourseWithTime = {
  crn: number;
  color: string;
  hidden: boolean;
  listing: {
    course: {
      course_meetings: Meeting[];
      // Other properties if want to filter further
    };
  };
};

// --- Conflict Detection ---

function coursesConflict(
  courseA: CourseWithTime,
  courseB: CourseWithTime,
): boolean {
  const meetingsA = courseA.listing.course.course_meetings;
  const meetingsB = courseB.listing.course.course_meetings;
  for (const meetingA of meetingsA) {
    for (const meetingB of meetingsB) {
      // If both meetings share any common day...
      if ((meetingA.days_of_week & meetingB.days_of_week) !== 0) {
        const startA = toRangeTime(meetingA.start_time);
        const endA = toRangeTime(meetingA.end_time);
        const startB = toRangeTime(meetingB.start_time);
        const endB = toRangeTime(meetingB.end_time);
        // Check if the time intervals overlap.
        if (startA < endB && startB < endA) 
          return true;
        
      }
    }
  }
  return false;
}

// --- Generator for Valid Combinations ---
// Recursively yields conflict‑free combinations of exactly k courses.
function* validScheduleGenerator(
  courses: CourseWithTime[],
  k: number,
  start = 0,
  current: CourseWithTime[] = [],
): Generator<CourseWithTime[], void, unknown> {
  if (current.length === k) {
    yield [...current];
    return;
  }
  for (let i = start; i < courses.length; i++) {
    let conflict = false;
    for (const selected of current) {
      if (coursesConflict(selected, courses[i])) {
        conflict = true;
        break;
      }
    }
    if (conflict) continue;
    current.push(courses[i]);
    yield* validScheduleGenerator(courses, k, i + 1, current);
    current.pop();
  }
}

// --- Component to Render Calendar for a Valid Combination ---

const ValidScheduleCalendar: React.FC<{ readonly courses: CourseWithTime[] }> = ({
  courses,
}) => {
  const { viewedSeason } = useStore((state) => ({
    viewedSeason: state.viewedSeason,
  }));

  // Generate calendar events from the current valid combination.
  const events = useMemo(() => getCalendarEvents('rbc', courses, viewedSeason), [courses, viewedSeason]);

  const { earliest, latest } = useMemo(() => {
    if (events.length === 0) {
      return {
        earliest: new Date(0, 0, 0, 8),
        latest: new Date(0, 0, 0, 18),
      };
    }
    const earliest = new Date(events[0].start);
    const latest = new Date(events[0].end);
    earliest.setMinutes(0);
    latest.setMinutes(59);
    for (const event of events) {
      if (event.start.getHours() < earliest.getHours())
        earliest.setHours(event.start.getHours());
      if (event.end.getHours() > latest.getHours())
        latest.setHours(event.end.getHours());
    }
    return { earliest, latest };
  }, [events]);

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        events={events}
        defaultView="work_week"
        views={['work_week']}
        localizer={localizer}
        min={earliest}
        max={latest}
        toolbar={false}
      />
    </div>
  );
};

const ValidScheduleViewer: React.FC = () => {
  // Retrieve raw courses from the store.
  const { courses } = useStore((state) => ({ courses: state.courses }));
  console.log('Raw courses from store:', courses);

  // Local state for the current valid combination and error messages.
  const [currentCombo, setCurrentCombo] = useState<CourseWithTime[] | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Enumeration mode state and history.
  const [enumerationMode, setEnumerationMode] = useState<boolean>(false);
  const [enumeratedCombos, setEnumeratedCombos] = useState<CourseWithTime[][]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Ref to keep track of the generator instance.
  const generatorRef = useRef<Generator<
    CourseWithTime[],
    void,
    unknown
  > | null>(null);

  // Initialize the generator and enumeration history whenever courses change.
  useEffect(() => {
    // Filter raw courses to include only those with valid meeting data.
    const validCourses: CourseWithTime[] = courses.filter(
      (course: CourseWithTime) =>
        course.listing &&
        course.listing.course &&
        Array.isArray(course.listing.course.course_meetings) &&
        course.listing.course.course_meetings.length > 0,
    );
    console.log('Valid courses:', validCourses);

    if (validCourses.length > 0) {
      generatorRef.current = validScheduleGenerator(validCourses, 4);
      const first = generatorRef.current.next();
      if (first.done) {
        setErrorMessage('No valid schedule combinations found.');
        setCurrentCombo(null);
        setEnumeratedCombos([]);
        setCurrentIndex(0);
      } else {
        setEnumeratedCombos([first.value]);
        setCurrentIndex(0);
        setCurrentCombo(first.value);
        setErrorMessage(null);
      }
    } else {
      setErrorMessage('No courses available with proper meeting data.');
      setCurrentCombo(null);
      setEnumeratedCombos([]);
      setCurrentIndex(0);
    }
  }, [courses]);

  // Handlers for next and previous navigation in enumeration mode.
  const handleNext = () => {
    if (generatorRef.current) {
      if (currentIndex < enumeratedCombos.length - 1) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        setCurrentCombo(enumeratedCombos[newIndex]);
      } else {
        const next = generatorRef.current.next();
        if (next.done) {
          setErrorMessage('No more valid combinations.');
        } else {
          const newCombos = [...enumeratedCombos, next.value];
          setEnumeratedCombos(newCombos);
          const newIndex = newCombos.length - 1;
          setCurrentIndex(newIndex);
          setCurrentCombo(next.value);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setCurrentCombo(enumeratedCombos[newIndex]);
    }
  };

  // Toggle enumeration mode on/off.
  const toggleEnumerationMode = () => {
    setEnumerationMode((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <h2>Valid Schedule Calendar</h2>
      {/* Button to toggle enumeration mode */}
      <button
        type="button"
        onClick={toggleEnumerationMode}
        className={styles.enumToggleButton}
        aria-label="Toggle Enumeration Mode"
      >
        {enumerationMode
          ? 'Disable Enumeration Mode'
          : 'Enable Enumeration Mode'}
      </button>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      {/* If enumeration mode is active, show previous/next controls above the calendar */}
      {enumerationMode && (
        <div className={styles.arrowControls}>
          <button
            type="button"
            onClick={handlePrevious}
            className={styles.prevButton}
            aria-label="Previous Combination"
            disabled={currentIndex === 0}
          >
            <FaArrowLeft />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className={styles.nextButton}
            aria-label="Next Combination"
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {currentCombo ? (
        // Render the calendar view for the current valid combination.
        <ValidScheduleCalendar courses={currentCombo} />
      ) : (
        <div>No valid combination available.</div>
      )}
    </div>
  );
};

export default ValidScheduleViewer;
