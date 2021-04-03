import React, { useMemo } from 'react';
import CustomSelect from './CustomSelect';
import { toSeasonString } from '../courseUtilities';
import { useWorksheet } from '../worksheetContext';

/**
 * Render season dropdown
 */

function SeasonReactSelect() {
  const { cur_season, season_options, changeSeason } = useWorksheet();

  return (
    <CustomSelect
      value={{
        value: cur_season,
        label: toSeasonString(cur_season)[0],
      }}
      isSearchable={false}
      options={season_options}
      onChange={(option) => {
        changeSeason(option.value);
      }}
    />
  );
}

export default SeasonReactSelect;
