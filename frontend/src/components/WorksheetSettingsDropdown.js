import React, { useRef } from 'react';

import styles from './WorksheetSettingsDropdown.module.css';
import me_dropdown_styles from './MeDropdown.module.css';
import { Row, Col, Collapse } from 'react-bootstrap';
import Select from 'react-select';
import { toSeasonString } from '../utilities';

function WorksheetSettingsDropdown({
  setIsComponentVisible,
  settings_expanded,
  cur_season,
  season_codes,
  onSeasonChange,
}) {
  const handleDropdownClick = () => {
    // setIsComponentVisible(true);
  };

  let options = [];
  season_codes.sort();
  season_codes.reverse();
  season_codes.forEach((season_code) => {
    options.push({
      value: season_code,
      label: toSeasonString(season_code)[0],
    });
  });

  const season_dropdown_ref = useRef(null);

  const handleMouseEnter = () => {
    season_dropdown_ref.current.focus();
  };

  return (
    <div
      className={
        me_dropdown_styles.collapse_container + ' ' + styles.collapse_container
      }
      onClick={handleDropdownClick}
    >
      <Collapse in={settings_expanded}>
        <Col className={me_dropdown_styles.collapse_col + ' px-3'}>
          <Row className="m-auto py-2">
            <div className="m-auto" onMouseEnter={handleMouseEnter}>
              <Select
                value={{
                  value: cur_season,
                  label: toSeasonString(cur_season)[0],
                }}
                isSearchable={false}
                options={options}
                onChange={(option) => {
                  onSeasonChange(option.value);
                  setIsComponentVisible(false);
                }}
                openMenuOnFocus={true}
                ref={season_dropdown_ref}
              />
            </div>
          </Row>
        </Col>
      </Collapse>
    </div>
  );
}

export default WorksheetSettingsDropdown;
