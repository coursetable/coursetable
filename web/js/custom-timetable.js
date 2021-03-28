import $ from 'jquery';
import moment from 'moment';
import { modals } from './init';

/**
 * Escape Html characters
 * @param unsafe    string of unescaped text
 * @return          string of escaped text
 */
export function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Generates course code string given a courses' codes object
 * @param codes
 * @return string describing course codes (e.g. 'ACCT 101 / AMST 134')
 */
function generateCourseCodeText(codes) {
  const courseCodeTexts = [];
  for (let m = 0; m < codes.length; m++) {
    const code = codes[m];
    courseCodeTexts.push(code.subject + ' ' + code.number);
  }

  return courseCodeTexts.join(' / ');
}

/**
 * Populates timetable with course data given
 * @note  must be called while the underlying .timetable is shown
 * @param  courseDatas    array of each course's data from data
 * @param  ociIds      OCI IDs (oci_id) of the courses to show
 *              this is needed so we can hide courses while still
 *              assigning the right colours.
 */
function populateTimetable(courseDatas, ociIds) {
  if (!(courseDatas instanceof Array)) {
    courseDatas = $.map(courseDatas, (val, key) => {
      return key;
    });
  }

  const events = [];
  let colorId = 0;

  // Add each course to courseData with correct formatting
  for (let j = 0; j < courseDatas.length; j++) {
    const courseData = courseDatas[j];

    colorId++;
    if (colorId === 6) colorId = 1;

    if (typeof ociIds !== 'undefined' && !(courseData.oci_id in ociIds)) {
      continue;
    }

    const days = courseData.times.by_day;

    $.each(days, (day, sessions) => {
      const weekday = $.inArray(day, moment.weekdays());

      if (weekday === -1) {
        return true; // continue; we got HTBA or something
      }

      for (let k = 0; k < sessions.length; k++) {
        const location = sessions[k][2];
        let eventTimes = sessions[k].slice(0, 2);
        // eventTimes = [start '10.15', end '11.30', location 'WLH 119']

        eventTimes = $.map(eventTimes, time => {
          const timeParts = time.split('.');
          const hour = timeParts.shift();
          let minute = timeParts.length !== 0 ? timeParts.shift() : 0;
          if (minute.length === 1) minute += '0';

          return { hour: hour, minute: minute };
        });

        // Build the HTML
        const courseCodeText = generateCourseCodeText(courseData.codes);
        const elem = $('<div>').html(
          courseCodeText +
            '<br>' +
            courseData.long_title +
            (location ? '<br>' + location : '')
        );

        events.push({
          content: elem,
          day: weekday,
          start: eventTimes[0],
          end: eventTimes[1],
          classes: ['course' + colorId],
          click: (courseData => () => {
            modals.showCourse(courseData);
          })(courseData),
        });
      }

      return true;
    });
  }

  $('.timetable').timeTable({
    events: events,
  });
}

/**
 * Populate the timetable courses list so that people can turn them on/off
 * @param  courseDatas    all courses on the worksheet
 */
function populateTimetableCourses(courseDatas) {
  // Generate the HTML for the table, with checkboxes and course descriptions
  let html =
    '<table class="table table-bordered table-hover"><tr><th></th><th>Courses</th></tr>';

  if (courseDatas.length === 0) {
    // Add a blank row
    html +=
      '<tr><td></td><td><strong>You have no courses in your worksheet.</strong> Go add some!</td></tr>';
  }

  for (let i = 0; i < courseDatas.length; i++) {
    const courseData = courseDatas[i];
    const checkboxId = 'checkbox' + courseData.oci_id;
    const courseCodeText = generateCourseCodeText(courseData.codes);

    html +=
      '<tr><td><input type="checkbox" checked="checked" class="courseCheckbox" id="' +
      checkboxId +
      '" ' +
      'data-oci-id="' +
      courseData.oci_id +
      '"></td>' +
      '<td><label for="' +
      checkboxId +
      '">' +
      courseCodeText +
      ': ' +
      escapeHtml(courseData.long_title) +
      '</label></td></tr>';
  }

  html += '</table>';

  $('.timetableCourses').html(html);

  // Add event listeners
  $('.courseCheckbox').on('change', () => {
    const ociIds = {};
    $('.courseCheckbox:checked').each(function() {
      ociIds[$(this).attr('data-oci-id')] = true;
    });

    populateTimetable(courseDatas, ociIds);
  });
}

let prevScroll = -1;
let prevBodyHeight = -1;
let prevBodyWidth = -1;

//
// Global exports
//
export function showTimetable(courseDatas) {
  if (prevScroll === -1) {
    prevScroll = $(window).scrollTop();
    prevBodyHeight = $('body').css('height');
    prevBodyWidth = $('body').css('width');
  }
  $(window).scrollTop(0);

  $('.tableContainer').hide();
  $('.timetableContainer').show();
  populateTimetable(courseDatas);
  populateTimetableCourses(courseDatas);

  $('body')
    .css('height', 'auto')
    .css('width', 'auto');
}

export function hideTimetable() {
  if (prevScroll === -1) return;

  $('body')
    .css('height', prevBodyHeight)
    .css('width', prevBodyWidth);
  $(window).scrollTop(prevScroll);

  $('.timetableContainer').hide();
  $('.tableContainer').show();

  prevScroll = -1;
}
