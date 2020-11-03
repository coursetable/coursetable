import React from 'react';
import Select from 'react-select';
import { toSeasonString } from '../utilities';

/**
 * Render row of season and FB friends dropdowns
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 */

function SeasonReactSelect({ cur_season, season_codes, onSeasonChange }) {
  // List to hold season dropdown options
  let season_options = [];
  // Sort season codes from most to least recent
  season_codes.sort();
  season_codes.reverse();
  // Iterate over seasons and populate season_options list
  season_codes.forEach((season_code) => {
    season_options.push({
      value: season_code,
      label: toSeasonString(season_code)[0],
    });
  });
  return (
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
  );
}

export default SeasonReactSelect;
