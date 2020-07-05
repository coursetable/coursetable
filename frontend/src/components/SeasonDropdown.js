import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import styles from './SeasonDropdown.module.css';

function SeasonDropdown(props) {
  const setSeason = season_code => {
    props.onSeasonChange(season_code);
  };

  const toSeasonString = season_code => {
    const seasons = ['', 'Spring', 'Summer', 'Fall'];
    return (
      season_code.substring(0, 4) + ' - ' + seasons[parseInt(season_code[5])]
    );
  };

  let seasons_html = [];

  props.season_codes.forEach(season => {
    seasons_html.push(
      <Dropdown.Item key={season} eventKey={season}>
        {toSeasonString(season)}
      </Dropdown.Item>
    );
  });

  return (
    <div className={styles.container}>
      <DropdownButton
        variant="outline-dark"
        title={toSeasonString(props.cur_season)}
        onSelect={setSeason}
      >
        {seasons_html}
      </DropdownButton>
    </div>
  );
}

export default SeasonDropdown;
