import React, { useMemo } from 'react';
import { toSeasonString } from '../utilities';
import { StyledSelect } from './StyledComponents';

/**
 * Render season dropdown
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 */

function SeasonReactSelect({ cur_season, season_codes, onSeasonChange }) {
  // List to hold season dropdown options
  let season_options = useMemo(() => {
    let season_options_temp = [];
    // Sort season codes from most to least recent
    season_codes.sort();
    season_codes.reverse();
    // Iterate over seasons and populate season_options list
    season_codes.forEach((season_code) => {
      season_options_temp.push({
        value: season_code,
        label: toSeasonString(season_code)[0],
      });
    });
    return season_options_temp;
  }, [season_codes]);

  return (
    <StyledSelect
      classNamePrefix={'Select'}
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
