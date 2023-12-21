import React, { type CSSProperties, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
          transition: border-color ${({ theme }) => theme.transDur};
          .rbc-time-header-cell {
            .rbc-header {
              user-select: none;
              cursor: default;
              border-color: ${({ theme }) => theme.border};
              transition: border-color ${({ theme }) => theme.transDur};
            }
          }
        }
      }
      .rbc-time-content {
        border-color: ${({ theme }) => theme.border};
        transition: border-color ${({ theme }) => theme.transDur};
        .rbc-time-gutter {
          .rbc-timeslot-group {
            user-select: none;
            cursor: default;
            border-color: ${({ theme }) => theme.border};
            transition: border-color ${({ theme }) => theme.transDur};
          }
        }
        .rbc-day-slot {
          .rbc-timeslot-group {
            border-color: ${({ theme }) => theme.border};
            transition: border-color ${({ theme }) => theme.transDur};
            .rbc-time-slot {
              border-color: ${({ theme }) => theme.border};
              transition: border-color ${({ theme }) => theme.transDur};
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
  const [, setSearchParams] = useSearchParams();
  const { courses, hoverCourse, hiddenCourses, curSeason } = useWorksheet();

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
        if (curSeason in hiddenCourses && hiddenCourses[curSeason][course.crn])
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
    [hiddenCourses, curSeason],
  );

  // Custom styling for the calendar events
  const eventStyleGetter = useCallback(
    (event: CourseEvent) => {
      const style: CSSProperties = {
        backgroundColor: event.listing.color,
        borderColor: event.listing.border,
        borderWidth: '2px',
      };
      if (hoverCourse && hoverCourse === event.listing.crn) {
        style.zIndex = 2;
        style.filter = 'saturate(130%)';
      } else if (hoverCourse) {
        style.opacity = '30%';
      }
      return {
        style,
      };
    },
    [hoverCourse],
  );

  const retValues = useMemo(
    () => parseListings(courses),
    [courses, parseListings],
  );

  const minTime = useMemo(
    () =>
      retValues.earliest.get('hours') !== 20
        ? retValues.earliest.toDate()
        : moment().hour(8).minute(0).toDate(),
    [retValues],
  );

  const maxTime = useMemo(
    () =>
      retValues.latest.get('hours') !== 0
        ? retValues.latest.toDate()
        : moment().hour(18).minute(0).toDate(),
    [retValues],
  );

  return (
    <StyledCalendar
      // Show Mon-Fri
      defaultView="work_week"
      views={['work_week']}
      events={retValues.parsedCourses}
      // Earliest course time or 8am if no courses
      min={minTime}
      // Latest course time or 6pm if no courses
      max={maxTime}
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
