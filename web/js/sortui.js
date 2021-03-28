import $ from 'jquery';
import _ from 'lodash';

/**
 * Creates a sort UI that wraps around the surroundingSelector, reporting
 * interactions to the sortManager.
 * @constructor
 */
export function SortUi() {
  const that = this;

  let name;
  let surroundingSelector;
  let sortManager;

  let $popoverDiv;
  let $clearButton;
  let $sortAscendingButton;
  let $sortDescendingButton;
  let $sortButtons;

  /**
   * Either null when no sort's enabled or the strings 'ASC' and 'DESC'
   */
  let enabledSort = null;

  let $sortIcon = null;
  let $tableHeader = null;

  /**
   * If there's a table header attached, update its state per active filter.
   */
  function updateTableHeaderState() {
    if ($tableHeader === null && $sortIcon === null) {
      return;
    }
    $tableHeader.removeClass('sortui-sort-active');
    $sortIcon
      .removeClass('icon-arrow-down')
      .removeClass('icon-arrow-up')
      .addClass('icon-resize-vertical');

    if (enabledSort !== null) {
      $tableHeader.addClass('sortui-sort-active');
      $sortIcon.removeClass('icon-resize-vertical');
      if (enabledSort === 'ASC') {
        $sortIcon.addClass('icon-arrow-up');
      } else {
        $sortIcon.addClass('icon-arrow-down');
      }
    }
  }

  function updateClearButtonState() {
    if (enabledSort) {
      $clearButton.removeAttr('disabled');
    } else {
      $clearButton.attr('disabled', 'disabled');
    }
  }

  function updateSortButtonStates() {
    $sortButtons.removeClass('active');
    $sortButtons.removeClass('btn-success');
    $sortButtons.find('i').removeClass('icon-white');
    let $buttonToPress;
    if (enabledSort === null) {
      return;
    } else if (enabledSort === 'ASC') {
      $buttonToPress = $sortAscendingButton;
    } else {
      $buttonToPress = $sortDescendingButton;
    }
    $buttonToPress.addClass('active');
    $buttonToPress.addClass('btn-success');
    $buttonToPress.find('i').addClass('icon-white');
  }

  /**
   * Initializes the sort, enabling Javscript events on the UI.
   * @param nameVal                   string; Unique identifier for the SortUi, used when
   *                                  communicating with the sortManager
   * @param surroundingSelectorVal    string or DOM element; used to attach JS to DOM
   * @param sortManagerVal            SortManager; the UI communicates with this to apply
   *                                  the sort to the table
   */
  this.init = function(nameVal, surroundingSelectorVal, sortManagerVal) {
    name = nameVal;
    surroundingSelector = surroundingSelectorVal;
    sortManager = sortManagerVal;
    sortManager.registerSortUi(name, this);

    $popoverDiv = $(surroundingSelector);
    $clearButton = $popoverDiv.find('.clear-btn');
    $sortAscendingButton = $popoverDiv.find('.sort-asc-btn');
    $sortDescendingButton = $popoverDiv.find('.sort-desc-btn');
    $sortButtons = $popoverDiv.find('.sort-asc-btn, .sort-desc-btn');

    updateTableHeaderState();
    updateClearButtonState();
    updateSortButtonStates();

    $sortButtons.off('click').on('click', event => {
      if ($(event.delegateTarget).hasClass('sort-asc-btn')) {
        enabledSort = 'ASC';
      } else {
        enabledSort = 'DESC';
      }
      updateTableHeaderState();
      updateClearButtonState();
      updateSortButtonStates();
      sortManager.useSort(name, enabledSort);
    });

    $clearButton.off('click').on('click', () => {
      that.clear();
      sortManager.clearSort(name);
    });
  };

  /**
   * This sort has been disabled, but not via the internal UI.
   * Updates the UI to reflect htis.
   */
  this.clear = function() {
    enabledSort = null;
    updateTableHeaderState();
    updateClearButtonState();
    updateSortButtonStates();
  };

  /**
   * Attaches table header to be updated with sorts.
   * @param $tableHeaderVal   JQuery element for table header
   * @param $sortIconVal      JQuery element for sort icon
   */
  this.attachTableHeader = function($tableHeaderVal, $sortIconVal) {
    $tableHeader = $tableHeaderVal;
    $sortIcon = $sortIconVal;
  };
}

/**
 * Creates a sort UI that wraps around the surroundingSelector, reporting
 * interactions to the sortManager. Has different buttons for each weekday.
 * @constructor
 */
export function TimeSortUi() {
  const that = this;

  let name;
  let surroundingSelector;
  let sortManager;

  let $popoverDiv;
  let $clearButton;
  let $weekDayButtons;
  let $sortAscendingButton;
  let $sortDescendingButton;
  let $sortButtons;

  let $sortIcon = null;
  let $tableHeader = null;

  /**
   * Object that's either null when there's no filter, or has entries
   * day_of_week: one of M, T, W, Th, F
   * order: one of ASC, DESC
   * @type Object
   */
  let enabledSort = null;

  const letterToDay = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    Th: 'Thursday',
    F: 'Friday',
  };

  function updateStates() {
    updateClearButtonState();
    updateSortButtonStates();
    updateTableHeaderState();
  }

  /**
   * If there's a table header attached, update its state per active filter.
   */
  function updateTableHeaderState() {
    if ($tableHeader === null && $sortIcon === null) {
      return;
    }
    $tableHeader.removeClass('sortui-sort-active');
    $sortIcon
      .removeClass('icon-arrow-down')
      .removeClass('icon-arrow-up')
      .addClass('icon-resize-vertical');

    if (enabledSort !== null) {
      $tableHeader.addClass('sortui-sort-active');
      $sortIcon.removeClass('icon-resize-vertical');
      if (enabledSort.order === 'ASC') {
        $sortIcon.addClass('icon-arrow-up');
      } else {
        $sortIcon.addClass('icon-arrow-down');
      }
    }
  }

  /**
   * Updates the clear button states based on the current filter.
   */
  function updateClearButtonState() {
    if (enabledSort !== null) {
      $clearButton.removeAttr('disabled');
    } else {
      $clearButton.attr('disabled', 'disabled');
    }
  }

  function getActiveWeekDayButton() {
    return $popoverDiv.find('.weekday-btn-group .active');
  }

  /**
   * Updates the sort button states based on the weekday-button.
   */
  function updateSortButtonStates() {
    const $activeWeekDayButton = getActiveWeekDayButton();

    $sortButtons.removeClass('btn-success').removeClass('active');
    $sortButtons.removeAttr('disabled');
    $sortButtons.find('i').removeClass('icon-white');

    if ($activeWeekDayButton.length === 0) {
      $sortButtons.attr('disabled', 'disabled');
    } else if (
      enabledSort !== null &&
      $activeWeekDayButton.text() === enabledSort.day_of_week
    ) {
      let $successButton;
      if (enabledSort.order === 'ASC') {
        $successButton = $sortAscendingButton;
      } else {
        $successButton = $sortDescendingButton;
      }
      $successButton.addClass('btn-success');
      $successButton.addClass('active');
      $successButton.find('i').addClass('icon-white');
    }
  }

  /**
   * Updates the weekday button states to match the active filter.
   */
  function updateToMatchFilter() {
    $weekDayButtons.removeClass('active');
    $weekDayButtons.removeClass('btn-success');
    if (enabledSort !== null) {
      const $buttonToPress = $weekDayButtons.filter(function() {
        return $(this).text() === enabledSort.day_of_week;
      });
      $buttonToPress.addClass('active');
      $buttonToPress.addClass('btn-success');
    }

    updateStates();
  }

  /**
   * @see SortUi.init
   */
  this.init = function(nameVal, surroundingSelectorVal, sortManagerVal) {
    name = nameVal;
    surroundingSelector = surroundingSelectorVal;
    sortManager = sortManagerVal;
    sortManager.registerSortUi(name, this);

    $popoverDiv = $(surroundingSelector);
    $clearButton = $popoverDiv.find('.clear-btn');
    $weekDayButtons = $popoverDiv.find('.weekday-btn-group .btn');
    $sortAscendingButton = $popoverDiv.find('.sort-asc-btn');
    $sortDescendingButton = $popoverDiv.find('.sort-desc-btn');
    $sortButtons = $popoverDiv.find('.sort-asc-btn, .sort-desc-btn');

    updateStates();

    $weekDayButtons.off('click').on('click', event => {
      $weekDayButtons.each(function() {
        if ($(this).text() !== $(event.delegateTarget).text()) {
          $(this).removeClass('active');
        }
      });
      $(event.delegateTarget).addClass('active');
      updateStates();
    });

    $sortButtons.off('click').on('click', event => {
      let order;
      if ($(event.delegateTarget).hasClass('sort-asc-btn')) {
        order = 'ASC';
      } else {
        order = 'DESC';
      }
      enabledSort = {
        day_of_week: getActiveWeekDayButton().text(),
        order: order,
      };
      updateToMatchFilter();
      const fullWeekDayEnabledSort = $.extend({}, enabledSort);
      fullWeekDayEnabledSort.day_of_week = letterToDay[enabledSort.day_of_week];
      sortManager.useSort(name, fullWeekDayEnabledSort);
    });

    $clearButton.off('click').on('click', () => {
      that.clear();
      sortManager.clearSort(name);
    });
  };

  /**
   * @see SortUi.clear
   */
  this.clear = function() {
    enabledSort = null;
    updateToMatchFilter();
  };

  /**
   * @see SortUi.attachTableHeader
   */
  this.attachTableHeader = function($tableHeaderVal, $sortIconVal) {
    $tableHeader = $tableHeaderVal;
    $sortIcon = $sortIconVal;
  };
}

/**
 * Manages sorts for a table. Link between the underlying table sort
 * comparator and the UI components.
 */
export function SortManager() {
  const that = this;

  let table = null;
  const sortUis = {};
  const sortComparatorGenerators = {};

  let activeSortName = null;

  /**
   * Register a SortUi object so that we can communicate when it's
   * sort has been overridden by another.
   * @param sortName  string; The name for the sort (unique identifier to track)
   * @param sortUi    SortUi; The SortUi object with a clear() method
   */
  this.registerSortUi = function(sortName, sortUi) {
    sortUis[sortName] = sortUi;
  };

  /**
   * Clears the sorting UI's to a state where no sorts are enabled.
   * @param newActiveSortName     string; the new sort that we're using or
   *                              null if we're just clearing
   */
  function clearUiSort(newActiveSortName) {
    if (activeSortName !== null && activeSortName !== newActiveSortName) {
      sortUis[activeSortName].clear();
    }
    activeSortName = null;
  }

  /**
   * Called by a SortUi object when someone has disabled a sort through
   * the UI.
   * @param sortName  string; The name of the sort to disable (unique identifier);
   *                  currently unused by might be necessary in the future
   */
  this.clearSort = function() {
    clearUiSort(null);
    if (table !== null) {
      table.setSortComparator(null);
    }
  };

  const availableSortComparatorGenerators = {
    numeric: function(sortName, data) {
      return function(rowA, rowB) {
        const valueComparator = that.generateValueComparator(true, data);
        return valueComparator(_.get(rowA, sortName), _.get(rowB, sortName));
      };
    },

    text: function(sortName, data) {
      return function(rowA, rowB) {
        const valueComparator = that.generateValueComparator(false, data);
        return valueComparator(_.get(rowA, sortName), _.get(rowB, sortName));
      };
    },
  };

  /**
   * Called by a SortUi object when someone has enabled a sort through
   * the UI.
   * @param sortName  string; The name of the sort to enable (unique identifier)
   * @param data      mixed; Extra data for setting up the sort; default comparator
   *                  generators can handle data of the form of a string 'ASC' or 'DESC'
   */
  this.useSort = function(sortName, data) {
    clearUiSort(sortName);
    activeSortName = sortName;
    let activeComparator;
    if (sortName in sortComparatorGenerators) {
      activeComparator = sortComparatorGenerators[sortName](sortName, data);
    } else {
      activeComparator = availableSortComparatorGenerators.text(sortName, data);
    }
    if (table !== null) {
      table.setSortComparator(activeComparator);
    }
  };

  /**
   * Registers a custom comparator to be used for the given sortName.
   * @param sortName      string; The name of the sort to use this generator for
   * @param sortComparatorGenerator   function(sortName, data) -> comparator of form
   *                                  function(rowA, rowB)
   */
  this.registerSortComparatorGenerator = function(
    sortName,
    sortComparatorGenerator
  ) {
    sortComparatorGenerators[sortName] = sortComparatorGenerator;
  };

  /**
   * Register one of the default sort comparators to be used.
   * @param sortName      string; The name of the sort to use this generator for
   * @param generatorName string; The name of the generator to use
   */
  this.useSortComparatorGeneratorForSort = function(sortName, generatorName) {
    if (!(generatorName in availableSortComparatorGenerators)) {
      throw new Error('Generator not found');
    }
    sortComparatorGenerators[sortName] =
      availableSortComparatorGenerators[generatorName];
  };

  /**
   * A default sort comparator generator that can be used to construct
   * custom sort comparators. For an example of its use:
   * @see numericSortComparatorGenerator
   * @param numeric   boolean; Whether to sort numerically
   * @param data      string; either ASC or DESC to indicate sort order
   * @return {Function}
   */
  this.generateValueComparator = function(numeric, data) {
    return function(valueA, valueB) {
      const multiplier = data === 'ASC' ? 1 : -1;
      const aExists =
        valueA !== undefined &&
        valueA !== null &&
        !($.isArray(valueA) && valueA.length === 0);
      const bExists =
        valueB !== undefined &&
        valueB !== null &&
        !($.isArray(valueB) && valueB.length === 0);

      if (aExists && !bExists) {
        return -1;
      } else if (bExists && !aExists) {
        return 1;
      } else if (!aExists && !bExists) {
        return 0;
      }

      if (numeric) {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }
      if (valueA < valueB) {
        return -1 * multiplier;
      } else if (valueB < valueA) {
        return 1 * multiplier;
      }
      return 0;
    };
  };

  /**
   * Sets the table that to order sorts on.
   */
  this.setTable = function(newTable) {
    table = newTable;
  };
}
