import { useState, useEffect, useRef } from 'react';

export type Meeting = {
  days_of_week: number;
  start_time: string;
  end_time: string;
};

export type CourseWithTime = {
  crn: number;
  color: string;
  hidden: boolean;
  listing: {
    course: {
      course_meetings: Meeting[];
      // ...other properties if want to filter further
    };
  };
};

function coursesConflict(
  courseA: CourseWithTime,
  courseB: CourseWithTime,
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
        if (startA < endB && startB < endA) 
          return true;
        
      }
    }
  }
  return false;
}

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
    console.log(current);
    yield* validScheduleGenerator(courses, k, i + 1, current);
    current.pop();
  }
}

export function useEnumeration(courses: CourseWithTime[], k: number) {
  const [enumeratedCombos, setEnumeratedCombos] = useState<CourseWithTime[][]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const generatorRef = useRef<Generator<
    CourseWithTime[],
    void,
    unknown
  > | null>(null);

  useEffect(() => {
    const validCourses = courses.filter(
      (course) =>
        course.listing &&
        course.listing.course &&
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
  }, [courses, k]);

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
    if (currentIndex > 0) 
      setCurrentIndex((prev) => prev - 1);
    
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
