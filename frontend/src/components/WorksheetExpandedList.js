import React from 'react';
import SearchResults from './SearchResults';
// import { useEffect, useState, useRef, useMemo } from 'react';

// import { Row, Container } from 'react-bootstrap';

// import styles from './WorksheetExpandedList.module.css';
// import search_results_styles from './SearchResults.module.css';

// import WorksheetSettingsDropdown from './WorksheetSettingsDropdown';
// import { useWindowDimensions } from './WindowDimensionsProvider';

/**
 * Render expanded worksheet list after maximize button is clicked
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop cur_expand - string | Determines whether or not the list is expanded
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop hasSeason - function to pass to bookmark button
 * @prop setFbPerson - function to change FB person
 * @prop fb_person - string of current person who's worksheet we are viewing
 */

const WorksheetExpandedList = ({
  courses,
  showModal,
  cur_expand,
  cur_season,
  season_codes,
  onSeasonChange,
  hasSeason,
  setFbPerson,
  fb_person,
}) => {
  return (
    <SearchResults
      data={courses}
      showModal={showModal}
      expanded={cur_expand === 'list'}
      isLoggedIn={true}
    />
  );
};

export default WorksheetExpandedList;
