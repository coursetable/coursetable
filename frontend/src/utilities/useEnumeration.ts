import { useState, useEffect, useRef, useMemo } from 'react';
import type { WorksheetCourse } from '../slices/WorksheetSlice';
import { useStore } from '../store';

export type Meeting = {
  days_of_week: number;
  start_time: string;
  end_time: string;
};

function coursesConflict(
  courseA: WorksheetCourse,
  courseB: WorksheetCourse,
): boolean {
  const meetingsA = courseA.listing.course.course_meetings;
  const meetingsB = courseB.listing.course.course_meetings;
  for (const meetingA of meetingsA) {
    for (const meetingB of meetingsB) {
      if ((meetingA.days_of_week & meetingB.days_of_week) !== 0) {
        const startA = Number(meetingA.start_time.replace(':', ''));
        const endA = Number(meetingA.end_time.replace(':', ''));
        const startB = Number(meetingB.start_time.replace(':', ''));
        const endB = Number(meetingB.end_time.replace(':', ''));
        if (startA < endB && startB < endA) return true;
      }
    }
  }
  return false;
}

function* validScheduleGenerator(
  courses: WorksheetCourse[],
  k: number,
  start = 0,
  current: WorksheetCourse[] = [],
): Generator<WorksheetCourse[], void, unknown> {
  if (current.length === k) {
    yield [...current];
    return;
  }
  for (let i = start; i < courses.length; i++) {
    let conflict = false;
    for (const selected of current) {
      if (coursesConflict(selected, courses[i]!)) {
        conflict = true;
        break;
      }
    }
    if (conflict) continue;
    current.push(courses[i]!);
    console.log(current);
    yield* validScheduleGenerator(courses, k, i + 1, current);
    current.pop();
  }
}

export function useEnumeration(k: number) {
  const courses = useStore((state) => state.courses);

  // 2) Provide a fallback if `courses` is missing
  const safeCourses = useMemo(
    () => (Array.isArray(courses) ? courses : []),
    [courses],
  );
  console.log('=== Worksheet.tsx ===');
  console.log('safeCourses.length:', safeCourses.length);

  const [enumeratedCombos, setEnumeratedCombos] = useState<WorksheetCourse[][]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const generatorRef = useRef<Generator<
    WorksheetCourse[],
    void,
    unknown
  > | null>(null);

  useEffect(() => {
    const validCourses = safeCourses.filter(
      (course) =>
        Array.isArray(course.listing.course.course_meetings) &&
        course.listing.course.course_meetings.length > 0,
    );
    if (validCourses.length > 0) {
      generatorRef.current = validScheduleGenerator(validCourses, k);
      const first = generatorRef.current.next();
      if (first.done) {
        setEnumeratedCombos([]);
        setCurrentIndex(0);
      } else {
        setEnumeratedCombos([first.value]);
        setCurrentIndex(0);
      }
    } else {
      setEnumeratedCombos([]);
      setCurrentIndex(0);
    }
  }, [safeCourses, k]);

  const handleNext = () => {
    if (generatorRef.current) {
      if (currentIndex < enumeratedCombos.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        const next = generatorRef.current.next();
        if (!next.done) {
          setEnumeratedCombos((prev) => [...prev, next.value]);
          setCurrentIndex((prev) => prev + 1);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return {
    enumeratedCombos,
    currentIndex,
    totalCombos: enumeratedCombos.length,
    currentCombo:
      enumeratedCombos.length > 0 ? enumeratedCombos[currentIndex] : null,
    handleNext,
    handlePrevious,
  };
}
