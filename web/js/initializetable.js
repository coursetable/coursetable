import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import Rainbow from 'rainbowvis.js';
import { escapeHtml } from './custom-timetable';
import {
  getCategoriesInColumn,
  AboveBelowFilterUi,
  ButtonBooleanFilterUi,
  CategoryFilterUi,
  CheckboxBooleanFilterUi,
  FilterManager,
  TextFilterUi,
  TimeFilterUi,
} from './filterui';
import { SortUi, TimeSortUi, SortManager } from './sortui';
import Table from './tabletools';

// The original popover HTML is saved into here on first load to not mess with
// jQuery selectors that end unexpectedly find two elements
let popoversSavedHtml = '';

export default function initializeTableWithData(
  data,
  showModalFunction,
  worksheetManager,
  season,
  showEvaluations
) {
  const gradient = new Rainbow();
  gradient.setNumberRange(2, 5);
  gradient.setSpectrum('f8696b', 'ffeb84', '63b37b');

  const difficultyGradient = new Rainbow();
  difficultyGradient.setNumberRange(1, 5);
  difficultyGradient.setSpectrum('63b37b', 'ffeb84', 'f8696b');

  const sortManager = new SortManager();
  const filterManager = new FilterManager();

  // We need to back up all the popovers if we need to reload later
  if (popoversSavedHtml === '') {
    popoversSavedHtml = $('#popovers-backup').html();
    $('#popovers-backup').remove();
  }
  $('#popovers').html(popoversSavedHtml);

  const table = new Table(data, '.dataTable', '.tableContainer', 50, 0, season);
  table.widths = {
    'average.same_both.rating': 45,
    'average.same_class.rating': 55,
    'average.same_professors.rating': 50,
    professors: 130,
  };
  table.extraHeaderWidths = {
    subject: 20,
    num_students: 20,
  };

  let tableHeaders = [
    { field: 'title', title: 'Name' },
    { field: 'times', title: 'Times' },
    {
      field: 'num_friends',
      title: '# FB',
      tooltip: 'Number of Facebook friends also shopping this course',
    },
  ];
  if (showEvaluations) {
    tableHeaders = tableHeaders.concat([
      { field: 'num_students', title: '#', tooltip: 'Number of students' },
      {
        field: 'average.same_both.rating',
        title: 'Rated',
        tooltip:
          'Average for this class when taught by the same professor: 5 is best',
      },
      {
        field: 'average.same_class.rating',
        title: 'Rated (Class)',
        tooltip:
          'Average rating for this class when taught by any professor: 5 is best',
      },
      {
        field: 'average.same_professors.rating',
        title: 'Rated (Prof)',
        tooltip:
          'Average of all the ratings this professor has obtained: 5 is best',
      },
    ]);
  }
  tableHeaders = tableHeaders.concat([
    { field: 'skills', title: 'Skills' },
    { field: 'areas', title: 'Areas' },
  ]);
  if (showEvaluations) {
    tableHeaders = tableHeaders.concat([
      {
        field: 'average.same_both.workload',
        title: 'Work',
        tooltip:
          'Average workload for this class when taught by the same professor: 5 is the most work',
      },
    ]);
  }

  tableHeaders = tableHeaders.concat([
    { field: 'professors', title: 'Professors' },
    { field: 'locations_summary', title: 'Location(s)' },
    { field: 'exam_timestamp', title: 'Exam' },
  ]);

  const fixedHeaders = [
    { field: 'row', title: 'Row' }, // Note that this is a hack: the row # displayed is always set sequentially (see tabletools generateRowHtml)
    {
      field: 'worksheet',
      title: 'WS',
      tooltip: 'Add or remove classes from your worksheet',
      placement: 'right',
    },
    { field: 'subject', title: 'Subj', tooltip: 'Subject' },
    {
      field: 'number',
      title: 'Num',
      tooltip: 'Number: e.g. "115" for "ECON 115"',
    },
    { field: 'section', title: 'Sec', tooltip: 'Section' },
  ];

  table.setFixedHeaders(fixedHeaders);
  table.setHeaders(tableHeaders);

  /**
   * HTML Converter for different types of ratings, rounding to 2 digits.
   * @param rowData
   * @param field     string; The field containing the rating in a number
   * @return {String}   HTML of rating
   */
  const floatHtmlConverter = function(rowData, field) {
    const data = _.get(rowData, field);
    if (data == null) {
      return '';
    }
    return data.toFixed(1);
  };

  table.htmlConverters = {
    title: function(rowData /* , field */) {
      return (
        '<a rel="popover" href="#" data-content="' +
        escapeHtml(rowData.description) +
        '">' +
        escapeHtml(rowData.title) +
        '</a>'
      );
    },
    times: function(rowData, field) {
      return escapeHtml(rowData[field].summary);
    },
    num_students: function(rowData /* , field */) {
      const numStudents = rowData.num_students;
      if (numStudents == null) {
        return '';
      }
      const isSameProf = rowData.num_students_is_same_prof;
      if (isSameProf) {
        return escapeHtml(numStudents);
      } else {
        let html =
          '<a rel="tooltip" href="#" title="A different professor taught the class when it was this size">';
        html += escapeHtml(numStudents + ' *');
        html += '</a>';
        return html;
      }
    },
    num_friends: function(rowData, field) {
      if (rowData[field] === 0) {
        return '';
      } else {
        const friendNames = [];
        const friends = rowData.friends;
        for (let i = 0; i < friends.length; i++) {
          friendNames.push(friends[i].name);
        }
        return (
          '<a rel="tooltip" href="#" title="' +
          escapeHtml(friendNames.join(', ')) +
          '">' +
          rowData[field] +
          '</a>'
        );
      }
    },
    exam_timestamp: function(rowData /* , field */) {
      const examGroup = parseInt(rowData.exam_group, 10);
      if (examGroup === 0) {
        return '';
      } else if (examGroup === 1) {
        return 'TBD';
      }
      const examDate = moment(rowData.exam_timestamp, 'YYYYMMDDHHmmss');
      return examDate.format('Do ha');
    },
    'average.same_both.rating': floatHtmlConverter,
    'average.same_class.rating': floatHtmlConverter,
    'average.same_professors.rating': floatHtmlConverter,
    'average.same_both.workload': floatHtmlConverter,
  };

  const ratingColumnClasses = [
    '_average_same_both_rating',
    '_average_same_class_rating',
    '_average_same_professors_rating',
    '_average_same_both_workload',
  ];
  const ratingDataKeys = [
    'average.same_both.rating',
    'average.same_class.rating',
    'average.same_professors.rating',
    'average.same_both.workload',
  ];
  const courseModalLinkClasses = ['subject', 'number', 'section', 'title'];

  table.rowCallback = function($tr, rowNum, rowData) {
    // Rating column highlighting
    for (let i = 0; i < ratingColumnClasses.length; i++) {
      const ratingColumnClass = ratingColumnClasses[i];
      const $ratingTd = $tr.children('td.' + ratingColumnClasses[i]);
      const rating = _.get(rowData, ratingDataKeys[i]);
      if (rating) {
        let color;
        if (ratingColumnClass === '_average_same_both_workload') {
          color = '#' + difficultyGradient.colourAt(rating);
        } else {
          color = '#' + gradient.colourAt(rating);
        }
        $ratingTd.css('background-color', color);
      }
    }

    // Links
    for (let i = 0; i < courseModalLinkClasses.length; i++) {
      const className = courseModalLinkClasses[i];
      const $elem = $tr.children('._' + className);

      let $a = $elem.children('a');
      if ($a.length === 0) {
        $elem.html('<a href="#">' + rowData[className] + '</a>');
        $a = $elem.children('a');
      }
      $a.on('click', e => {
        e.preventDefault();
        showModalFunction(rowData);
      });
    }
    // Plus button and row color
    const $plusTd = $tr.children('._worksheet');
    $plusTd.html(
      '<a rel="tooltip" href="#" title="Add to your worksheet" data-placement="right"><i class="icon-plus"></i></a>'
    );

    const $link = $plusTd.children('a');
    const $icon = $link.children('i');

    let clickAction = 'add';
    if (worksheetManager.isCourseInWorksheet(data[rowNum].oci_id)) {
      $link.attr('title', 'Remove from your worksheet');
      $icon.removeClass('icon-plus').addClass('icon-minus');
      clickAction = 'remove';

      $tr.addClass('info');
    }
    $plusTd.click(() => {
      worksheetManager.addOrRemoveForWorksheet(
        data[rowNum].oci_id,
        clickAction
      );
    });
  };

  table.postDisplayCallback = function() {
    $('a[rel=tooltip]')
      .tooltip()
      .click(event => {
        event.preventDefault();
      });
    $('a[rel=popover]')
      .popover({ trigger: 'hover' })
      .click(event => {
        event.preventDefault();
      });
  };
  table.init();

  sortManager.setTable(table);
  filterManager.setTable(table);

  /**
   * Initialize the header cell for a sort/filter column.
   * @param $th         JQuery th element
   * @param popoverSelector   The selector to the popover to open: e.g. '.my-popover-class'
   */
  function initializeSortFilterHeader($th, popoverSelector) {
    let $thInner;
    if ($th.find('a').length >= 1) {
      $thInner = $th.find('a');
    } else {
      $thInner = $(
        '<a style="display: block; width: 100%;" href="#"></a>'
      ).html($th.html());
      $th.empty().append($thInner);
    }
    $thInner.addClass('popover-link');

    $thInner.append(' <i class="icon-resize-vertical"></i>');
    $thInner.click(event => {
      event.preventDefault();
    });

    $thInner.customPopover({
      target: popoverSelector,
      placement: 'bottom',
    });
    $(popoverSelector + ' .close-btn').click(() => {
      $thInner.customPopover('hide');
    });
    // Click-outside handling
    $(document).on('click.popover', event => {
      if ($th.has(event.target).length === 0) {
        $thInner.customPopover('hide');
      }
    });
  }

  /**
   * Initializes the header row for the cell, links it to the popover.
   * Initializes the Sort and Filter UI Javascript classes and links those
   * to the popover.
   * @param name        string name of column (see 'columns' and 'fixedColumns')
   * @param selectorPrefix  string to which '-popover' and '-sort' and '-filter' are
   *              appended to form CSS selectors to attach things to
   * @param sortUiClass     class to use for the SortUi
   * @param filterUiClass   class to use for the FilterUi
   * @return {Object}
   */
  function initializeSortFilter(
    name,
    selectorPrefix,
    sortUiClass,
    filterUiClass
  ) {
    const thClass = name.replace(/\./g, '_');
    const $th = $('th._' + thClass);

    initializeSortFilterHeader($th, '#popovers ' + selectorPrefix + '-popover');

    let sortUi, filterUi;
    if (sortUiClass) {
      sortUi = new sortUiClass();
      sortUi.init(name, '#popovers ' + selectorPrefix + '-sort', sortManager);
      sortUi.attachTableHeader($th, $('th._' + name + ' i'));
    }
    if (filterUiClass) {
      filterUi = new filterUiClass();
      filterUi.init(name, selectorPrefix + '-filter', filterManager);
      filterUi.attachTableHeader($th);
    }
    return { filterUi: filterUi, sortUi: sortUi };
  }

  /**
   * Given an array of values for the exam field, transforms them so that
   * 0 => 'None' and 1 => 'TBD' and all other timestamps are transformed to
   * '5th 9am' form
   * @param selectValues  {String} Array of values
   * @return {String}   Array of values transformed to readable text
   */
  function refineExamSelectValues(selectValues) {
    for (let i = 0; i < selectValues.length; i++) {
      const timeString = selectValues[i].toString();
      if (timeString === '0') {
        selectValues[i] = ['None', 0];
      } else if (timeString === '1') {
        selectValues[i] = ['TBD', 1];
      } else {
        const time = moment(timeString, 'YYYYMMDDHHmmss');
        selectValues[i] = [time.format('Do ha'), timeString];
      }
    }
    return selectValues;
  }

  let filterUi;
  let filterCategories;

  filterUi = initializeSortFilter('areas', '.areas', SortUi, CategoryFilterUi)
    .filterUi;
  filterCategories = getCategoriesInColumn(data, 'areas');
  filterCategories.push(null);
  filterUi.setSelectValues(filterCategories);
  $('.areas-filter input[type=checkbox]').change(filterUi, function(event) {
    const simpleMode = !this.checked;
    event.data.setUseSelect2(simpleMode);
  });

  filterUi = initializeSortFilter('skills', '.skills', SortUi, CategoryFilterUi)
    .filterUi;
  filterCategories = getCategoriesInColumn(data, 'skills');
  filterCategories.push(null);
  filterUi.setSelectValues(filterCategories);
  $('.skills-filter input[type=checkbox]').change(filterUi, function(event) {
    const simpleMode = !this.checked;
    event.data.setUseSelect2(simpleMode);
  });

  filterUi = initializeSortFilter(
    'exam_timestamp',
    '.exam-timestamp',
    SortUi,
    CategoryFilterUi
  ).filterUi;
  filterUi.setSelectValues(
    refineExamSelectValues(getCategoriesInColumn(data, 'exam_timestamp'))
  );
  sortManager.useSortComparatorGeneratorForSort('exam_timestamp', 'numeric');

  filterUi = initializeSortFilter(
    'subject',
    '.subject',
    SortUi,
    CategoryFilterUi
  ).filterUi;
  $('.subject-filter input[type=checkbox]').change(filterUi, function(event) {
    const simpleMode = !this.checked;
    event.data.setUseSelect2(simpleMode);
  });
  filterUi.setSelectValues(getCategoriesInColumn(data, 'subject'));
  sortManager.registerSortComparatorGenerator('subject', (sortName, data) => {
    return function(rowA, rowB) {
      const multiplier = data === 'ASC' ? 1 : -1;
      if (rowA.subject < rowB.subject) {
        return -1 * multiplier;
      } else if (rowB.subject < rowA.subject) {
        return 1 * multiplier;
      }

      if (rowA.number < rowB.number) {
        return -1 * multiplier;
      } else if (rowB.number < rowA.number) {
        return 1 * multiplier;
      }

      if (rowA.section < rowB.section) {
        return -1 * multiplier;
      } else if (rowB.section < rowA.section) {
        return 1 * multiplier;
      }

      return 0;
    };
  });

  initializeSortFilter('title', '.title', SortUi, TextFilterUi);
  filterManager.registerFilterGenerator('title', (filterName, data) => {
    const filter = filterManager.valueFilterGenerators.text(data);
    return function(row) {
      return filter(row.title) || filter(row.long_title);
    };
  });

  initializeSortFilter('professors', '.professors', SortUi, TextFilterUi);
  initializeSortFilter(
    'locations_summary',
    '.locations-summary',
    SortUi,
    TextFilterUi
  );

  initializeSortFilter(
    'average.same_both.rating',
    '.same-both-average',
    SortUi,
    AboveBelowFilterUi
  );
  initializeSortFilter(
    'average.same_class.rating',
    '.same-class-average',
    SortUi,
    AboveBelowFilterUi
  );
  initializeSortFilter(
    'average.same_professors.rating',
    '.same-professors-average',
    SortUi,
    AboveBelowFilterUi
  );
  initializeSortFilter(
    'average.same_both.workload',
    '.difficulty-average',
    SortUi,
    AboveBelowFilterUi
  );
  initializeSortFilter('number', '.number', SortUi, AboveBelowFilterUi);

  sortManager.useSortComparatorGeneratorForSort(
    'average.same_both.rating',
    'numeric'
  );
  sortManager.useSortComparatorGeneratorForSort(
    'average.same_class.rating',
    'numeric'
  );
  sortManager.useSortComparatorGeneratorForSort(
    'average.same_professors.rating',
    'numeric'
  );
  sortManager.useSortComparatorGeneratorForSort(
    'average.same_both.workload',
    'numeric'
  );

  initializeSortFilter(
    'num_friends',
    '.num-friends',
    SortUi,
    AboveBelowFilterUi
  );
  initializeSortFilter(
    'num_students',
    '.num-students',
    SortUi,
    AboveBelowFilterUi
  );
  initializeSortFilter('times', '.times', TimeSortUi, TimeFilterUi);
  sortManager.registerSortComparatorGenerator('times', (sortName, data) => {
    return function(rowA, rowB) {
      const multiplier = data.order === 'ASC' ? 1 : -1;

      const dayOfWeek = data.day_of_week;
      const rowATimes = rowA.times.by_day;
      const rowBTimes = rowB.times.by_day;
      const aHasTimesOnDay =
        dayOfWeek in rowATimes && rowATimes[dayOfWeek].length !== 0;
      const bHasTimesOnDay =
        dayOfWeek in rowBTimes && rowBTimes[dayOfWeek].length !== 0;

      // Rows without a time on that day come last
      if (aHasTimesOnDay && !bHasTimesOnDay) {
        return -1;
      } else if (bHasTimesOnDay && !aHasTimesOnDay) {
        return 1;
      } else if (!aHasTimesOnDay && !bHasTimesOnDay) {
        return 0;
      }

      // Start time comparison
      let aFirstTime = parseFloat(rowATimes[dayOfWeek][0][0]);
      let bFirstTime = parseFloat(rowBTimes[dayOfWeek][0][0]);

      if (aFirstTime < bFirstTime) {
        return -1 * multiplier;
      } else if (bFirstTime < aFirstTime) {
        return 1 * multiplier;
      }

      // End time comparison
      aFirstTime = parseFloat(rowATimes[dayOfWeek][0][1]);
      bFirstTime = parseFloat(rowBTimes[dayOfWeek][0][1]);

      if (aFirstTime < bFirstTime) {
        return -1 * multiplier;
      } else if (bFirstTime < aFirstTime) {
        return 1 * multiplier;
      }

      return 0;
    };
  });
  filterManager.registerFilterGenerator('times', (filterName, data) => {
    const dayOfWeek = data.day_of_week;
    const direction = data.type; // Before or After
    const filterTime = data.time;

    return function(row) {
      const timesByDay = row.times.by_day;
      if (!(dayOfWeek in timesByDay)) {
        return false;
      }

      // Filter just by day; we're done!
      if (data.time === undefined) {
        return true;
      }

      // Filter by specific time; need a bit more work
      const timesOnDay = row.times.by_day[dayOfWeek];
      for (let i = 0; i < timesOnDay.length; i++) {
        const startTime = parseFloat(timesOnDay[i][0]);
        if (direction === 'After' && startTime >= filterTime) {
          return true;
        } else if (direction === 'Before' && startTime <= filterTime) {
          return true;
        }
      }

      return false;
    };
  });

  // Search box
  filterUi = new TextFilterUi();
  filterUi.init('search', '.search-filter', filterManager, 'keyup');

  filterManager.registerFilterGenerator('search', (filterName, data) => {
    const filter = filterManager.valueFilterGenerators.text(data);
    const noSpaceFilter = filterManager.valueFilterGenerators.text(
      data.replace(/[\s*]+/, '')
    );
    return function(row) {
      return (
        noSpaceFilter(row.subject + row.number + row.section) ||
        filter(row.title) ||
        filter(row.long_title) ||
        filter(row.professors)
      );
    };
  });

  // On search box hover: show quick filters
  $('#search-container').customPopover({
    target: '#popovers .special-filter-popover',
    trigger: 'hover',
    placement: 'bottom',
    delay: 100,
  });
  filterUi = new CheckboxBooleanFilterUi();
  filterUi.init('not_cancelled', '#cancelled-filter', filterManager, row => {
    return (
      row.title !== 'CANCELLED' &&
      row.title !== 'MOVED TO SPRING TERM' &&
      row.title !== 'MOVED TO PRECEDING FALL TERM'
    );
  });
  filterUi = new CheckboxBooleanFilterUi();
  filterUi.init(
    'undergraduate',
    '#undergraduate-filter',
    filterManager,
    row => {
      return parseFloat(row.number) <= 499;
    }
  );

  // Show worksheet courses
  filterUi = new ButtonBooleanFilterUi();
  filterUi.init(
    'worksheet_only',
    '.worksheet-only-btn',
    filterManager,
    'Worksheet',
    'All courses'
  );
  filterManager.registerFilterGenerator(
    'worksheet_only',
    (/* filterName, data */) => {
      return function(row) {
        return worksheetManager.isCourseInWorksheet(row.oci_id);
      };
    }
  );
  filterManager.setFilterExclusive('worksheet_only', true);

  return {
    table: table,
    sortManager: sortManager,
    filterManager: filterManager,
    fixedHeaders: fixedHeaders,
    tableHeaders: tableHeaders,
    worksheetFilter: filterUi,
  };
}

console.log('hello I\'m Peter Xu');
