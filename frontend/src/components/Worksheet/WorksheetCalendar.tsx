import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import CalendarEvent, { useEventStyle } from './CalendarEvent';
import { useWorksheet } from '../../contexts/worksheetContext';
import { localizer, getCalendarEvents } from '../../utilities/calendar';
import './react-big-calendar-override.css';

function WorksheetCalendar() {
  const [, setSearchParams] = useSearchParams();
  const { courses, curSeason } = useWorksheet();

  const eventStyleGetter = useEventStyle();

  const { earliest, latest, parsedCourses } = useMemo(() => {
    // Initialize earliest and latest class times
    const parsedCourses = getCalendarEvents('rbc', courses, curSeason);
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
    return {
      earliest,
      latest,
      parsedCourses,
    };
  }, [courses, curSeason]);

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
            `${event.listing.season_code}-${event.listing.crn}`,
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
