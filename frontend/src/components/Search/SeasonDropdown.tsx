import { Dropdown, DropdownButton } from 'react-bootstrap';

import '../Navbar/DropdownShared.css';
import { toSeasonString } from '../../utilities/courseUtilities';
import { useWorksheet } from '../../worksheetContext';

/**
 * Render Season Dropdown in mobile view
 * @prop onSeasonChange - function to switch seasons
 * @prop cur_season - string that holds the current season code
 */

function SeasonDropdown() {
  const { season_codes, cur_season, changeSeason } = useWorksheet();

  // Populate list of HTML options
  const seasons_html = season_codes.map((season) => (
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
  ));

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="dark"
        title={toSeasonString(cur_season)[0]}
        // @ts-ignore
        onSelect={changeSeason}
      >
        {seasons_html}
      </DropdownButton>
    </div>
  );
}

export default SeasonDropdown;
