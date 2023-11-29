import React, { CSSProperties, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import './WorksheetCalendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import CalendarEvent, { type CourseEvent } from './CalendarEvent';
import { weekdays, type Listing } from '../../utilities/common';
import { useWorksheet } from '../../contexts/worksheetContext';

const localizer = momentLocalizer(moment);

// Calendar for worksheet
const StyledCalendar = styled(Calendar<CourseEvent>)`
  &.rbc-calendar {
    .rbc-time-view {
      .rbc-time-header {
        .rbc-time-header-content {
          border-color: ${({ theme }) => theme.border};
          transition: border-color ${({ theme }) => theme.trans_dur};
          .rbc-time-header-cell {
            .rbc-header {
              user-select: none;
              cursor: default;
              border-color: ${({ theme }) => theme.border};
              transition: border-color ${({ theme }) => theme.trans_dur};
            }
          }
        }
      }
      .rbc-time-content {
        border-color: ${({ theme }) => theme.border};
        transition: border-color ${({ theme }) => theme.trans_dur};
        .rbc-time-gutter {
          .rbc-timeslot-group {
            user-select: none;
            cursor: default;
            border-color: ${({ theme }) => theme.border};
            transition: border-color ${({ theme }) => theme.trans_dur};
          }
        }
        .rbc-day-slot {
          .rbc-timeslot-group {
            border-color: ${({ theme }) => theme.border};
            transition: border-color ${({ theme }) => theme.trans_dur};
            .rbc-time-slot {
              border-color: ${({ theme }) => theme.border};
              transition: border-color ${({ theme }) => theme.trans_dur};
          }
        }
      }
    }
  }
`;
// TODO: Allow users to change color of courses in calendar?

/**
 * Render Worksheet Calendar component
 */

function WorksheetCalendar() {
  const navigate = useNavigate();
  const { courses, hover_course, hidden_courses, cur_season } = useWorksheet();

  // Parse listings dictionaries to generate event dictionaries
  const parseListings = useCallback(
    (listings: Listing[]) => {
      // Initialize earliest and latest class times
      let earliest = moment().hour(20);
      let latest = moment().hour(0);
      // List of event dictionaries
      const parsedCourses: CourseEvent[] = [];
      // Iterate over each listing dictionary
      listings.forEach((course, index) => {
        if (
          Object.prototype.hasOwnProperty.call(hidden_courses, cur_season) &&
          hidden_courses[cur_season][course.crn]
        )
          return;
        for (let indx = 0; indx < 5; indx++) {
          const info = course.times_by_day[weekdays[indx]];
          // If the listing takes place on this day
          if (info !== undefined) {
            for (const [startTime, endTime, location] of info) {
              // Get start and end times for the listing
              const start = moment(startTime, 'HH:mm').day(1 + indx);
              const end = moment(endTime, 'HH:mm').day(1 + indx);
              // Try to fix any incorrect values
              // We don't have classes before 7, but we do have classes before 8
              if (start.get('hour') < 7) start.add(12, 'h');
              if (end.get('hour') < 7) end.add(12, 'h');
              const value = course.course_code;
              // Add event dictionary to the list
              parsedCourses.push({
                title: value,
                start: start.toDate(),
                end: end.toDate(),
                listing: course,
                id: index,
                location,
              });
              // Update earliest and latest courses
              if (start.get('hours') < earliest.get('hours')) earliest = start;
              if (end.get('hours') > latest.get('hours')) latest = end;
            }
          }
        }
      });
      // Set earliest minute to 0
      earliest.set({ minute: 0 });
      return {
        earliest,
        latest,
        parsedCourses,
      };
    },
    [hidden_courses, cur_season],
  );

  // Custom styling for the calendar events
  const eventStyleGetter = useCallback(
    (event: CourseEvent) => {
      const style: CSSProperties = {
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
        style,
      };
    },
    [hover_course],
  );

  const ret_values = useMemo(() => {
    return parseListings(courses);
  }, [courses, parseListings]);

  const minTime = useMemo(() => {
    return ret_values.earliest.get('hours') !== 20
      ? ret_values.earliest.toDate()
      : moment().hour(8).minute(0).toDate();
  }, [ret_values]);

  const maxTime = useMemo(() => {
    return ret_values.latest.get('hours') !== 0
      ? ret_values.latest.toDate()
      : moment().hour(18).minute(0).toDate();
  }, [ret_values]);

  return (
    <StyledCalendar
      // Show Mon-Fri
      defaultView="work_week"
      views={['work_week']}
      events={ret_values.parsedCourses}
      // Earliest course time or 8am if no courses
      min={minTime}
      // Latest course time or 6pm if no courses
      max={maxTime}
      localizer={localizer}
      toolbar={false}
      onSelectEvent={(event) =>
        navigate(
          `/worksheet?display=${event.listing.season_code}-${event.listing.crn}`,
        )
      }
      components={{ event: CalendarEvent }}
      eventPropGetter={eventStyleGetter}
      // Display Mon, Tue, Wed, ... at the top
      formats={{
        dayFormat: 'ddd',
        timeGutterFormat: 'ha',
      }}
      tooltipAccessor={undefined}
    />
  );
}

export default WorksheetCalendar;
