import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import '../Navbar/DropdownShared.css';
import { toSeasonString } from '../../utilities/courseUtilities';
import { useWorksheet } from '../../contexts/worksheetContext';

/**
 * Render Season Dropdown in mobile view
 * @prop onSeasonChange - function to switch seasons
 * @prop curSeason - string that holds the current season code
 */

function SeasonDropdown() {
  const { seasonCodes, curSeason, changeSeason } = useWorksheet();

  // Populate list of HTML options
  const seasonsHTML = seasonCodes.map((season) => (
    <Dropdown.Item
      key={season}
      eventKey={season}
      className="d-flex"
      // Styling if this is the current season
      style={{
        backgroundColor: season === curSeason ? '#007bff' : '',
        color: season === curSeason ? 'white' : 'black',
      }}
    >
      <div className="mx-auto">{toSeasonString(season)[0]}</div>
    </Dropdown.Item>
  ));

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="dark"
        title={toSeasonString(curSeason)[0]}
        onSelect={changeSeason}
      >
        {seasonsHTML}
      </DropdownButton>
    </div>
  );
}

export default SeasonDropdown;
