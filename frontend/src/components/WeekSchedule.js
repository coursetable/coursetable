import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import './WeekSchedule.css';
import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar } from 'react-big-calendar';
import styled from 'styled-components';
import CalendarEvent from './CalendarEvent';

const localizer = momentLocalizer(moment);

// Calendar for worksheet
const StyledCalendar = styled(Calendar)`
  &.rbc-calendar {
    .rbc-time-view {
      .rbc-time-header {
        .rbc-time-header-content {
          border-color: ${({ theme }) => theme.border};
          transition: border 0.2s linear;
          .rbc-time-header-cell {
            .rbc-header {
              border-color: ${({ theme }) => theme.border};
              transition: border 0.2s linear;
            }
          }
        }
      }
      .rbc-time-content {
        border-color: ${({ theme }) => theme.border};
        transition: border 0.2s linear;
        .rbc-time-gutter {
          .rbc-timeslot-group {
            border-color: ${({ theme }) => theme.border};
            transition: border 0.2s linear;
          }
        }
        .rbc-day-slot {
          .rbc-timeslot-group {
            border-color: ${({ theme }) => theme.border};
            transition: border 0.2s linear;
            .rbc-time-slot {
              border-color: ${({ theme }) => theme.border};
              transition: border 0.2s linear;
            }
          }
        }
      }
    }
  }
`;
// TODO: Allow users to change color of courses in calendar?

/**
 * Render Worksheet Calendar Componenet
 * @prop showModal - function to show modal for a particular listing
 * @prop courses - list of dictionaries of listing data
 * @prop hover_course - dictionary of listing that is being hovered over in list view
 * @prop hidden_courses - dictionary of hidden courses
 */

function WeekSchedule({ showModal, courses, hover_course, hidden_courses }) {
  // Parse listings dictionaries to generate event dictionaries
  const parseListings = useCallback(
    (listings) => {
      // Initialize earliest and latest class times
      let earliest = moment().hour(20);
      let latest = moment().hour(0);
      // List of event dictionaries
      let parsedCourses = [];
      // Iterate over each listing dictionary
      listings.forEach((course, index) => {
        if (hidden_courses[course.crn]) return;
        const weekDays = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ];
        for (let indx = 0; indx < 5; indx++) {
          const info = course['times_by_day.' + weekDays[indx]];
          // If the listing takes place on this day
          if (info !== undefined) {
            // Get start and end times for the listing
            const start = moment(info[0][0], 'HH:mm').day(1 + indx);
            const end = moment(info[0][1], 'HH:mm').day(1 + indx);
            // Fix any incorrect values
            if (start.get('hour') < 8) start.add(12, 'h');
            if (end.get('hour') < 8) end.add(12, 'h');
            const value = course.course_code;
            // Add event dictionary to the list
            parsedCourses[parsedCourses.length] = {
              title: value,
              start: start.toDate(),
              end: end.toDate(),
              listing: course,
              id: index,
            };
            // Update earliest and latest courses
            if (start.get('hours') < earliest.get('hours')) earliest = start;
            if (end.get('hours') > latest.get('hours')) latest = end;
          }
        }
      });
      // Set earliest minute to 0
      earliest.set({ minute: 0 });
      return [earliest, latest, parsedCourses];
    },
    [hidden_courses]
  );

  // Custom styling for the calendar events
  const eventStyleGetter = useCallback(
    (event) => {
      let style = {
        backgroundColor: event.listing.color,
        borderColor: event.listing.border,
        borderWidth: '2px',
      };
      if (hover_course && hover_course === event.listing.crn) {
        style.zIndex = 2;
        style.filter = 'saturate(130%)';
      } else if (hover_course) {
        style.opacity = '30%';
      }
      return {
        style: style,
      };
    },
    [hover_course]
  );

  const ret_values = useMemo(() => {
    return parseListings(courses);
  }, [courses, parseListings]);

  const minTime = useMemo(() => {
    return ret_values[0].get('hours') !== 20
      ? ret_values[0].toDate()
      : moment().hour(8).minute(0).toDate();
  }, [ret_values]);

  const maxTime = useMemo(() => {
    return ret_values[1].get('hours') !== 0
      ? ret_values[1].toDate()
      : moment().hour(18).minute(0).toDate();
  }, [ret_values]);

  const onSelectEventCallback = useCallback(
    (event) => {
      return showModal(event.listing);
    },
    [showModal]
  );

  const eventPropGetterCallback = useCallback(
    (event) => {
      return eventStyleGetter(event);
    },
    [eventStyleGetter]
  );

  return (
    <StyledCalendar
      // Show Mon-Fri
      defaultView={'work_week'}
      views={['work_week']}
      events={ret_values[2]}
      // Earliest course time or 8am if no courses
      min={minTime}
      // Latest course time or 6pm if no courses
      max={maxTime}
      localizer={localizer}
      toolbar={false}
      onSelectEvent={onSelectEventCallback}
      components={{ event: CalendarEvent }}
      eventPropGetter={eventPropGetterCallback}
      // Display Mon, Tue, Wed, ... at the top
      formats={{
        dayFormat: 'ddd',
        timeGutterFormat: 'ha',
      }}
    />
  );
}

// WeekSchedule.whyDidYouRender = true;
export default React.memo(WeekSchedule);
