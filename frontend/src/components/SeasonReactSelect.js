import React, { useMemo } from 'react';
import CustomSelect from './CustomSelect';
import { toSeasonString } from '../courseUtilities';

/**
 * Render season dropdown
 * @prop cur_season - string that holds the current season code
 * @prop season_options - list of season codes
 * @prop onSeasonChange - function to change season
 */

function SeasonReactSelect({ cur_season, season_options, onSeasonChange }) {
  return (
    <CustomSelect
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
