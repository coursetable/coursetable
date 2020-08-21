import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import './DropdownShared.css';
import { toSeasonString } from '../utilities';

function SeasonDropdown(props) {
  const setSeason = (season_code) => {
    props.onSeasonChange(season_code);
  };

  let seasons_html = [];

  props.season_codes.forEach((season) => {
    seasons_html.push(
      <Dropdown.Item key={season} eventKey={season}>
        {toSeasonString(season)[0]}
      </Dropdown.Item>
    );
  });

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="dark"
        title={toSeasonString(props.cur_season)[0]}
        onSelect={setSeason}
      >
        {seasons_html}
      </DropdownButton>
    </div>
  );
}

export default SeasonDropdown;
