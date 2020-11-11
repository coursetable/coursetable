import React, { useState } from 'react';
import SearchResults from './SearchResults';
import FBReactSelect from './FBReactSelect';
import SeasonReactSelect from './SeasonReactSelect';

// import { useEffect, useState, useRef, useMemo } from 'react';
import styles from './WorksheetExpandedList.module.css';
import select_styles from './WorksheetRowDropdown.module.css';
import worksheet_styles from '../pages/Worksheet.module.css';
import { Col, Row } from 'react-bootstrap';
import { useUser } from '../user';
import { FaCompressAlt } from 'react-icons/fa';

/**
 * Render expanded worksheet list after maximize button is clicked
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop cur_expand - string | Determines whether or not the list is expanded
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
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
  setFbPerson,
  fb_person,
  setCurExpand,
}) => {
  const { user } = useUser();
  const [isList, setView] = useState(true);
  return (
    <div className={styles.container}>
      <Row className="mx-auto">
        {/* Season and FB friends dropdown */}
        <Col md={2} className="p-0">
          <div className={styles.select_col + ' p-2'}>
            <Row className="mx-auto mb-2">
              <div
                className={
                  select_styles.select_container +
                  ' ' +
                  select_styles.hover_effect
                }
              >
                <SeasonReactSelect
                  cur_season={cur_season}
                  season_codes={season_codes}
                  onSeasonChange={onSeasonChange}
                />
              </div>
            </Row>
            <Row className="mx-auto">
              <div
                className={
                  select_styles.select_container +
                  (user.fbLogin ? ' ' + select_styles.hover_effect : '')
                }
              >
                <FBReactSelect
                  cur_season={cur_season}
                  setFbPerson={setFbPerson}
                  cur_person={fb_person}
                />
              </div>
            </Row>
            <FaCompressAlt
              className={worksheet_styles.expand_btn + ' ' + styles.top_left}
              size={18}
              onClick={() => {
                // Compress list
                setCurExpand('none');
              }}
            />
          </div>
        </Col>
        {/* Worksheet courses in search results format */}
        <Col md={10} className="pr-0 pl-3">
          <div className={styles.search_results}>
            <SearchResults
              data={courses}
              showModal={showModal}
              expanded={cur_expand === 'list'}
              isLoggedIn={true}
              isList={isList}
              setView={setView}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(WorksheetExpandedList);
