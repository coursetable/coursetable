import React, { useEffect } from 'react';

import styles from './WorksheetRowDropdown.module.css';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { toSeasonString, useComponentVisible } from '../utilities';
import { useUser } from '../user';

function WorksheetRowDropdown({
  cur_season,
  season_codes,
  onSeasonChange,
  setFbPerson,
  cur_person,
}) {
  const { user } = useUser();

  const containsCurSeason = (worksheet) => {
    if (!worksheet) return false;
    for (let i = 0; i < worksheet.length; i++) {
      if (worksheet[i][0] === cur_season) return true;
    }
    return false;
  };

  let season_options = [];
  season_codes.sort();
  season_codes.reverse();
  season_codes.forEach((season_code) => {
    season_options.push({
      value: season_code,
      label: toSeasonString(season_code)[0],
    });
  });

  let friend_options = [{ value: 'me', label: 'Me' }];
  const friendInfo =
    user.fbLogin && user.fbWorksheets ? user.fbWorksheets.friendInfo : {};
  const friendWorksheets =
    user.fbLogin && user.fbWorksheets ? user.fbWorksheets.worksheets : {};
  for (let friend in friendInfo) {
    if (containsCurSeason(friendWorksheets[friend]))
      friend_options.push({
        value: friend,
        label: friendInfo[friend].name,
      });
  }

  const isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

  return (
    <Row className={styles.container + ' shadow-sm mx-auto pt-1 pb-2'}>
      <Col md={6} className="px-2">
        <div className={styles.select_container}>
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
      <Col md={6} className="px-2">
        <div className={styles.select_container}>
          <Select
            value={{
              value: cur_person,
              label: cur_person === 'me' ? 'Me' : friendInfo[cur_person].name,
            }}
            isSearchable={true}
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
