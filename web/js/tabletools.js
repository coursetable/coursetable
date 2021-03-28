import $ from 'jquery';
import _ from 'lodash';
import Profiler from './profiler';

const p = new Profiler();

/**
 * Escape Html characters
 * @param unsafe    string of unescaped text
 * @return          string of escaped text
 */
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips tags from the given HTML.
 * @param html string of HTML
 * @return string
 */
function stripTags(html) {
  return html.replace(/<[^>]+>/gi, '');
}

/**
 * Using the insertion sort algorithm, calculate the list of swaps needed
 * @param  arr    array to sort
 * @param  cmp    comparison function that takes (a, b) and returns <0, 0, or >0
 *          if a < b, a == b, or a > b
 * @returns a list of swaps, given in the form of [moved entry, entry-inserted-after]
 */
function calculateSwaps(arr, cmp) {
  let i, j, temp;
  const swaps = [];

  for (i = 1; i < arr.length; i++) {
    temp = arr[i];
    for (j = i - 1; j >= 0; j--) {
      if (typeof cmp === 'undefined') {
        if (temp < arr[j]) {
          arr[j + 1] = arr[j];
        } else {
          break;
        }
      } else if (cmp(temp, arr[j]) < 0) {
        arr[j + 1] = arr[j];
      } else {
        break;
      }
    }

    // Insertion
    if (j + 1 !== i) {
      arr[j + 1] = temp;
      swaps.push([i, j]);
    }
  }
  return swaps;
}

export default function Table(data, elem, fixedElem, topOffset, leftOffset) {
  const that = this;

  // Public members
  this.data = data;
  this.$thead = $('<thead></thead>');
  this.$tbody = $('<tbody></tbody>');
  this.$colgroup = $('<colgroup></colgroup>');
  this.$elem = $(elem);
  this.$fixedElem = $(fixedElem);

  // Columns
  let headers = [],
    fixedHeaders = [];
  let allHeaders, lastFixed;

  // Filters
  let filter = function() {
    // Default filter: include all
    return true;
  };
  let sortCompare = null;

  let displayedRows = [];

  /**
   * The row numbers of the rows in data to be displayed
   */
  Object.defineProperty(this, 'displayedRowNums', {
    get: function() {
      return displayedRows;
    },
    enumerable: true,
  });
  Object.defineProperty(this, 'displayedRows', {
    get: function() {
      const rows = [];
      for (let i = 0; i < displayedRows.length; i++) {
        rows.push(data[displayedRows[i]]);
      }
      return rows;
    },
  });

  /*
   * Populate table body.
   */
  this.$elem.empty();
  this.$elem
    .append(this.$colgroup)
    .append(this.$thead)
    .append(this.$tbody);

  /**
   * Function that's called with a table row that can be modified as desired.
   * The user should replace this if they want to add custom methods.
   * @param $tr
   * @param rowNum
   */
  this.rowCallback = function(/* $tr, rowNum */) {};

  this.postDisplayCallback = function() {};

  /**
   * Set the list of normal headers and columns (on the right of fixed columns)
   * @param  val    Array of columns, where each column is a hash in form:
   *           {field: 'field_in_data', title: 'Label'}
   */
  this.setHeaders = function(val) {
    headers = val;
    updateHeaders();
  };

  /**
   * Set the list of headers and columns to be fixed (at very left)
   * @param  val    Array of columns, where each column is a hash in form:
   *           {field: 'field_in_data', title: 'Label'}
   */
  this.setFixedHeaders = function(val) {
    fixedHeaders = val;
    updateHeaders();
  };

  /**
   * Sets the filter function for the table and forces a table redraw.
   * @param filterFunction    function(row) -> true if included, false if excluded
   */
  this.setFilter = function(filterFunction) {
    filter = filterFunction;
    updateDisplayedRows();
  };

  /**
   * Sets the comparator function for the table and forces a table redraw.
   * @param sortCompareFunction   function(rowA, rowB) -> -1 if rowA is first,
   *                              0 if equal, 1 if rowB is first; null to remove
   */
  this.setSortComparator = function(sortCompareFunction) {
    sortCompare = sortCompareFunction;
    updateDisplayedRows();
  };

  /**
   * Update the allHeaders and lastFixed variables to be consistent with the
   * headers, fixedHeaders arrays
   */
  function updateHeaders() {
    allHeaders = [];
    $.each(fixedHeaders, (k, v) => {
      allHeaders.push(v);
      lastFixed = v.field;
    });
    $.each(headers, (k, v) => {
      allHeaders.push(v);
    });
  }

  /**
   * Mapping of field -> width; overrides automatic width calculation
   */
  this.widths = {};

  /**
   * Mapping of field -> extra width; doesn't override automatic width
   * calculation, but adds the extra width to the calculated header width.
   * This is useful for adding icons or otherwise modifying the header.
   */
  this.extraHeaderWidths = {};

  const internalWidths = {};

  this.horizontalCellPadding = 0;
  this.rowHeight = 1;
  this.rowsToShow = 0;
  this.firstRow = 0;

  this.topOffset = topOffset;
  this.leftOffset = leftOffset;

  let columnOrder = [];

  /**
   * Given certain data, create a <td> with the given data
   * formatted a certain way. Should be structured as an associative
   * array such that:
   * 'field' => function(rowData, field)
   */
  this.htmlConverters = {};

  const defaultHtmlConverters = {
    string: function(rowData, field) {
      return escapeHtml(_.get(rowData, field));
    },
    number: function(rowData, field) {
      return escapeHtml(_.get(rowData, field).toString());
    },
    array: function(rowData, field) {
      return escapeHtml(_.get(rowData, field).join('; '));
    },
    object: function(rowData, field) {
      if (_.get(rowData, field) === null) return '';
      return escapeHtml(_.get(rowData, field).join('; '));
    },
    undefined: function(/* rowData, field */) {
      return '';
    },
  };

  /**
   * Given certain data, calculate the width it should take when displayed.
   * Used for calculating the widths of columns.
   */
  this.widthCalculators = {};
  const defaultWidthCalculators = {
    string: function(rowData, field) {
      return getWidth(_.get(rowData, field), 'tbody');
    },
    number: function(rowData, field) {
      return getWidth(_.get(rowData, field).toString(), 'tbody');
    },
    array: function(rowData, field) {
      return getWidth(_.get(rowData, field).join('; '), 'tbody');
    },
    object: function(rowData, field) {
      if (_.get(rowData, field) === null) return 0;
      return getWidth(_.get(rowData, field).join('; '), 'tbody');
    },
    undefined: function(/* rowData, field */) {
      return 0;
    },
  };

  /**
   * Cache of calculated character widths for characters.
   * Associative array of 'char' => width in pixels
   */
  const characterWidths = {
    thead: {}, // Header characters (in thead -> th)
    tbody: {}, // Non-header characters (in tbody -> tr)
  };

  /**
   * Converts data to HTML using the HTML converters defined by user, and if
   * missing, using the default HTML converter for the given type.
   * @param  rowData    data to change to HTML displayable form
   * @param  field    field to show
   * @return String
   */
  function generateCellInnerHtml(rowData, field) {
    let converter = that.htmlConverters[field];
    if (typeof converter === 'undefined') {
      const type = typeof _.get(rowData, field);
      converter = defaultHtmlConverters[type];

      if (typeof converter === 'undefined') {
        return '';
      }
    }
    return converter(rowData, field);
  }

  /**
   * Generates row HTML for the given row-number in the data.
   * @param rowNum
   * @param rowNumInDisplayedSet
   * @return {String}
   */
  function generateRowHtml(rowNum, rowNumInDisplayedSet) {
    const rowData = that.data[rowNum];
    const evenOdd = rowNumInDisplayedSet % 2 === 0 ? 'even' : 'odd';
    let rowHtml = '<tr class="r' + rowNum + ' ' + evenOdd + '">';

    if (typeof rowData === 'undefined') {
      return rowHtml + '</tr>';
    }

    for (let i = 0; i < columnOrder.length; i++) {
      const field = columnOrder[i];

      const tdClasses = ['_' + field.replace(/\./g, '_')];
      if (field === lastFixed) tdClasses.push('lastfixed');

      let html;
      if (field !== 'row') {
        html =
          '<td class="' +
          tdClasses.join(' ') +
          '">' +
          generateCellInnerHtml(rowData, field) +
          '</td>';
      } else {
        // The row numbers are always the displayed row numbers
        html =
          '<td class="' +
          tdClasses.join(' ') +
          '">' +
          generateCellInnerHtml(
            { row: (rowNumInDisplayedSet + 1).toString() },
            field
          ) +
          '</td>';
      }

      rowHtml += html;
    }

    rowHtml += '</tr>';

    return rowHtml;
  }

  const $theadSpan = $('<span>');
  const $theadTr = $('<tr>').append(
    $('<th>')
      .css('padding', 0)
      .css('margin', 0)
      .append($theadSpan)
  );
  const $tbodySpan = $('<span>');
  const $tbodyTr = $('<tr>').append(
    $('<td>')
      .css('padding', 0)
      .css('margin', 0)
      .append($tbodySpan)
  );
  this.$tbody.append($theadTr);
  this.$tbody.append($tbodyTr);

  /**
   * Get the width of all ASCII printable characters
   */
  function getCommonCharacterWidths() {
    let html = '<span id="chr32">&nbsp;</span>';
    // 32: space: first printable character
    // 126: ~: last printable character
    for (let i = 33; i <= 126; i++) {
      html += '<span id="chr' + i + '">' + String.fromCharCode(i) + '</span>';
    }

    const sections = ['thead', 'tbody'];
    for (let x = 0; x < sections.length; x++) {
      const section = sections[x];
      let $span;
      if (section === 'thead') {
        $span = $theadSpan;
      } else {
        $span = $tbodySpan;
      }
      $span.html(html);

      for (let i = 32; i <= 126; i++) {
        characterWidths[section][String.fromCharCode(i)] = $span
          .children('#chr' + i)
          .width();
      }
    }
  }

  /**
   * Get the width of a particular character, as it would appear in the table.
   * If it hasn't been gotten before, we'll create a pseudo-element.
   * @param  character  string; character whose width to get
   * @param   section     string; either 'thead' or 'tbody'
   */
  function getCharacterWidth(character, section) {
    if (!characterWidths[section][character]) {
      let $span;
      if (section === 'thead') {
        $span = $theadSpan;
      } else {
        $span = $tbodySpan;
      }

      if (character === ' ') {
        $span.text('\u00a0');
      } else {
        $span.text(character);
      }

      characterWidths[section][character] = $span.width();
    }
    return characterWidths[section][character];
  }

  /**
   * Return the width of a phrase, given its characters
   * @param word              string; word whose width to get
   * @param [section='tbody'] string; which section the word is to be displayed in -
   *                          either body or head
   */
  function getWidth(word, section) {
    let width = 0;
    for (let i = 0; i < word.length; i++) {
      const character = word[i];
      if (characterWidths[section][character]) {
        width += characterWidths[section][character];
      } else {
        width += getCharacterWidth(character, section);
      }
    }

    return width;
  }

  /**
   * Get the width of a certain kind of content, as specified by
   * the field `field', regardless of content type
   * @param  rowData    data for the given row
   * @param  field    field to display
   */
  function getContentWidth(rowData, field) {
    let widthCalculator = that.widthCalculators[field];
    const htmlConverter = that.htmlConverters[field];
    let width;

    if (widthCalculator) {
      // Has width calculator
      width = widthCalculator(rowData, field);
    } else if (htmlConverter) {
      // No width calculator, but convert to text first
      width = getWidth(stripTags(htmlConverter(rowData, field)), 'tbody');
    } else {
      // No width calculator: just deal with normally
      const type = typeof _.get(rowData, field);
      widthCalculator = defaultWidthCalculators[type];
      if (!widthCalculator) {
        width = 0;
      } else {
        width = widthCalculator(rowData, field);
      }
    }

    return width;
  }

  /**
   * Get the first row to display based on the vertical scrolling
   */
  function calculateNewFirstRow() {
    return Math.floor(
      Math.max($(document).scrollTop() / that.rowHeight - 1, 0)
    );
  }

  /**
   * Get the number of rows to show based on the size of the
   * .fixed div, which is itself based on the viewport size.
   */
  function calculateNumRowsToShow() {
    return Math.ceil(that.$fixedElem.height() / that.rowHeight) - 1;
  }

  /**
   * Get the first, non-fixed-pane column to show based on the
   * horizontal scrolling
   */
  function calculateNewFirstColumn() {
    let left = $(document).scrollLeft();
    let firstColumn;

    for (let i = 0; i < headers.length; i++) {
      const col = headers[i];
      const field = col.field;

      const width = internalWidths[field] + that.horizontalCellPadding;

      firstColumn = field;
      if (left <= 0) {
        break;
      }
      left -= width;
    }

    return firstColumn;
  }

  /**
   * Display the table, while hiding already displayed rows
   */
  function display(newFirstRow, newRowsToShow) {
    let i;

    // Hide width calculation fields
    $theadTr.remove();
    $tbodyTr.remove();

    newFirstRow =
      typeof newFirstRow !== 'undefined' ? newFirstRow : calculateNewFirstRow();
    newRowsToShow =
      typeof newRowsToShow !== 'undefined'
        ? newRowsToShow
        : calculateNumRowsToShow();

    // Hide all other rows
    let newPastLastRow = newFirstRow + newRowsToShow;
    if (newPastLastRow > displayedRows.length) {
      newPastLastRow = displayedRows.length;
      const emptyRows = newPastLastRow - displayedRows.length;
      newRowsToShow -= emptyRows;
    }
    const pastLastRow = that.firstRow + that.rowsToShow;

    // Calculate column order
    updateColumnOrder();
    p.addTime('Hides rows');

    // Hides rows before
    const pastLastToHide = Math.min(newFirstRow, pastLastRow);
    const toHideClasses = ['.rNoneExist']; // By default hide the message saying no rows to show
    for (i = that.firstRow; i < pastLastToHide; i++) {
      toHideClasses.push('.r' + displayedRows[i]);
    }

    // Hides rows after
    for (i = Math.max(newPastLastRow, that.firstRow); i < pastLastRow; i++) {
      toHideClasses.push('.r' + displayedRows[i]);
    }

    $(toHideClasses.join(',')).remove();

    p.addTime('Shows rows before');

    // Shows rows before
    const pastLastToShow = Math.min(newPastLastRow, that.firstRow);

    let htmlBefore = '';
    for (i = newFirstRow; i < pastLastToShow; i++) {
      htmlBefore += generateRowHtml(displayedRows[i], i);
    }
    that.$tbody.prepend(htmlBefore);

    p.addTime('Call before row callbacks');
    let rowNum;
    for (i = newFirstRow; i < pastLastToShow; i++) {
      rowNum = displayedRows[i];
      that.rowCallback($('.r' + rowNum), rowNum, that.data[rowNum]);
    }

    p.addTime('Shows rows after');

    // Shows rows after
    let htmlAfter = '';
    for (i = Math.max(pastLastRow, newFirstRow); i < newPastLastRow; i++) {
      htmlAfter += generateRowHtml(displayedRows[i], i);
    }
    that.$tbody.append(htmlAfter);

    p.addTime('Call after row callbacks');
    for (i = Math.max(pastLastRow, newFirstRow); i < newPastLastRow; i++) {
      rowNum = displayedRows[i];
      that.rowCallback($('.r' + rowNum), rowNum, that.data[rowNum]);
    }

    that.rowsToShow = newRowsToShow;
    that.firstRow = newFirstRow;

    if (displayedRows.length === 0) {
      that.$tbody.append(
        "<tr class='info'><td class='rNoneExist' colspan='" +
          columnOrder.length +
          "' style='text-align: center; font-weight: bold'>" +
          'There are no courses to show here</td></tr>'
      );
    }

    p.addTime('Done');
    p.clear();

    that.postDisplayCallback();
  }

  /**
   * Force the entire table being shown to be redrawn. Useful when
   * some data used by a rowCallback or htmlConverter has changed for
   * existing rows. This will probably break things if rows are added
   * or removed.
   */
  this.forceRedraw = function() {
    display(0, 0);
    display();
  };

  /**
   * Calculates the order in which we want to arrange columns,
   * and makes the appropriate adjustments
   */
  function updateColumnOrder() {
    let i;

    const q = new Profiler();
    q.addTime('Get first column');
    const firstColumn = calculateNewFirstColumn();

    // Order should be {hiddenColumns, fixedColumns, shownColumns}
    const hiddenColumns = [],
      fixedColumns = [],
      shownColumns = [];
    let hide = true;
    let hiddenWidth = 0;

    q.addTime('Find hidden columns before and outerWidths');

    // Find which columns to hide
    for (i = 0; i < headers.length; i++) {
      const field = headers[i].field;
      if (field === firstColumn) hide = false;

      if (hide) {
        hiddenColumns.push(headers[i].field);
        hiddenWidth += $('td._' + field + ':first').outerWidth();
      } else {
        shownColumns.push(headers[i].field);
      }
    }

    q.addTime('Push fixed columns');

    for (i = 0; i < fixedHeaders.length; i++) {
      fixedColumns.push(fixedHeaders[i].field);
    }

    const newColumnOrder = hiddenColumns.concat(fixedColumns, shownColumns);

    function columnCmp(col1, col2) {
      return $.inArray(col1, newColumnOrder) - $.inArray(col2, newColumnOrder);
    }

    q.addTime('Calculating swaps');

    const swaps = calculateSwaps(columnOrder.slice(0), columnCmp);

    if (swaps.length !== 0) {
      that.$elem.find('tr, colgroup').each(function() {
        const $tr = $(this);
        for (let i = 0; i < swaps.length; i++) {
          const elemIndex = swaps[i][0];
          const $col = $tr.children('._' + columnOrder[elemIndex]);
          const after = swaps[i][1];

          if (after === -1) {
            $tr.prepend($col);
          } else {
            const $afterCol = $tr.children('._' + newColumnOrder[after]);
            $afterCol.after($col);
          }
        }
      });
    }

    q.addTime('Setting hidden left positioning');

    // Reorder each column as needed
    columnOrder = newColumnOrder;

    that.$fixedElem.css('left', -hiddenWidth);
    q.addTime('Done');
  }

  /**
   * Updates the displayed rows based on filter, sort criteria.
   */
  function updateDisplayedRows() {
    display(0, 0);

    displayedRows = [];
    for (let i = 0; i < that.data.length; i++) {
      if (filter(that.data[i])) {
        displayedRows.push(i);
      }
    }

    if (sortCompare !== null) {
      displayedRows.sort((a, b) => {
        return sortCompare(that.data[a], that.data[b]);
      });
    }

    $('body').height(
      (displayedRows.length + 6) * that.rowHeight + that.topOffset
    );
    display();
  }

  /**
   * Returns an array of indexes in the data object that we're displaying.
   * @return {Array}
   */
  this.getDisplayedRowIndexes = function() {
    return displayedRows;
  };

  /**
   * Sets the positioning of the surrounding fixed element.
   */
  function setFixedPosition() {
    that.$fixedElem
      .css('left', that.leftOffset + 'px')
      .css('top', that.topOffset + 'px')
      .height($(window).height() - that.topOffset);
  }

  /**
   * Gets rowHeight and horizontalCellPadding.
   *
   * @return array with [0] as cell height, [1] as cell horizontal padding
   */
  function getCellDimensions() {
    const $tr = $('<tr>');
    const $td = $('<td>');

    $td.text('test');
    $tr.append($td);

    that.$tbody.append($tr);

    const cellHeight = $tr.height();
    const horizontalCellPadding =
      parseInt($td.css('padding-left'), 10) +
      parseInt($td.css('padding-right'), 10);

    $tr.remove();

    return [cellHeight, horizontalCellPadding];
  }

  /**
   * Display the table header based on the data given by setHeaders,
   * setFixedHeaders. Used as a part of table redrawing.
   */
  function displayHeader() {
    // Display header
    const $tr = $('<tr>');
    $tr.addClass('header');

    for (let i = 0; i < allHeaders.length; i++) {
      const col = allHeaders[i];
      const field = col.field,
        title = col.title;

      const $th = $('<th>');
      $th.addClass('_' + field.replace(/\./g, '_'));
      if ('tooltip' in col) {
        const placement = 'placement' in col ? col.placement : 'top';
        const $thLink = $(
          '<a rel="tooltip" href="#" style="display: block; width: 100%;"></a>'
        );
        $thLink.click(event => {
          event.preventDefault();
        });
        $thLink
          .text(title)
          .attr('title', col.tooltip)
          .tooltip({ placement: placement, container: 'body' });
        $th.append($thLink);
      } else {
        $th.text(title);
      }
      $tr.append($th);
    }
    that.$thead.append($tr);
  }

  /**
   * Adjust column widths so that they fit all the data given and store the
   * results in internalWidths.
   * @remarks    If column widths are auto, it adjusts it to fit the widest
   *         data of that column. Otherwise, a fixed width is used.
   */
  function populateColumnInternalWidths() {
    for (let j = 0; j < allHeaders.length; j++) {
      const info = allHeaders[j];
      const field = info.field;

      if (
        that.widths[field] === 'auto' ||
        typeof that.widths[field] === 'undefined'
      ) {
        // Calculate the widths
        internalWidths[field] = getWidth(info.title, 'thead');
        if (typeof that.extraHeaderWidths[field] !== 'undefined') {
          internalWidths[field] += that.extraHeaderWidths[field];
        }

        for (let i = 0; i < that.data.length; i++) {
          const entry = that.data[i];
          internalWidths[field] = Math.max(
            getContentWidth(entry, field),
            internalWidths[field]
          );
        }
      } else {
        // Use given widths
        internalWidths[field] = that.widths[field];
      }
    }
  }

  /**
   * Creates the col elements for each of the columns. Assumes that:
   * 1. internalWidths is populated
   * 2. There exists a header row in this.$thead
   */
  function displayColGroup() {
    that.$colgroup.empty();

    for (let i = 0; i < allHeaders.length; i++) {
      const col = allHeaders[i];
      const field = col.field;
      const $col = $('<col>');
      $col.addClass('_' + field);
      $col.width(internalWidths[field] + that.horizontalCellPadding);
      that.$colgroup.append($col);
    }
  }

  /**
   * Sets the body's width so that scrolling works properly.
   */
  function updateBodyWidth() {
    // Adjust outer width so that iscrollbar matches table
    let totalOuterWidth = 0;
    for (let j = 0; j < allHeaders.length; j++) {
      const field = allHeaders[j].field;
      totalOuterWidth += $('th._' + field + ':first').outerWidth();
    }
    $('body').width(totalOuterWidth + 200);
  }

  /**
   * Initializes and displays initial table.
   */
  this.init = function() {
    setFixedPosition();
    getCommonCharacterWidths();

    const cellDimensions = getCellDimensions();
    this.rowHeight = cellDimensions[0];
    this.horizontalCellPadding = cellDimensions[1];

    displayHeader();
    populateColumnInternalWidths();
    displayColGroup();
    updateBodyWidth();

    updateDisplayedRows();

    const handleScroll = function() {
      display();
    };
    const handleResize = function() {
      setFixedPosition();
      display();
    };
    $(window)
      .off('scroll')
      .on('scroll', handleScroll);
    $(window)
      .off('resize')
      .on('resize', handleResize);
  };
}
