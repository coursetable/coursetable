import { useMemo, useEffect, useState } from 'react';
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
import styles from './CurrentTimeIndicator.module.css';

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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const currentTimePosition = useMemo(() => {
    const dayOfWeek = currentTime.getDay();

    if (dayOfWeek < 1 || dayOfWeek > 5) return null;

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const calendarStartHour = earliest.getHours();
    const calendarEndHour = latest.getHours();

    if (currentHour < calendarStartHour || currentHour > calendarEndHour)
      return null;

    const totalMinutes = currentHour * 60 + currentMinute;
    const startMinutes = calendarStartHour * 60;
    const minutesFromStart = totalMinutes - startMinutes;

    const timeSlot = document.querySelector('.rbc-time-slot');
    // Fall back to default height if needed
    const hourHeight = timeSlot ? timeSlot.clientHeight : 40;
    const position = (minutesFromStart / 60) * hourHeight;

    return position;
  }, [currentTime, earliest, latest]);

  useEffect(() => {
    const updatePosition = () => {
      const timeContent = document.querySelector('.rbc-time-content');
      if (!timeContent) return;

      const element = timeContent as HTMLElement;
      element.classList.add(styles.timeContent || 'timeContent');

      const dayOfWeek = currentTime.getDay();
      const dayIndex = dayOfWeek - 1;

      if (currentTimePosition !== null && dayIndex >= 0 && dayIndex <= 4) {
        const timeGutter = element.querySelector('.rbc-time-gutter');
        const timeGutterWidth = timeGutter ? timeGutter.clientWidth : 60;

        const dayColumnWidth = (element.clientWidth - timeGutterWidth) / 5;
        const currentDayLeft = timeGutterWidth + dayIndex * dayColumnWidth;

        const calendarHeight = element.clientHeight;
        const totalCalendarMinutes =
          (latest.getHours() - earliest.getHours()) * 60;
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const totalMinutes = currentHour * 60 + currentMinute;
        const startMinutes = earliest.getHours() * 60;
        const minutesFromStart = totalMinutes - startMinutes;
        const accuratePosition =
          (minutesFromStart / totalCalendarMinutes) * calendarHeight;

        element.style.setProperty(
          '--current-time-position',
          `${accuratePosition}px`,
        );
        element.style.setProperty('--current-day-left', `${currentDayLeft}px`);
        element.style.setProperty('--current-day-width', `${dayColumnWidth}px`);
        element.style.setProperty('--current-time-visible', '1');
      } else {
        element.style.setProperty('--current-time-position', '0px');
        element.style.setProperty('--current-day-left', '0px');
        element.style.setProperty('--current-day-width', '0px');
        element.style.setProperty('--current-time-visible', '0');
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [currentTimePosition, currentTime, earliest, latest]);

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
