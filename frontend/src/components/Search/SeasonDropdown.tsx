import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import '../Navbar/DropdownShared.css';
import { toSeasonString } from '../../utilities/course';
import { useWorksheet } from '../../contexts/worksheetContext';

/**
 * Render Season Dropdown in mobile view
 * @prop onSeasonChange - function to switch seasons
 * @prop curSeason - string that holds the current season code
 */

function SeasonDropdown() {
  const { seasonCodes, curSeason, changeSeason } = useWorksheet();

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="dark"
        title={toSeasonString(curSeason)}
        onSelect={changeSeason}
      >
        {seasonCodes.map((season) => (
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
            <div className="mx-auto">{toSeasonString(season)}</div>
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
}

export default SeasonDropdown;
