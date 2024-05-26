import { useMemo } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import type { Option } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { Season } from '../../queries/graphql-types';
import { toSeasonString } from '../../utilities/course';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

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
        value={selectedSeason}
        options={seasonCodes.map((seasonCode) => ({
          value: seasonCode,
          label: toSeasonString(seasonCode),
        }))}
        onChange={(selectedOption) => {
          changeSeason(selectedOption!.value);
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
