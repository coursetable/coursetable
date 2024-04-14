import React, { useMemo } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import { toSeasonString } from '../../utilities/course';
import { useWorksheet } from '../../contexts/worksheetContext';
import { isOption, type Option } from '../../contexts/searchContext';
import type { Season } from '../../utilities/common';

function SeasonDropdownDesktop() {
  const { seasonCodes, curSeason, changeSeason } = useWorksheet();

  const selectedSeason = useMemo(() => {
    if (curSeason) {
      return {
        value: curSeason,
        label: toSeasonString(curSeason),
      };
    }
    return null;
  }, [curSeason]);

  return (
    <Popout
      buttonText="Season"
      displayOptionLabel
      maxDisplayOptions={1}
      selectedOptions={selectedSeason}
      clearIcon={false}
    >
      <PopoutSelect<Option<Season>, false>
        isClearable={false}
        hideSelectedOptions={false}
        value={selectedSeason}
        options={seasonCodes.map((seasonCode) => ({
          value: seasonCode,
          label: toSeasonString(seasonCode),
        }))}
        placeholder="Last 5 Years"
        onChange={(selectedOption) => {
          if (isOption(selectedOption))
            changeSeason(selectedOption.value as Season | null);
        }}
      />
    </Popout>
  );
}

function SeasonDropdownMobile() {
  const { seasonCodes, curSeason, changeSeason } = useWorksheet();

  return (
    <DropdownButton
      variant="dark"
      title={toSeasonString(curSeason)}
      onSelect={(s) => changeSeason(s as Season | null)}
    >
      {seasonCodes.map((season) => (
        <Dropdown.Item
          key={season}
          eventKey={season}
          className="d-flex"
          // Styling if this is the current season
          style={{
            backgroundColor: season === curSeason ? 'var(--color-primary)' : '',
          }}
        >
          <div className="mx-auto">{toSeasonString(season)}</div>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

function SeasonDropdown({ mobile }: { readonly mobile: boolean }) {
  return mobile ? <SeasonDropdownMobile /> : <SeasonDropdownDesktop />;
}

export default SeasonDropdown;
