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
    /*
    // Metric Tracking of Season Changes
    window.umami.trackEvent(cur_season, "search-season");
    */
    onSeasonChange(season_code);
  };

  // HTML holding season options
  let seasons_html = [];

  // Populate list of HTML options
  season_codes.forEach((season) => {
    seasons_html.push(
      <Dropdown.Item
        key={season}
        eventKey={season}
        className="d-flex"
        // Styling if this is the current season
        style={{
          backgroundColor: season === cur_season ? '#007bff' : '',
          color: season === cur_season ? 'white' : 'black',
        }}
      >
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
