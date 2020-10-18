import React from 'react';

import styles from './WorksheetRowDropdown.module.css';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { toSeasonString } from '../utilities';
import { useUser } from '../user';

/**
 * Render row of season and FB friends dropdowns
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 */

function WorksheetRowDropdown({
  cur_season,
  season_codes,
  onSeasonChange,
  setFbPerson,
  cur_person,
}) {
  // Fetch user context data
  const { user } = useUser();

  // Does the worksheet contain any courses from the current season?
  const containsCurSeason = (worksheet) => {
    if (!worksheet) return false;
    for (let i = 0; i < worksheet.length; i++) {
      if (worksheet[i][0] === cur_season) return true;
    }
    return false;
  };

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

  // List of FB friend options. Initialize with me option
  let friend_options = [{ value: 'me', label: 'Me' }];
  // FB Friends names
  const friendInfo =
    user.fbLogin && user.fbWorksheets ? user.fbWorksheets.friendInfo : {};
  // FB Friends worksheets
  const friendWorksheets =
    user.fbLogin && user.fbWorksheets ? user.fbWorksheets.worksheets : {};
  // Add FB friend to dropdown if they have worksheet courses in the current season
  for (let friend in friendInfo) {
    if (containsCurSeason(friendWorksheets[friend]))
      friend_options.push({
        value: friend,
        label: friendInfo[friend].name,
      });
  }

  // Sort FB friends in alphabetical order
  friend_options.sort((a, b) => {
    if (a.label === 'Me') return -1;
    if (b.label === 'Me') return 1;
    return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1;
  });

  return (
    <Row className={styles.container + ' shadow-sm mx-auto pt-2 pb-2'}>
      {/* Season Select */}
      <Col md={6} className="pl-2 pr-1">
        <div className={styles.select_container + ' ' + styles.hover_effect}>
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
      </Col>
      {/* FB Friend Select */}
      <Col md={6} className="pr-2 pl-1">
        <div
          className={
            styles.select_container +
            (user.fbLogin ? ' ' + styles.hover_effect : '')
          }
        >
          <Select
            value={{
              value: cur_person,
              label: user.fbLogin
                ? cur_person === 'me'
                  ? 'Me'
                  : friendInfo[cur_person].name
                : 'Connect FB',
            }}
            isSearchable={true}
            isDisabled={!user.fbLogin}
            options={friend_options}
            onChange={(option) => {
              setFbPerson(option.value);
            }}
          />
        </div>
      </Col>
    </Row>
  );
}

export default WorksheetRowDropdown;
