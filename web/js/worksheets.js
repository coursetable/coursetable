import $ from 'jquery';
import { getTable } from './init';

/**
 * @param season string of the season of the current worksheet (e.g. 201303 for Fall 2013)
 */
export default function WorksheetManager() {
  let friendWorksheets = {};
  // friendWorksheets[net_id][oci_id] = true for each "oci_id" of a course
  //   in a friend's worksheet
  let friendsWithCourse = {};
  // friendsWithCourse[oci_id] = [net_id1, net_id2, ...]
  let friendInfo = {};
  // Mapping of NetID to Facebook name and ID for each friend
  // (e.g. 'zpx2': {name: 'Peter Xu', facebookId: 123456789}))
  let takenInPast = {};
  // Mapping of takenInPast[subject][number] = [{netid: ..., season: ...}, ...]
  let crossListings = {};
  // Mapping of crossListings[oci_id] = [oci_id, another_oci_id, ...] for all the
  // other OCI IDs a course is cross-listed under

  // A map of worksheetOciIdsMap[oci_id] = true for each oci_id in the worksheet
  let worksheetOciIdsMap = null;

  // An array of all the oci_ids in the current user's worksheet
  let worksheetOciIds = null;

  let season;

  function isCourseInWorksheet(ociId) {
    if (worksheetOciIdsMap === null) {
      return false;
    }
    return ociId in worksheetOciIdsMap;
  }

  function isCourseInFriendWorksheet(netId, ociId) {
    if (friendWorksheets === null) {
      return false;
    }
    return ociId in friendWorksheets[netId];
  }

  /**
   * Get all the friends shopping a course, including the cross-listed
   * variants
   */
  function friendsShoppingCourse(ociId) {
    if (!(ociId in crossListings)) {
      return [];
    }

    const ociIds = crossListings[ociId];
    const friends = [];
    const friendsHash = {};

    for (let j = 0; j < ociIds.length; j++) {
      const id = ociIds[j];

      if (!(id in friendsWithCourse)) continue;

      const netIds = friendsWithCourse[ociIds[j]];
      for (let i = 0; i < netIds.length; i++) {
        const netId = netIds[i];
        if (!(netId in friendsHash)) {
          friendsHash[netId] = true;
          friends.push(friendInfo[netId]);
        }
      }
    }
    return friends;
  }

  /**
   * Given a subject and number, returns the friends { name, season }
   * who have taken the course.
   */
  function friendsTakenCourse(subject, number) {
    if (!(subject in takenInPast) || !(number in takenInPast[subject])) {
      return [];
    }
    const friends = [];
    const entries = takenInPast[subject][number];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if (entry.netId in friendInfo) {
        friends.push({
          name: friendInfo[entry.netId].name,
          season: entry.season,
        });
      }
    }
    return friends;
  }

  /**
   * Convert an array to a boolean hash, where each item in the array is a key
   * and the value is always (bool)true.
   * @param  array    array to convert
   * @return  object where each element of the array is a key
   */
  function convertArrayToObject(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
      obj[array[i]] = true;
    }
    return obj;
  }

  /**
   * Updates the worksheet's OCI IDs and forces redraws if needed
   * @param ociIds  array of OCI IDs
   */
  function setOciIds(ociIds) {
    worksheetOciIds = ociIds;
    worksheetOciIdsMap = convertArrayToObject(ociIds);

    $('.download-csv-btn')
      .off('click')
      .on('click', () => {
        ociIds = worksheetOciIds.join(',');
        const $iframe = $('<iframe style="width: 0; height: 0"></iframe>').attr(
          'src',
          '/GenerateCsv.php?ociIds=' + ociIds + '&season=' + season
        );
        $('body').append($iframe);
      });

    $('.download-ics-btn')
      .off('click')
      .on('click', () => {
        ociIds = worksheetOciIds.join(',');
        const $iframe = $(
          '<iframe istyle="width: 0; height: 0" id="icslink"></iframe>'
        ).attr(
          'src',
          '/GenerateIcs.php?ociIds=' + ociIds + '&season=' + season
        );
        $('body').append($iframe);
        document.getElementById('icslink').click();
      });

    if (getTable() != null) {
      getTable().forceRedraw();
    }
  }

  /**
   * Adds or removes an element to the worksheet
   * @param ociId
   * @param action  Either 'add' or 'remove'
   */
  function addOrRemoveForWorksheet(ociId, action, callback) {
    $.get(
      '/WorksheetActions.php',
      { season: season, ociId: ociId, action: action },
      data => {
        if (data.success) {
          setOciIds(data.data);
        }
        if (typeof callback === 'function') {
          callback();
        }
      },
      'json'
    );
  }

  function initializeFriendWorksheetFilter() {
    let $friendWorksheetsSelect = $('.friend-worksheets-select');
    try {
      $friendWorksheetsSelect.select2('destroy');
    } catch (err) {
      // Squelch errors if select2 not yet initialized on an element
    }
    $friendWorksheetsSelect.show().empty();

    $friendWorksheetsSelect.append('<option></option>');
    let numOptions = 0;
    for (const netId of Object.keys(friendWorksheets)) {
      const friendName = friendInfo[netId].name;
      $friendWorksheetsSelect.append(
        $('<option></option>')
          .text(friendName)
          .attr('value', netId)
      );
      ++numOptions;
    }

    // The previous selector gets invalidated by the select2('destroy')
    $friendWorksheetsSelect = $('.friend-worksheets-select');
    if (numOptions === 0) {
      console.log('No worksheets');
      $friendWorksheetsSelect.select2({
        placeholder: "No friends' courses!",
        allowClear: true,
      });
      $friendWorksheetsSelect.select2('disable');
    } else {
      $friendWorksheetsSelect.attr('disabled', 'disabled');
      $friendWorksheetsSelect.select2({
        placeholder: "See friends' courses",
        allowClear: true,
      });
      $friendWorksheetsSelect.select2('enable');
    }
  }

  function showWorksheetButtons() {
    $('.list-table-btn, .download-csv-btn, .download-ics-btn').show();
  }

  function hideWorksheetButtons() {
    $('.list-table-btn, .download-csv-btn, .download-ics-btn').hide();
  }

  function retrieveOwnWorksheet() {
    $.get(
      '/WorksheetActions.php',
      { action: 'get', season: season },
      data => {
        setOciIds(data.data);
      },
      'json'
    );
  }

  function retrieveFriendWorksheets(callback) {
    $.get(
      '/FetchFriendWorksheetsNew.php',
      { season: season },
      data => {
        friendWorksheets = {};
        friendsWithCourse = {};
        const worksheets = data.worksheets;

        // Save the worksheets in both data structures
        for (const netId of Object.keys(worksheets)) {
          const courseIdsArray = worksheets[netId];
          friendWorksheets[netId] = convertArrayToObject(courseIdsArray);

          for (let i = 0; i < courseIdsArray.length; i++) {
            const ociId = courseIdsArray[i];
            if (!(ociId in friendsWithCourse)) {
              friendsWithCourse[ociId] = [];
            }
            friendsWithCourse[ociId].push(netId);
          }
        }

        // Save the NetID => (FullName, FacebookID)
        friendInfo = data.friendInfo;

        // Save the past courses taken
        const pastCourses = data.pastCourses;
        takenInPast = {};
        if (pastCourses != null) {
          for (const netId of Object.keys(pastCourses)) {
            const courses = pastCourses[netId];
            for (let i = 0; i < courses.length; i++) {
              const course = courses[i];
              const subject = course[0],
                number = course[1],
                season = course[2];

              if (!(subject in takenInPast)) takenInPast[subject] = {};
              if (!(number in takenInPast[subject])) {
                takenInPast[subject][number] = [];
              }

              takenInPast[subject][number].push({
                netId: netId,
                season: season,
              });
            }
          }
        }

        initializeFriendWorksheetFilter();

        if (typeof callback === 'function') {
          callback();
        }
      },
      'json'
    );
  }

  function setSeason(newSeason) {
    season = newSeason;
  }

  function setCrossListings(listings) {
    crossListings = listings;
  }

  // Functions to export
  this.isCourseInWorksheet = isCourseInWorksheet;
  this.isCourseInFriendWorksheet = isCourseInFriendWorksheet;
  this.addOrRemoveForWorksheet = addOrRemoveForWorksheet;
  this.retrieveOwnWorksheet = retrieveOwnWorksheet;
  this.retrieveFriendWorksheets = retrieveFriendWorksheets;
  this.setSeason = setSeason;
  this.showWorksheetButtons = showWorksheetButtons;
  this.hideWorksheetButtons = hideWorksheetButtons;
  this.friendsShoppingCourse = friendsShoppingCourse;
  this.friendsTakenCourse = friendsTakenCourse;
  this.setCrossListings = setCrossListings;
}
