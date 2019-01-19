import $ from 'jquery';
import _ from 'lodash';

import customPopover from './custom-bootstrap-popover';
import { showTimetable, hideTimetable } from './custom-timetable';
import './ejs-extend';
import './timetable';
import initializeTableWithData from './initializetable';
import { SingleCategoryFilterUi } from './filterui';
import UrlManager from './url';
import WorksheetManager from './worksheets';
import ModalsManager from './modals';

// Also defined elsewhere: hasDataFile (in Bluebook.tpl)
customPopover($);

/* globals season, evaluationsEnabled */

// Load the modals library
const urlManager = new UrlManager();
let filterManager;
const worksheetManager = new WorksheetManager();
export const modals = new ModalsManager(
  urlManager,
  worksheetManager,
  season,
  evaluationsEnabled
);

const ociIdIndices = {}; // ociIdIndices[ociId] = index in data

let data;
let table;

export function getTable() {
  return table;
}

export function getData() {
  return data;
}

let timetable = null;
/**
 * Either shows or hides the timetable
 * @param  [visible]  whether the timetable should be made visible.
 *               if not specified, toggle behaviour occurs
 *                      if 'refresh', just refreshes rather than toggles
 */
function toggleTimetable(visible) {
  if (typeof visible !== 'undefined') {
    if (visible !== 'refresh') {
      timetable = visible;
    } // else timetable = timetable;
  } else {
    timetable = !timetable;
  }

  if (timetable) {
    $('.list-table-btn')
      .html('<i class="icon-list"></i>')
      .tooltip('destroy')
      .tooltip({
        title: 'View as list',
        placement: 'bottom',
        container: 'body',
      });
    $('#search-box')
      .val('')
      .prop('disabled', true);
    showTimetable(table.displayedRows);
  } else {
    $('.list-table-btn')
      .html('<i class="icon-th"></i>')
      .tooltip('destroy')
      .tooltip({
        title: 'View as timetable',
        placement: 'bottom',
        container: 'body',
      });
    $('#search-box')
      .val('')
      .prop('disabled', false);
    hideTimetable();
  }
}

function loadData(season, callback) {
  $('.loading').show();
  $('#extra-loading').text('');

  setTimeout(() => {
    $('#extra-loading').text(
      'this might take up to 10 seconds the first time.'
    );
  }, 2000);

  changeWorksheetSeason(season, () => {
    // We need to first get friends' worksheets because a column in the
    // table requires how many friends are shopping each course

    $.get(
      jsonForSeason(season),
      undefined,
      fetchedData => {
        $('.loading').hide();

        data = fetchedData;

        // Process the data so that we can get the index by
        // - subject, number, section
        // - oci_id
        // - cross-listings (indexed by oci_id to a list of other relevant oci_ids)
        const crossListings = {};

        // Cross-listings must be done first because the worksheetManager needs it
        for (let i = 0; i < data.length; i++) {
          const ociId = data[i].oci_id;
          // For people with old .json files (delete following line after 2014-01-09)
          // we're not bothering to show them cross-listed classes
          if (!('oci_ids' in data[i])) {
            crossListings[ociId] = [ociId];
          } else {
            crossListings[ociId] = data[i].oci_ids;
          }
        }
        worksheetManager.setCrossListings(crossListings);

        for (let i = 0; i < data.length; i++) {
          data[i].friends = worksheetManager.friendsShoppingCourse(
            data[i].oci_id
          );
          data[i].num_friends = data[i].friends.length;
          data[i].taken_before = worksheetManager.friendsTakenCourse(
            data[i].subject,
            data[i].number
          );

          const courseData = data[i];
          _.set(
            courseIndices,
            [courseData.subject, courseData.number, courseData.section],
            i
          );
          ociIdIndices[courseData.oci_id] = i;
        }

        const tableData = initializeTableWithData(
          fetchedData,
          modals.showCourse,
          worksheetManager,
          season,
          evaluationsEnabled
        );
        table = tableData.table;

        if (typeof callback === 'function') {
          callback(tableData);
        }

        // Add show as timetable/show as worksheet stuff
        const worksheetFilter = tableData.worksheetFilter;
        worksheetFilter.onCallback = function() {
          worksheetManager.showWorksheetButtons();
          toggleTimetable('refresh');
        };
        worksheetFilter.offCallback = function() {
          worksheetManager.hideWorksheetButtons();
          toggleTimetable(false);
        };

        // Add Facebook friend stuff
        filterManager = tableData.filterManager;
        const friendFilterUi = new SingleCategoryFilterUi();
        friendFilterUi.init(
          'friend_worksheets',
          '.friend-worksheets-select',
          filterManager
        );
        friendFilterUi.onCallback = function() {
          worksheetManager.showWorksheetButtons();
          toggleTimetable('refresh');
        };
        friendFilterUi.offCallback = function() {
          worksheetManager.hideWorksheetButtons();
          toggleTimetable(false);
        };

        filterManager.registerFilterGenerator(
          'friend_worksheets',
          (filterName, data) => {
            return function(row) {
              return worksheetManager.isCourseInFriendWorksheet(
                data,
                row.oci_id
              );
            };
          }
        );
        filterManager.setFilterExclusive('friend_worksheets', true);
      },
      'json'
    );
  });
}

/**
 * Checks whether we are logged into Facebook and have
 * the user_friends Facebook permission, and calls the success
 * and fail callbacks correspondingly
 * @param successCallback called if we're logged in w/permissions
 * @param failCallback called otherwise
 */
function ensureFacebookPermissions(loginFunc, successCallback, failCallback) {
  console.log('Checking FB login status');
  // 1. Check if logged in
  loginFunc(
    response => {
      if (response.status === 'connected') {
        console.log('FB logged in');

        // 2. Check if we have the permissions needed
        FB.api('/me/permissions', response => {
          const permissions = response.data;
          let hasUserFriendsPermission = false;
          for (let i = 0; i !== permissions.length; i++) {
            const p = permissions[i];
            if (p.permission === 'user_friends' && p.status === 'granted') {
              hasUserFriendsPermission = true;
            }
          }

          if (hasUserFriendsPermission) {
            console.log('FB has permissions');
            successCallback();
          } else {
            console.log('FB does not have permissions');
            failCallback();
          }
        });
      } else {
        console.log('FB not logged in');
        failCallback();
      }
    },
    {
      auth_type: 'rerequest', // We need all the settings
      scope: 'email, public_profile, user_friends',
    }
  );
}

function changeWorksheetSeason(season, friendWorksheetsRetrievedCallback) {
  worksheetManager.setSeason(season);
  worksheetManager.retrieveOwnWorksheet();

  /**
   * Used when user tries to login to Facebook, either for the first time or to update
   * their friends list
   * 1. Tries to login to Facebook
   * 2. Displays an error message if failed
   * 3. Enables Facebook menu if successful
   * @param force: whether to force a refresh, even if we've recently retrieved Facebook friends in the last few days
   * @param successCallback: callback to be called on successful login
   */
  const attemptLoginAndFetch = function(force, successCallback) {
    if (typeof force === 'undefined') force = false;

    const $friendWorksheetsButton = $('.friend-worksheets-btn');

    ensureFacebookPermissions(
      FB.login,
      () => {
        // Logged in; fetch Facebook data
        $friendWorksheetsButton.children('span').text('Loading');
        const params = force ? { force: true } : null;

        $.get(
          '/FetchFacebookData.php',
          params,
          data => {
            $friendWorksheetsButton
              .children('span')
              .text("See friends' worksheets");
            $friendWorksheetsButton.removeAttr('disabled');
            if (data.success) {
              $friendWorksheetsButton.hide();
              worksheetManager.retrieveFriendWorksheets();

              if (successCallback) {
                successCallback();
              }
            } else {
              $friendWorksheetsButton.tooltip({
                title: "Something went wrong! We'll look into it soon",
                placement: 'bottom',
                trigger: 'manual',
              });
              $friendWorksheetsButton.tooltip('show');
              setTimeout(() => {
                $friendWorksheetsButton.tooltip('hide');
              }, 5000);
            }
          },
          'json'
        );
      },

      () => {
        // Did not log in; prompt again
        $friendWorksheetsButton.tooltip({
          title: 'You need to log into Facebook and authorize Yaleplus!',
          placement: 'bottom',
          trigger: 'manual',
        });
        $friendWorksheetsButton.tooltip('show');
        setTimeout(() => {
          $friendWorksheetsButton.tooltip('hide');
        }, 5000);
        $friendWorksheetsButton.removeAttr('disabled');
      }
    );
  };

  if (facebookDataRetrieved) {
    // We're already logged in on Facebook
    // Retrieve the data again if we have permission
    window.setTimeout(() => {
      ensureFacebookPermissions(
        FB.getLoginStatus,
        () => {
          $.get('/FetchFacebookData.php', undefined, (/* data */) => {
            // This replaces the data in case we just backfilled a user's friends
            // so they don't have to refresh to see it
            worksheetManager.retrieveFriendWorksheets(
              friendWorksheetsRetrievedCallback
            );
          });
        },

        () => {
          // Show UI elements requiring a click for refresh
          if (facebookNeedsUpdate) {
            // Global from /Table.php
            const $refreshButton = $('.friend-worksheet-refresh');
            $refreshButton.show().tooltip();
            $refreshButton.on('click', e => {
              e.preventDefault();
              attemptLoginAndFetch(true, () => {
                $refreshButton.hide();
              });
            });
          }
        }
      );
    }, 1000);

    // Load the friend worksheet data
    worksheetManager.retrieveFriendWorksheets(
      friendWorksheetsRetrievedCallback
    );
  } else {
    // We're not yet logged in on Facebook
    // Change drop-down menu to Facebook sign-in button
    $('.friend-worksheets-select').hide();
    const $friendWorksheetsButton = $('.friend-worksheets-btn');

    $friendWorksheetsButton.show();
    $friendWorksheetsButton.children('span').text("See friends' worksheets");
    $friendWorksheetsButton.click(() => {
      $friendWorksheetsButton.attr('disabled', 'disabled');
      attemptLoginAndFetch();
    });

    if (typeof friendWorksheetsRetrievedCallback === 'function') {
      // Call the callback anyways; we didn't retrieve anything,
      // but aren't going to
      friendWorksheetsRetrievedCallback();
    }
  }
}

function changeUrlSeason(season, update) {
  update = typeof update !== 'undefined' ? update : false;

  urlManager.season = season;
  modals.season = season;

  if (update) {
    window.history.pushState(null, '', urlManager.encode(''));
  }
}

function changeSeason(season, callback, updateUrl) {
  updateUrl = typeof updateUrl !== 'undefined' ? updateUrl : true;

  loadData(season, callback);
  changeUrlSeason(season, updateUrl);
  season = season.toString();

  let seasonName;
  console.log('SEASON: ' + season);
  switch (season.substring(4, 6)) {
    case '01':
      seasonName = 'Spring';
      break;
    case '02':
      seasonName = 'Summer';
      break;
    case '03':
      seasonName = 'Fall';
      break;
  }

  $('#season-dropdown').text(season.substring(0, 4) + ' ' + seasonName);
}

$(document).ready(() => {
  if (showNotice) {
    $('#notice').modal();
  } else {
    $('#notice').hide();
  }

  $('.tutorial-button').click(function() {
    const curIndex = parseInt(
      $(this)
        .attr('id')
        .split('-')
        .pop(),
      10
    );
    const nextIndex = curIndex + 1;
    $('#tutorial-button-' + curIndex).hide();
    $('#tutorial-button-' + nextIndex).show();
    let imagePath = $('#tutorial-image').attr('src');
    imagePath =
      imagePath.substring(0, imagePath.lastIndexOf('-')) +
      '-' +
      curIndex +
      '.png';
    $('#tutorial-image').attr('src', imagePath);
  });

  changeSeason(
    season,
    (/* tableData */) => {
      // First-time initialization only
      urlManager.checkUrl();
    },
    false
  );

  $('.list-table-btn').click(() => {
    toggleTimetable();
  });

  $('.download-csv-btn').tooltip({
    title: 'Download as File',
    placement: 'bottom',
    container: 'body',
  });
  toggleTimetable(false);

  const $searchBox = $('#search-box');
  $(window).on('keydown', e => {
    if (e.ctrlKey && e.keyCode === 70) {
      e.preventDefault();
      $searchBox.focus();
    }
  });

  $searchBox.keydown(e => {
    // ESCAPE key pressed
    if (e.keyCode === 27) {
      $searchBox.val('');
      $searchBox.keyup();
      $searchBox.blur();
    }
  });

  $('.season-link').on('click', function(e) {
    e.preventDefault();
    const season = $(this).attr('data-season');
    changeSeason(season);
  });

  // Left top logo click: clear searches, exit timetable

  $('.brand').on('click', e => {
    // Deactivate all
    e.preventDefault();
    worksheetManager.hideWorksheetButtons();
    toggleTimetable(false);
    filterManager.clearAllUsedFilters();
  });
});

// User tracking
export function registerEvent(event, data) {
  $.get('/RegisterEvent.php', { event: event, data: JSON.stringify(data) });
}
