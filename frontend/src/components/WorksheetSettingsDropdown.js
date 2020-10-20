import React, { useEffect } from 'react';

import styles from './WorksheetSettingsDropdown.module.css';
import FBReactSelect from './FBReactSelect';
import { Row, Col, Collapse } from 'react-bootstrap';
import Select from 'react-select';
import { toSeasonString, useComponentVisible } from '../utilities';
import { FcSettings } from 'react-icons/fc';

/**
 * Render dropdown when settings icon is clicked in the expanded worksheet list view
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 */

function WorksheetSettingsDropdown({
  cur_season,
  season_codes,
  onSeasonChange,
  setFbPerson,
  cur_person,
}) {
  // Refs to detect clicks outside of the dropdown
  const {
    ref_visible,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  // Keep dropdown open on click
  const handleDropdownClick = () => {
    setIsComponentVisible(true);
  };

  // Close dropdown on season or FB friend select
  useEffect(() => {
    setIsComponentVisible(false);
  }, [cur_season, cur_person, setIsComponentVisible]);

  // List to hold season dropdown options
  let season_options = [];
  // Sort season codes from most to least recent
  season_codes.sort();
  season_codes.reverse();
  // Iterate over seasons and populate season_options list
  season_codes.forEach((season_code) => {
    season_options.push({
      value: season_code,
      label: toSeasonString(season_code)[0],
    });
  });

  // Is the user using a touch screen device
  const isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

  return (
    <>
      {/* Settings Icon */}
      <div
        className={
          'd-flex ml-auto my-auto p-0 ' +
          styles.settings +
          (isComponentVisible ? ' ' + styles.settings_rotated : '')
        }
        ref={ref_visible}
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        onMouseEnter={() => {
          if (!isTouch) setIsComponentVisible(true);
        }}
      >
        <FcSettings size={20} />
      </div>
      {/* Dropdown */}
      <div className={styles.collapse_container} onClick={handleDropdownClick}>
        <Collapse in={isComponentVisible}>
          <Col className={'px-3'}>
            {/* Season Select */}
            <Row className="m-auto pt-2">
              <div className={styles.select_container + ' m-auto'}>
                <Select
                  value={{
                    value: cur_season,
                    label: toSeasonString(cur_season)[0],
                  }}
                  isSearchable={false}
                  options={season_options}
                  onChange={(option) => {
                    onSeasonChange(option.value);
                  }}
                />
              </div>
            </Row>
            {/* FB Friends Select */}
            <Row className="m-auto pb-2">
              <div className={styles.select_container + ' m-auto'}>
                <FBReactSelect
                  cur_season={cur_season}
                  setFbPerson={setFbPerson}
                  cur_person={cur_person}
                />
              </div>
            </Row>
          </Col>
        </Collapse>
      </div>
    </>
  );
}

export default WorksheetSettingsDropdown;
