import React, { CSSProperties, useCallback, useMemo } from 'react';
import moment from 'moment';
import './WorksheetCalendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import CalendarEvent from './CalendarEvent';
import { weekdays } from '../../utilities/common';
import { useWorksheet } from '../../contexts/worksheetContext';
import { Listing } from '../Providers/FerryProvider';

const localizer = momentLocalizer(moment);

interface ParsedCourseType {
  title: string;
  start: Date;
  end: Date;
  listing: Listing;
  id: number;
}

// Calendar for worksheet
const StyledCalendar = styled(Calendar<ParsedCourseType>)`
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
  const { showModal, courses, hoverCourse, hiddenCourses, curSeason } =
    useWorksheet();

  // Parse listings dictionaries to generate event dictionaries
  const parseListings = useCallback(
    (listings: Listing[]) => {
      // Initialize earliest and latest class times
      let earliest = moment().hour(20);
      let latest = moment().hour(0);
      // List of event dictionaries
      const parsedCourses: ParsedCourseType[] = [];
      // Iterate over each listing dictionary
      listings.forEach((course, index) => {
        if (
          Object.prototype.hasOwnProperty.call(hiddenCourses, curSeason) &&
          hiddenCourses[curSeason][course.crn]
        )
          return;
        for (let indx = 0; indx < 5; indx++) {
          const info = course.times_by_day[weekdays[indx]];
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
            parsedCourses.push({
              title: value,
              start: start.toDate(),
              end: end.toDate(),
              listing: course,
              id: index,
            });
            // Update earliest and latest courses
            if (start.get('hours') < earliest.get('hours')) earliest = start;
            if (end.get('hours') > latest.get('hours')) latest = end;
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
    (event: ParsedCourseType) => {
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
      onSelectEvent={(event) => showModal(event.listing)}
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

// WorksheetCalendar.whyDidYouRender = true;
export default React.memo(WorksheetCalendar);
