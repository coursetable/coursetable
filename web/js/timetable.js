import $ from 'jquery';
import moment from 'moment';

function TimeTable(elem, data) {
  const $elem = $(elem).addClass('mtt-table');
  $elem.empty();

  const events = data.events;

  // Make a minute timestamp
  $.map(events, elem => {
    elem.startTime =
      parseInt(elem.start.hour * 60, 10) + parseInt(elem.start.minute, 10);
    elem.endTime =
      parseInt(elem.end.hour * 60, 10) + parseInt(elem.end.minute, 10);
  });

  let earliestTime = 60 * 24;
  let latestTime = 0;

  if (events.length === 0) {
    // Default to at least a few hours so that we don't have
    // a strange table layout
    earliestTime = 60 * 9; // 9am
    latestTime = 60 * 15; // 3pm
  } else {
    // Find the earliest and latest events
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      earliestTime = Math.min(earliestTime, event.startTime);
      latestTime = Math.max(latestTime, event.endTime);
    }
  }

  data = typeof data === 'undefined' ? {} : data;

  const startHour =
    'startHour' in data ? data.startHour : Math.floor(earliestTime / 60);
  const endHour = 'endHour' in data ? data.endHour : Math.ceil(latestTime / 60);
  const startMinute = startHour * 60;
  const endMinute = endHour * 60;

  const totalMinutes = endMinute - startMinute;

  const slotMinutes = 'slotMinutes' in data ? data.slotMinutes : 30;
  const days = 'days' in data ? data.days : [1, 2, 3, 4, 5];

  const $thead = $('<thead>');
  $elem.append($thead);

  // Add the header row
  const $headerTr = $('<tr>').addClass('mtt-header');
  $headerTr.append($('<th>'));

  const rowsPerHour = 60 / slotMinutes;

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayLabel = moment.weekdays()[day];
    $headerTr.append(
      $('<th>')
        .addClass('mtt-head-' + day)
        .text(dayLabel)
    );
  }
  $elem.append($headerTr);

  let globalFirst = true;

  // Add each of the rows for the hours
  for (let hour = startHour; hour < endHour; hour++) {
    let first = true;
    for (let j = 0; j < 60; j += slotMinutes) {
      const $tr = $('<tr>');

      // If it's an hour row, add the hour label
      if (first) {
        $tr.addClass('mtt-hour-row');
        first = false;
        $tr.append(
          $('<td>')
            .addClass('mtt-left-label')
            .text(
              (hour % 12 === 0 ? 12 : hour % 12) + (hour >= 12 ? 'pm' : 'am')
            )
            .attr('rowspan', rowsPerHour)
        );
      }

      // If it's the very first row
      if (globalFirst) {
        $tr.addClass('mtt-first-row');
      }

      $tr.addClass('mtt-row');

      // Add cells for each day of the week included
      for (let k = 0; k < days.length; k++) {
        const day = days[k];
        const $td = $('<td>')
          .addClass('mtt-cell')
          .addClass('mtt-cell-' + day);
        if (globalFirst) {
          $td.append(
            $('<div>')
              .addClass('mtt-day')
              .addClass('mtt-day-' + day)
          );
        }
        $tr.append($td);
      }

      globalFirst = false;

      $elem.append($tr);
    }
  }

  // Sort by start time
  events.sort((a, b) => {
    return a.startTime - b.startTime;
  });

  // Go through each and create "intervals"
  const intervals = {};
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (!(event.day in intervals)) {
      intervals[event.day] = [];
    }

    const dayIntervals = intervals[event.day];
    if ($.inArray(event.startTime, dayIntervals) === -1) {
      dayIntervals.push(event.startTime);
    }

    if ($.inArray(event.endTime, dayIntervals) === -1) {
      dayIntervals.push(event.endTime);
    }
  }

  // Make the intervals objects with counts of how many events occupy the time
  // intervalsWithUsage[day] = [{time: 360, count: 2}, {time: 540, count: 1}]
  const intervalsWithUsage = {};
  $.each(intervals, (day, dayIntervals) => {
    dayIntervals.sort((a, b) => {
      return a - b;
    });

    intervalsWithUsage[day] = [];
    for (let i = 0; i < dayIntervals.length; i++) {
      intervalsWithUsage[day].push({ time: dayIntervals[i], events: [] });
    }
  });

  // See how many events are in each interval, and determine the maximum number
  // of events that are overlapping with it for each given event
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    event.intervals = [];
    const intervals = intervalsWithUsage[event.day];

    for (let j = 0; j < intervals.length; j++) {
      const interval = intervals[j];
      if (interval.time < event.startTime) continue;
      if (interval.time >= event.endTime) break;

      interval.events.push(event);
      event.intervals.push(interval);
    }
  }

  // Check each event and see how many other courses, at most, share time
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const intervals = event.intervals;

    event.maxSimultaneous = 0;

    for (let j = 0; j < intervals.length; j++) {
      event.maxSimultaneous = Math.max(
        event.maxSimultaneous,
        intervals[j].events.length
      );
    }
  }

  // Check each interval and see how many slots it takes
  $.each(intervalsWithUsage, (day, intervals) => {
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const events = interval.events;

      interval.slots = 0;
      for (let j = 0; j < events.length; j++) {
        interval.slots = Math.max(interval.slots, events[j].maxSimultaneous);
      }
      interval.slotsUsed = [];
    }
  });

  /**
   * Given an event, find the slot of the interval where it should be
   * placed. (Each slot is a horizontal unit)
   * @param  event    event to find a slot for
   * @return  number of the slot where it should be placed
   */
  function findSlot(event) {
    const interval = event.intervals[0];

    // Find an empty slot in the first interval
    // This is guaranteed to be empty in all following intervals too
    let slot;
    for (let i = 0; i < interval.slots; i++) {
      if ($.inArray(i, interval.slotsUsed) === -1) {
        slot = i;
        break;
      }
    }

    // Set all other slots as not empty
    for (let i = 0; i < event.intervals.length; i++) {
      event.intervals[i].slotsUsed.push(slot);
    }

    return slot;
  }

  // Table height
  const tableHeight = $elem.height() - $headerTr.height();

  // Place each event
  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    // Heights and vertical offsets
    const eventOffset =
      ((event.startTime - startMinute) / totalMinutes) * tableHeight;
    const eventHeight =
      ((event.endTime - event.startTime) / totalMinutes) * tableHeight;

    const fullWidth = 100 / event.maxSimultaneous;
    const width = fullWidth - 2; // Some spacing between events
    const slot = findSlot(event);
    const left = slot * fullWidth;

    const $day = $elem.find('.mtt-day-' + event.day);

    const $eventDiv = $('<div>')
      .addClass('mtt-event')
      .css('top', eventOffset + 'px')
      .css('height', eventHeight + 'px')
      .css('left', left + '%')
      .css('width', width + '%')
      .append(
        $('<div>')
          .addClass('mtt-content')
          .append(event.content)
      );

    if (typeof event.classes !== 'undefined') {
      for (let j = 0; j < event.classes.length; j++) {
        $eventDiv.addClass(event.classes[j]);
      }
    }

    if (typeof event.click !== 'undefined') {
      $eventDiv.click(event.click);
    }

    $day.append($eventDiv);
  }
}

/**
 * Bind a timeTable
 * @param  data  containing startHour, endHour, event {
 *            day, start { hour, minute }, end { hour, minute },
 *             ($)content, classes[]
 *           }
 */
$.fn.timeTable = function(data) {
  this.each((i, elem) => {
    new TimeTable(elem, data); // eslint-disable-line no-new
  });
};
