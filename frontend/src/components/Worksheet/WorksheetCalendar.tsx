import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useShallow } from 'zustand/react/shallow';

import CalendarEvent, { useEventStyle } from './CalendarEvent';
import {
  ColorPickerModal,
  WorksheetMoveModal,
} from './WorksheetItemActionsButton';
import { useStore } from '../../store';
import { localizer, getCalendarEvents } from '../../utilities/calendar';
import './react-big-calendar-override.css';

function WorksheetCalendar() {
  const [, setSearchParams] = useSearchParams();
  const {
    courses,
    viewedSeason,
    setOpenColorPickerEvent,
    setOpenWorksheetMoveEvent,
  } = useStore(
    useShallow((state) => ({
      courses: state.courses,
      viewedSeason: state.viewedSeason,
      setOpenColorPickerEvent: state.setOpenColorPickerEvent,
      setOpenWorksheetMoveEvent: state.setOpenWorksheetMoveEvent,
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

    return { earliest, latest, parsedCourses };
  }, [courses, viewedSeason]);

  return (
    <>
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
        components={{
          event: (event) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <CalendarEvent {...event} />
            </div>
          ),
        }}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={undefined}
      />

      <ColorPickerModal onClose={() => setOpenColorPickerEvent(null)} />
      <WorksheetMoveModal onClose={() => setOpenWorksheetMoveEvent(null)} />
    </>
  );
}

export default WorksheetCalendar;
