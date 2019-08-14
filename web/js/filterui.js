import $ from 'jquery';
import moment from 'moment';
import _ from 'lodash';

//
// How-To:
// All filters are managed by a FilterManager.
// One can register filters by name, and they usually have two components:
// - registerFilterUi(name, filterUi) registers a FilterUi object.
//   A FilterUi object must implement:
//   - clear(), which is called by the FilterManager when the filter in question
//     is deactivated
//   (Everything else is optional.)
//   - Often, init() alsoi
// - a filter generator, set using:
//   - registerFilterGenerator(name, filterGenerator).
//     The FilterGenerator is a function passed the data (e.g. a search string)
//     that then returns a function that:
//     - Returns true if the row matches and should be displayed,
//     - Returns false otherwise
//   - useFilterGeneratorForFilter(name, fieldToCheck)
//     Registers a generic filter manager (e.g. for text).
//

/**
 * An on-off filter based around a checkbox
 * @constructor
 */
export function CheckboxBooleanFilterUi() {
  let name;
  let $checkbox;
  let filterManager;

  /**
   * Attach the UI element that the filter widgets are inside
   * @param nameVal               string name of the filter; passed to FilterManager
   * @param surroundingSelector   string or DOM element for checkbox
   * @param filterManagerVal      FilterManager; the UI calls this on changes
   * @param filter                Function for the filter to turn on and off
   */
  this.init = function(nameVal, checkboxSelector, filterManagerVal, filter) {
    name = nameVal;
    $checkbox = $(checkboxSelector);
    filterManager = filterManagerVal;

    filterManager.registerFilterGenerator(name, () => {
      return filter;
    });
    filterManager.registerFilterUi(name, this);

    $checkbox.off('change.filter').on('change.filter', () => {
      if ($checkbox.prop('checked')) {
        filterManager.activateFilter(name);
      } else {
        filterManager.deactivateFilter(name);
      }
    });
  };

  /**
   * Marks this filter as cleared, but not through the UI.
   */
  this.clear = function() {
    $checkbox.prop('checked', false);
  };
}

/**
 * Filter by cateogory using a select box that's formatted
 * using select2.
 * @constructor
 */
export function CategoryFilterUi() {
  const that = this;

  let name;
  let filterManager;

  let $surroundingElem;
  let $clearButton;
  let $select;

  let usingSelect2 = null;
  let realValues = [];
  let values = [];

  let $tableHeader = null;

  function updateStates() {
    updateTableHeaderState();
    updateClearButtonState();
  }

  /**
   * If there's a table header attached, update its state per active filter.
   */
  function updateTableHeaderState() {
    if ($tableHeader === null) {
      return;
    }
    $tableHeader.addClass('filterui-filter-active');
    if (
      (usingSelect2 && $select.val() === null) ||
      (!usingSelect2 &&
        $select.val() !== null &&
        $select.val().length === realValues.length)
    ) {
      $tableHeader.removeClass('filterui-filter-active');
    }
  }

  /**
   * Updates the clear button state to update the values.
   */
  function updateClearButtonState() {
    if (
      (usingSelect2 && $select.val() == null) ||
      (!usingSelect2 &&
        $select.val() != null &&
        $select.val().length === realValues.length)
    ) {
      $clearButton.attr('disabled', 'disabled');
    } else {
      $clearButton.removeAttr('disabled');
    }
  }

  /**
   * Attach the UI element that the filter widgets are inside
   * @param nameVal               string name of the filter; passed to FilterManager
   * @param surroundingSelector   string or DOM element that wraps all of
   *                              the filter items
   * @param filterManagerVal      FilterManager; the UI calls this on changes
   */
  this.init = function(nameVal, surroundingSelector, filterManagerVal) {
    name = nameVal;
    filterManager = filterManagerVal;
    filterManager.useFilterGeneratorForFilter(name, 'category');
    filterManager.registerFilterUi(name, this);

    $surroundingElem = $(surroundingSelector);
    $clearButton = $surroundingElem.find('.clear-btn');
    $select = $surroundingElem.find('select[multiple="multiple"]');

    this.setUseSelect2(true);

    $clearButton.off('click').on('click', () => {
      that.clear();
      filterManager.deactivateFilter(name);
    });

    $select.off('change').on('change', () => {
      updateStates();
      if ($select.val() === null) {
        filterManager.deactivateFilter(name);
      } else {
        filterManager.activateFilter(name, $select.val());
      }
    });

    ensureEmptyOptionExists();
    updateStates();
  };

  /**
   * Ensures that there's an empty option so that the placeholder displays correctly.
   */
  function ensureEmptyOptionExists() {
    const emptyOption = $select.find('option').filter(function() {
      return $(this).text() === '';
    });
    if (emptyOption.length === 0) {
      $select.append('<option></option>');
    }
  }

  /**
   * Repopulates the select with values based on the $select.
   */
  function repopulateSelect() {
    $select.empty();
    if (usingSelect2) {
      ensureEmptyOptionExists();
    }
    values.sort();

    // Add new options
    for (let i = 0; i < values.length; i++) {
      if ($.isArray(values[i])) {
        $select.append(
          $('<option></option>')
            .text(values[i][0])
            .val(values[i][1])
        );
      } else if (values[i] === null) {
        $select.append($('<option value="@null">None</option>'));
      } else {
        $select.append($('<option></option>').text(values[i]));
      }
    }
  }

  /**
   * Populates the realValues array with just the values.
   */
  function populateRealValues() {
    realValues = [];
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if ($.isArray(value)) {
        realValues.push(value[1]);
      } else if (values[i] === null) {
        realValues.push('@null');
      } else {
        realValues.push(value);
      }
    }
  }

  /**
   * Sets the values that are available for filtering
   * @param valuesVal Array of values available for filtering; each element
   *                  can be a string for the Text or an array of [Text, Value]
   */
  this.setSelectValues = function(valuesVal) {
    values = valuesVal;
    populateRealValues();
    repopulateSelect();
  };

  /**
   * Marks this filter as cleared, but not through the UI.
   */
  this.clear = function() {
    if (usingSelect2) {
      $select.val([]).trigger('change');
    } else {
      $select.val(realValues).trigger('change');
    }
    updateStates();
  };

  /**
   * Attaches table header to be updated with filter as visual signal.
   * @param $tableHeaderVal   JQuery element for table header
   */
  this.attachTableHeader = function($tableHeaderVal) {
    $tableHeader = $tableHeaderVal;
  };

  /**
   * Set whether to use the fancy select2 control.
   * @param useSelect2
   */
  this.setUseSelect2 = function(useSelect2) {
    if (usingSelect2 === useSelect2) {
      return;
    }
    usingSelect2 = useSelect2;
    const savedVal = $select.val();
    repopulateSelect();
    if (savedVal !== null) {
      $select.val(savedVal).trigger('change');
    }
    setValuesToMatchSelect2Mode();
    if (usingSelect2) {
      $select.select2();
    } else {
      $select.select2('destroy');
    }
  };

  /**
   * Updates the values selected so that when we toggle modes and we have a "empty" selection,
   * it resets it.
   */
  function setValuesToMatchSelect2Mode() {
    if (
      (!usingSelect2 && $select.val() == null) ||
      (usingSelect2 &&
        $select.val() != null &&
        $select.val().length === realValues.length)
    ) {
      that.clear();
    }
  }
}

/**
 * A filter for choosing a single category, built around a single select-box.
 * @constructor
 */
export function SingleCategoryFilterUi() {
  const that = this;
  let name;
  let filterManager;

  let $select;

  /**
   * Attaches the DOM for this filter-ui.
   * @param nameVal
   * @param selectSelector
   * @param filterManagerVal
   */
  this.init = function(nameVal, selectSelector, filterManagerVal) {
    name = nameVal;
    $select = $(selectSelector);
    filterManager = filterManagerVal;
    filterManager.registerFilterUi(name, this);

    $select.off('change').on('change', event => {
      const value = $select.select2('val');
      if (value === '') {
        filterManager.deactivateFilter(name);
        if (that.offCallback) {
          that.offCallback(event);
        }
      } else {
        filterManager.activateFilter(name, value);
        if (that.onCallback) {
          that.onCallback(event);
        }
      }
    });
  };

  this.clear = function() {
    $select.select2('data', null);
    $select.select2('val', '');
    $select.trigger('change');
  };
}

/**
 * Filter above and/or below two numbers.
 * @constructor
 */
export function AboveBelowFilterUi() {
  const that = this;

  let name;
  let filterManager;

  let $surroundingElem;
  let $clearButton;
  let $aboveInput;
  let $belowInput;
  let $inputs;
  let $filterButton;

  let $tableHeader = null;

  /**
   * Attach the UI element that the filter widgets are inside
   * @param nameVal               string name of the filter; passed to FilterManager
   * @param surroundingSelector   string or DOM element that wraps all of
   *                              the filter items
   * @param filterManagerVal      FilterManager; the UI calls this on changes
   */
  this.init = function(nameVal, surroundingSelector, filterManagerVal) {
    name = nameVal;
    filterManager = filterManagerVal;
    filterManager.useFilterGeneratorForFilter(name, 'aboveBelow');
    filterManager.registerFilterUi(name, this);

    $surroundingElem = $(surroundingSelector);
    $clearButton = $surroundingElem.find('.clear-btn');
    $aboveInput = $surroundingElem.find('.above-input');
    $belowInput = $surroundingElem.find('.below-input');
    $inputs = $surroundingElem.find('.above-input, .below-input');
    $filterButton = $surroundingElem.find('.filter-btn');

    $clearButton.off('click').on('click', () => {
      that.clear();
      filterManager.deactivateFilter(name);
    });

    $inputs.off('change').on('change', () => {
      updateStates();
      const data = {};
      if (checkInputValidity($aboveInput) === true) {
        data.above = parseFloat($aboveInput.val());
      }
      if (checkInputValidity($belowInput) === true) {
        data.below = parseFloat($belowInput.val());
      }
      if ('above' in data || 'below' in data) {
        filterManager.activateFilter(name, data);
      } else {
        filterManager.deactivateFilter(name);
      }
    });

    updateStates();
  };

  function updateStates() {
    updateTableHeaderState();
    updateClearButtonState();
    updateInputStates();
  }

  function updateTableHeaderState() {
    if ($tableHeader !== null) {
      $tableHeader.removeClass('filterui-filter-active');
      if (
        checkInputValidity($aboveInput) === true ||
        checkInputValidity($belowInput) === true
      ) {
        $tableHeader.addClass('filterui-filter-active');
      }
    }
  }

  function updateClearButtonState() {
    if ($aboveInput.val() === '' && $belowInput.val() === '') {
      $clearButton.attr('disabled', 'disabled');
    } else {
      $clearButton.removeAttr('disabled');
    }
  }

  /**
   * Checks whether an input element is valid.
   * @param $input    Input JQuery element
   * @return {*}      boolean validity, or null if empty
   */
  function checkInputValidity($input) {
    $input
      .parent()
      .removeClass('error')
      .removeClass('success');
    const text = $input.val();
    if (text !== '') {
      if ($.isNumeric(text)) {
        $input.parent().addClass('success');
        return true;
      } else {
        $input.parent().addClass('error');
        return false;
      }
    }
    return null;
  }

  function updateInputStates() {
    const valid =
      checkInputValidity($aboveInput) === true ||
      checkInputValidity($belowInput) === true;
    $filterButton.removeClass('btn-success');
    if (valid) {
      $filterButton.addClass('btn-success');
    }
  }

  /**
   * Called when the filter UI needs to be cleared; usually called
   * by the FilterManager.
   */
  this.clear = function() {
    $aboveInput.val('');
    $belowInput.val('');
    updateStates();
  };

  /**
   * Attaches table header to be updated with filter as visual signal.
   * @param $tableHeaderVal   JQuery element for table header
   */
  this.attachTableHeader = function($tableHeaderVal) {
    $tableHeader = $tableHeaderVal;
  };
}

/**
 * Filter for filtering by whether a row contains some text in a certain field.
 * @constructor
 */
export function TextFilterUi() {
  const that = this;

  let name;
  let filterManager;

  let $surroundingElem;
  let $clearButton;
  let $input;
  let $filterButton;

  let $tableHeader = null;

  /**
   * Attach the UI element that the filter widgets are inside
   * @param nameVal               string name of the filter; passed to FilterManager
   * @param surroundingSelector   string or DOM element that wraps all of
   *                              the filter items
   * @param filterManagerVal      FilterManager; the UI calls this on changes
   * @param updateAction          updates on this action on the text field (default: 'change')
   */
  this.init = function(
    nameVal,
    surroundingSelector,
    filterManagerVal,
    updateAction
  ) {
    if (typeof updateAction === 'undefined') {
      updateAction = 'change';
    }

    name = nameVal;
    filterManager = filterManagerVal;
    filterManager.useFilterGeneratorForFilter(name, 'text');
    filterManager.registerFilterUi(name, this);

    $surroundingElem = $(surroundingSelector);
    $clearButton = $surroundingElem.find('.clear-btn');
    $input = $surroundingElem.find('.search-filter-input');
    $filterButton = $surroundingElem.find('.filter-btn');

    $clearButton.off('click').on('click', () => {
      that.clear();
      filterManager.deactivateFilter(name);
    });

    updateStates();

    $input.off(updateAction).on(updateAction, () => {
      updateStates();
      if ($input.val() === '') {
        filterManager.deactivateFilter(name);
      } else {
        filterManager.activateFilter(name, $input.val());
      }
    });

    $surroundingElem.off('submit').on('submit', event => {
      event.preventDefault();
    });
  };

  function updateStates() {
    updateTableHeaderState();
    updateInputState();
    updateClearButtonState();
  }

  function updateTableHeaderState() {
    if ($tableHeader === null) {
      return;
    }
    $tableHeader.removeClass('filterui-filter-active');
    if ($input.val() !== '') {
      $tableHeader.addClass('filterui-filter-active');
    }
  }

  function updateInputState() {
    $input.parent().removeClass('success');
    $filterButton.removeClass('btn-success');
    if ($input.val() !== '') {
      $input.parent().addClass('success');
      $filterButton.addClass('btn-success');
    }
  }

  function updateClearButtonState() {
    $clearButton.attr('disabled', 'disabled');
    if ($input.val() !== '') {
      $clearButton.removeAttr('disabled');
    }
  }

  /**
   * Called when the filter UI needs to be cleared; usually called
   * by the FilterManager.
   */
  this.clear = function() {
    $input.val('');
    updateStates();
  };

  /**
   * Attaches table header to be updated with filter as visual signal.
   * @param $tableHeaderVal   JQuery element for table header
   */
  this.attachTableHeader = function($tableHeaderVal) {
    $tableHeader = $tableHeaderVal;
  };
}

/**
 * Filter for course times.
 * @constructor
 */
export function TimeFilterUi() {
  const that = this;

  let name;
  let filterManager;

  let $surroundingElem;
  let $clearButton;
  let $weekDayButtons;
  let $beforeAfterButtons;
  let $timeInput;
  let $filterButton;

  let $tableHeader = null;

  /**
   * The active filter, with members day_of_week ('Monday', ...),
   * type ('Before', 'After') and time (whatever's in the text input)
   * @type {Object}
   */
  let currentFilter = {};

  const letterToDay = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    Th: 'Thursday',
    F: 'Friday',
  };

  function isFilterActive() {
    return 'day_of_week' in currentFilter;
  }

  /**
   * Parse a user-provided time.
   * @param time  string
   * @return {*}  moment object
   */
  function parseTime(time) {
    return moment(time, ['ha', 'hA', 'h:mma', 'h:mmA', 'H', 'H:mm']);
  }

  /**
   * Attach the UI element that the filter widgets are inside
   * @param nameVal               string name of the filter; passed to FilterManager
   * @param surroundingSelector   string or DOM element that wraps all of
   *                              the filter items
   * @param filterManagerVal      FilterManager; the UI calls this on changes
   */
  this.init = function(nameVal, surroundingSelector, filterManagerVal) {
    name = nameVal;
    filterManager = filterManagerVal;
    filterManager.useFilterGeneratorForFilter(name);
    filterManager.registerFilterUi(name, this);

    $surroundingElem = $(surroundingSelector);
    $clearButton = $surroundingElem.find('.clear-btn');
    $weekDayButtons = $surroundingElem.find('.weekday-btn-group .btn');
    $beforeAfterButtons = $surroundingElem.find('.before-after-btn-group .btn');
    $timeInput = $surroundingElem.find('.time-input');
    $filterButton = $surroundingElem.find('.filter-btn');

    updateStates();

    $clearButton.off('click').on('click', () => {
      that.clear();
      filterManager.deactivateFilter(name);
    });

    $weekDayButtons.off('click').on('click', event => {
      const buttonText = $(event.delegateTarget).text();
      let changedWeekDay = false;
      if ('day_of_week' in currentFilter && !currentFilter.day_of_week.includes(buttonText) || !('day_of_week' in currentFilter))
      {
        changedWeekDay = true;
      }
      
      if (changedWeekDay) {
        if (!('day_of_week' in currentFilter))
        {
          currentFilter.day_of_week = [];
        }
        currentFilter.day_of_week.push(buttonText);
      }
      tryApplyingCurrentFilter();
      updateStates();
    });

    $beforeAfterButtons.off('click').on('click', event => {
      currentFilter.type = $(event.delegateTarget).text();
      tryApplyingCurrentFilter();
      updateStates();
    });

    $timeInput.off('change').on('change', () => {
      currentFilter.time = $timeInput.val();
      tryApplyingCurrentFilter();
      updateStates();
    });
  };

  function updateStates() {
    updateTableHeaderState();
    updateClearButtonState();
    updateWeekDayButtonStates();
    updateBeforeAfterButtonStates();
    updateTimeInputState();
  }

  function findButtonByText($buttons, text) {
    return $buttons.filter(function() {
      return text.includes($(this).text());
    });
  }

  function updateTableHeaderState() {
    if ($tableHeader !== null) {
      $tableHeader.removeClass('filterui-filter-active');
      if (isFilterActive()) {
        $tableHeader.addClass('filterui-filter-active');
      }
    }
  }

  function updateClearButtonState() {
    $clearButton.attr('disabled', 'disabled');
    if ('day_of_week' in currentFilter) {
      $clearButton.removeAttr('disabled');
    }
  }

  function updateWeekDayButtonStates() {
    $weekDayButtons.removeClass('active').removeClass('btn-success');

    let $buttonToPress;
    if ('day_of_week' in currentFilter) {
      for (let i = 0; i < currentFilter['day_of_week'].length; i++)
      {
        $buttonToPress = findButtonByText(
          $weekDayButtons,
          currentFilter.day_of_week
        );
        $buttonToPress.addClass('btn-success').addClass('active');
      }
      
    }
  }

  /**
   * Returns whether the before/after inputs have valid values.
   * @return bool
   */
  function isBeforeAfterStateValid() {
    if (
      !(
        'time' in currentFilter &&
        'type' in currentFilter &&
        currentFilter.time !== ''
      )
    ) {
      return false;
    }
    const parsedTime = parseTime(currentFilter.time);
    return parsedTime !== null && parsedTime.isValid();
  }

  function updateBeforeAfterButtonStates() {
    $beforeAfterButtons.removeClass('active').removeClass('btn-success');
    $beforeAfterButtons.removeAttr('disabled');
    if ($surroundingElem.find('.weekday-btn-group .active').length === 0) {
      $beforeAfterButtons.attr('disabled', 'disabled');
      return;
    }

    if ('type' in currentFilter) {
      const $buttonToPress = findButtonByText(
        $beforeAfterButtons,
        currentFilter.type
      );
      $buttonToPress.addClass('active');
      if (isBeforeAfterStateValid()) {
        $buttonToPress.addClass('btn-success');
      }
    }
  }

  function updateTimeInputState() {
    $timeInput
      .parent()
      .removeClass('error')
      .removeClass('success');
    $timeInput.removeAttr('disabled');
    $filterButton.removeAttr('disabled').removeClass('btn-success');
    if ($surroundingElem.find('.before-after-btn-group .active').length === 0) {
      $timeInput.val('');
      $timeInput.attr('disabled', 'disabled');
      $filterButton.attr('disabled', 'disabled');
      return;
    }

    if ('time' in currentFilter && currentFilter.time !== '') {
      if (isBeforeAfterStateValid()) {
        $timeInput.parent().addClass('success');
        $filterButton.addClass('btn-success');
      } else {
        $timeInput.parent().addClass('error');
      }
    }
  }

  function tryApplyingCurrentFilter() {
    if ('day_of_week' in currentFilter) {
      let filterToApply = {};
      if (isBeforeAfterStateValid()) {
        filterToApply = $.extend({}, currentFilter);
        const parsedTime = parseTime(currentFilter.time);
        filterToApply.time = parseFloat(parsedTime.format('H.mm'));
      } else {
        filterToApply = {};
      }

        filterToApply.day_of_week = [];
        for (let i = 0; i < currentFilter['day_of_week'].length; i++)
        {

          filterToApply.day_of_week.push(letterToDay[currentFilter['day_of_week'][i]]);
        }

        filterManager.activateFilter(name, filterToApply);
     
      
    } else {
      filterManager.deactivateFilter(name);
    }
  }

  /**
   * Called when the filter UI needs to be cleared; usually called
   * by the FilterManager.
   */
  this.clear = function() {
    currentFilter = {};
    $timeInput.val('');
    updateStates();
  };

  /**
   * Attaches table header to be updated with filter as visual signal.
   * @param $tableHeaderVal   JQuery element for table header
   */
  this.attachTableHeader = function($tableHeaderVal) {
    $tableHeader = $tableHeaderVal;
  };
}

/**
 * Button that just goes on and off. 'nuff said.
 * @constructor
 */
export function ButtonBooleanFilterUi() {
  const that = this;

  let name;
  let filterManager;
  let $button;

  let turnOnText;
  let turnOffText;
  let on = false;

  /**
   * Attach the UI element that the filter widgets are inside
   * @param nameVal           string name of the filter; passed to FilterManager
   * @param buttonSelector    string or DOM element that represents the button
   * @param filterManagerVal  FilterManager; the UI calls this on changes
   * @param turnOnTextVal     string; prompt to turn on filter
   * @param turnOffTextVal    string; prompt to turn off filter
   */
  this.init = function(
    nameVal,
    buttonSelector,
    filterManagerVal,
    turnOnTextVal,
    turnOffTextVal
  ) {
    name = nameVal;
    filterManager = filterManagerVal;
    filterManager.registerFilterUi(name, this);

    $button = $(buttonSelector);

    turnOnText = turnOnTextVal;
    turnOffText = turnOffTextVal;

    $button.off('click').on('click', event => {
      on = !on;
      if (on) {
        filterManager.activateFilter(name, true);
        if (that.onCallback) {
          that.onCallback(event);
        }
      } else {
        filterManager.deactivateFilter(name);
        if (that.offCallback) {
          that.offCallback(event);
        }
      }
      updateButtonState();
    });
  };

  this.onCallback = null;
  this.offCallback = null;

  function updateButtonState() {
    if (on) {
      $button.text(turnOffText);
    } else {
      $button.text(turnOnText);
    }
  }

  /**
   * Called when the filter UI needs to be cleared; usually called
   * by the FilterManager.
   */
  this.clear = function() {
    on = false;
    updateButtonState();
  };
}

/**
 * A go-between between the Table, different FilterUi's, and possible the
 * browser's address bar (not yet implemented).
 * @constructor
 */
export function FilterManager() {
  const that = this;

  let table = null;
  const filterUis = [];
  const filterGenerators = {};
  let activeFilters = {};
  const filterIsExclusive = {};

  /**
   * Function passed to the table for filtering. Basically calls all the
   * active filters and returns the result.
   * @param row
   * @return {Boolean}
   */
  function aggregateFilter(row) {
    for (const filterName of Object.keys(activeFilters)) {
      const filter = activeFilters[filterName];
      if (!filter(row)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Notify the table of new/removed filters.
   */
  function updateTableWithFilters() {
    if (table !== null) {
      table.setFilter(aggregateFilter);
    }
  }

  /**
   * Register a FilterUi object so that we can communicate when it's
   * filter has been programmatically cleared.
   * @param filterName    string; unique filter identifier
   * @param filterUi      FilterUi; best filter
   */
  this.registerFilterUi = function(filterName, filterUi) {
    filterUis[filterName] = filterUi;
  };

  /**
   * Called by a SortUi object when someone has disabled a filter through
   * the UI.
   * @param filterName    string; The name of the filter to disable. If blank, disables everything
   */
  this.deactivateFilter = function(filterName) {
    if (typeof filterName === 'undefined') {
      // Delete all filters
      activeFilters = {};
    } else if (filterName in activeFilters) {
      delete activeFilters[filterName];
    }
    updateTableWithFilters();
  };

  /**
   * Called by the filter UI to indicate that its filter should be used,
   * with the settings given in data.
   * @param filterName    string; unique filter identifier that's calling this
   * @param data          string or Object; data passed to the filter generator
   *                      in generating the filter.
   */
  this.activateFilter = function(filterName, data) {
    let filter;
    if (filterName in filterIsExclusive) {
      this.clearAllUsedFilters([filterName]);
    }
    if (filterName in filterGenerators) {
      filter = filterGenerators[filterName](filterName, data);
      activeFilters[filterName] = filter;
      updateTableWithFilters();
    }
  };

  /**
   * Building blocks of filter-generators. These are wrapped around another
   * function for the final filter-generators.
   *
   * They come in the form: function(value) -> function(row) returning true or false
   * whereas complete filter-generators are: function(filterName, data) -> function(row)
   * @type {Object}
   */
  this.valueFilterGenerators = {
    category: function(dataArray) {
      const dataMap = {};
      for (let i = 0; i < dataArray.length; i++) {
        dataMap[dataArray[i]] = true;
      }
      return function(value) {
        return value in dataMap;
      };
    },
    aboveBelow: function(data) {
      return function(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        if ('above' in data && num < data.above) {
          return false;
        } else if ('below' in data && num > data.below) {
          return false;
        }
        return true;
      };
    },
    text: function(data) {
      data = data.toLowerCase();
      return function(value) {
        let checkValue = value;
        if ($.isArray(value)) {
          checkValue = checkValue.join('; ');
        }
        if (typeof checkValue !== 'string') {
          return false;
        }
        return checkValue.toLowerCase().indexOf(data) !== -1;
      };
    },
  };

  const availableFilterGenerators = {
    /**
     * A filter generator where we check if the value of the column
     * is an entry in the dataArray. Note that this works too if
     * row[filterName] is an array, in which case it'll return true if
     * any element of the row[filterName] matches a filtered value.
     * @param filterName    Unique filter identifier (and field-name in this case)
     * @param dataArray     Array; array of accepted values
     * @return {Function}
     */
    category: function(filterName, dataArray) {
      const matchEmptyArrays = $.inArray('@null', dataArray) !== -1;
      const filter = that.valueFilterGenerators.category(dataArray);
      return function(row) {
        const rowData = _.get(row, filterName);
        if ($.isArray(rowData)) {
          if (rowData.length === 0 && matchEmptyArrays) {
            return true;
          }
          for (let i = 0; i < rowData.length; i++) {
            if (filter(rowData[i])) {
              return true;
            }
          }
          return false;
        } else {
          return filter(rowData);
        }
      };
    },

    /**
     * Generates a filter that checks the row[filterName] >= data['above']
     * and row[filterName] <= data['below']. The resulting function
     * also returns false if it's non-numeric.
     * @param filterName    Unique filter identifier (and field-name in this case)
     * @param data          Array with optional keys 'above' and 'below'; both must
     *                      be either unset or floats, and must not be strings
     * @return {Function}
     */
    aboveBelow: function(filterName, data) {
      const filter = that.valueFilterGenerators.aboveBelow(data);
      return function(row) {
        return filter(_.get(row, filterName));
      };
    },

    /**
     * Generates filter that checks that the row[filterName] contains
     * the string data.
     * @param filterName    Unique filter identifier (and field-name int his case)
     * @param data
     * @return {Function}
     */
    text: function(filterName, data) {
      const filter = that.valueFilterGenerators.text(data);
      return function(row) {
        return filter(_.get(row, filterName));
      };
    },
  };

  /**
   * Register a custom filter generator to use for the given filter name.
   * @param filterName        Unique filter identifier corresponding to UI
   * @param filterGenerator   function(filterName, data) -> function(row) returning true or false
   */
  this.registerFilterGenerator = function(filterName, filterGenerator) {
    filterGenerators[filterName] = filterGenerator;
  };

  /**
   * Register the filter to be used for the given filterName.
   * @param filterName        string
   * @param generatorName     string
   */
  this.useFilterGeneratorForFilter = function(filterName, generatorName) {
    filterGenerators[filterName] = availableFilterGenerators[generatorName];
  };

  /**
   * Sets the table that to apply the filters on.
   */
  this.setTable = function(newTable) {
    table = newTable;
  };

  /**
   * Marks it such that when the filter with the given filterName is
   * activated, all other filters are deactivated.
   * @param filterName
   * @param exclusive     bool; whether the filter should be exclusive
   */
  this.setFilterExclusive = function(filterName, exclusive) {
    if (exclusive) {
      filterIsExclusive[filterName] = true;
    } else {
      delete filterIsExclusive[filterName];
    }
  };

  /**
   * Clear all filters that are in use, except those specified.
   * @param [filterExceptions]    {String} names of filters to not clear
   */
  this.clearAllUsedFilters = function(filterExceptions) {
    if (typeof filterExceptions === 'undefined') {
      filterExceptions = [];
    }

    const newActiveFilters = {};
    for (const filterName of Object.keys(activeFilters)) {
      if ($.inArray(filterName, filterExceptions) !== -1) {
        newActiveFilters[filterName] = activeFilters[filterName];
      } else {
        filterUis[filterName].clear();
      }
    }

    activeFilters = newActiveFilters;
    updateTableWithFilters();
  };
}

/**
 * Gets categories in the column. Each row entry can be a scalar or
 * an Array.
 * @param data
 * @param column
 * @return {Array}
 */
export function getCategoriesInColumn(data, column) {
  const categoriesMap = {};
  for (let i = 0; i < data.length; i++) {
    const colData = data[i][column];
    if ($.isArray(colData)) {
      for (let j = 0; j < colData.length; j++) {
        categoriesMap[colData[j]] = true;
      }
    } else if (typeof colData !== 'undefined') {
      categoriesMap[colData] = true;
    }
  }

  // Convert map to list
  const categories = _.keys(categoriesMap);
  return categories;
}

