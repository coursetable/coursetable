import { useMemo } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import type { Option } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import type { UserWorksheets } from '../../queries/api';
import type { Season } from '../../queries/graphql-types';
import { useStore } from '../../store';
import { toSeasonString } from '../../utilities/course';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

function seasonsWithDataFirst(
  seasons: Season[],
  worksheets: UserWorksheets | undefined,
) {
  if (!worksheets) return seasons;
  return seasons.sort((a, b) => {
    const aHasData = a in worksheets;
    const bHasData = b in worksheets;
    if (aHasData && !bHasData) return -1;
    if (!aHasData && bHasData) return 1;
    return Number(b) - Number(a);
  });
}

function SeasonDropdownDesktop() {
  const user = useStore((state) => state.user);
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
        options={seasonsWithDataFirst(seasonCodes, user.worksheets).map(
          (seasonCode) => ({
            value: seasonCode,
            label: toSeasonString(seasonCode),
          }),
        )}
        onChange={(selectedOption) => {
          changeSeason(selectedOption!.value);
        }}
        showControl={false}
        minWidth={200}
      />
    </Popout>
  );
}

function SeasonDropdownMobile() {
  const user = useStore((state) => state.user);
  const { seasonCodes, curSeason, changeSeason } = useWorksheet();

  return (
    <DropdownButton
      variant="dark"
      title={toSeasonString(curSeason)}
      onSelect={(s) => changeSeason(s as Season | null)}
    >
      {seasonsWithDataFirst(seasonCodes, user.worksheets).map((season) => (
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
