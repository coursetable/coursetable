import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import './DropdownShared.css';
import { toSeasonString } from '../utilities';

/**
 * Render Season Dropdown in mobile view
 * @prop onSeasonChange - function to switch seasons
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of all season codes present in worksheet
 */

function SeasonDropdown({ onSeasonChange, cur_season, season_codes }) {
  // Change season
  const setSeason = (season_code) => {
    onSeasonChange(season_code);
  };

  // HTML holding season options
  let seasons_html = [];

  // Populate list of HTML options
  season_codes.forEach((season) => {
    seasons_html.push(
      <Dropdown.Item key={season} eventKey={season} className="d-flex">
        <div className="mx-auto">{toSeasonString(season)[0]}</div>
      </Dropdown.Item>
    );
  });

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="dark"
        title={toSeasonString(cur_season)[0]}
        onSelect={setSeason}
      >
        {seasons_html}
      </DropdownButton>
    </div>
  );
}

export default SeasonDropdown;
