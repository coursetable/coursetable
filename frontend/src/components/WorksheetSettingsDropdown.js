import React, { useEffect } from 'react';

import styles from './WorksheetSettingsDropdown.module.css';
import { Row, Col, Collapse } from 'react-bootstrap';
import Select from 'react-select';
import { toSeasonString, useComponentVisible } from '../utilities';
import { useUser } from '../user';
import { FcSettings } from 'react-icons/fc';

function WorksheetSettingsDropdown({
  cur_season,
  season_codes,
  onSeasonChange,
  setFbPerson,
  cur_person,
  icon_size = 20,
}) {
  const { user } = useUser();
  const {
    ref_visible,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  const handleDropdownClick = () => {
    setIsComponentVisible(true);
  };

  const containsCurSeason = (worksheet) => {
    for (let i = 0; i < worksheet.length; i++) {
      if (worksheet[i][0] === cur_season) return true;
    }
    return false;
  };

  useEffect(() => {
    setIsComponentVisible(false);
  }, [cur_season, cur_person]);

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
  for (let friend in friendInfo) {
    if (containsCurSeason(user.fbWorksheets.worksheets[friend]))
      friend_options.push({
        value: friend,
        label: friendInfo[friend].name,
      });
  }

  const isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

  return (
    <>
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
        <FcSettings size={icon_size} />
      </div>
      <div className={styles.collapse_container} onClick={handleDropdownClick}>
        <Collapse in={isComponentVisible}>
          <Col className={'px-3'}>
            <Row className="m-auto pt-2">
              <div className="m-auto">
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
            <Row className="m-auto pb-2">
              <div className="m-auto">
                <Select
                  value={{
                    value: cur_person,
                    label:
                      cur_person === 'me' ? 'Me' : friendInfo[cur_person].name,
                  }}
                  isSearchable={true}
                  options={friend_options}
                  onChange={(option) => {
                    setFbPerson(option.value);
                  }}
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
