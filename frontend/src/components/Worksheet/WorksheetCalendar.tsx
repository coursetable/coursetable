import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useShallow } from 'zustand/react/shallow';

import CalendarEvent, { useEventStyle } from './CalendarEvent';
import { useStore } from '../../store';
import { localizer, getCalendarEvents } from '../../utilities/calendar';
import './react-big-calendar-override.css';

function WorksheetCalendar() {
  const [, setSearchParams] = useSearchParams();
  const { courses, viewedSeason } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      viewedSeason: state.viewedSeason,
    })),
  );

  const eventStyleGetter = useEventStyle();

  const { earliest, latest, parsedCourses } = useMemo(() => {
    const parsedCourses = getCalendarEvents('rbc', courses, viewedSeason);

    if (parsedCourses.length === 0) {
      return {
        earliest: new Date(0, 0, 0, 8),
        latest: new Date(0, 0, 0, 18),
        parsedCourses,
      };
    }

    const earliest = new Date(parsedCourses[0]!.start);
    const latest = new Date(parsedCourses[0]!.end);
    earliest.setMinutes(0);
    latest.setMinutes(59);

    for (const c of parsedCourses) {
      if (c.start.getHours() < earliest.getHours())
        earliest.setHours(c.start.getHours());
      if (c.end.getHours() > latest.getHours())
        latest.setHours(c.end.getHours());
    }

    // Detect overlapping events
    parsedCourses.forEach((event, index) => {
      const start = event.start.getTime();
      const end = event.end.getTime();

      let count = 1;
      for (let j = index + 1; j < parsedCourses.length; j++) {
        const other = parsedCourses[j];

        // Ensure 'other' is defined before accessing its properties
        if (!other) continue;

        const otherStart = other.start.getTime();
        const otherEnd = other.end.getTime();

        if (
          (otherStart >= start && otherStart < end) || // Overlaps in the middle
          (start >= otherStart && start < otherEnd) // Starts within another event
        ) 
          count++;
        
      }

      if (count > 2) {
        console.warn(
          `⚠️ More than 2 events overlap at ${new Date(start).toLocaleTimeString()}`,
        );
      }
    });

    return { earliest, latest, parsedCourses };
  }, [courses, viewedSeason]);

  return (
    <Calendar
      // Show Mon-Fri
      defaultView="work_week"
      views={['work_week']}
      events={parsedCourses}
      // Earliest course time or 8am if no courses
      min={earliest}
      // Latest course time or 6pm if no courses
      max={latest}
      localizer={localizer}
      toolbar={false}
      onSelectEvent={(event) => {
        setSearchParams((prev) => {
          prev.set(
            'course-modal',
            `${event.listing.course.season_code}-${event.listing.crn}`,
          );
          return prev;
        });
      }}
      components={{ event: CalendarEvent }}
      eventPropGetter={eventStyleGetter}
      tooltipAccessor={undefined}
    />
  );
}

export default WorksheetCalendar;
