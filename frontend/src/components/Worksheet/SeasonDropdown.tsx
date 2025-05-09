import { useMemo } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

import { useShallow } from 'zustand/react/shallow';
import type { Option } from '../../contexts/searchContext';
import type { Season } from '../../queries/graphql-types';
import { useStore } from '../../store';
import { toSeasonString } from '../../utilities/course';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

function SeasonDropdownDesktop() {
  const { seasonCodes, viewedSeason, changeViewedSeason } = useStore(
    useShallow((state) => ({
      seasonCodes: state.worksheetMemo.getSeasonCodes(state),
      viewedSeason: state.viewedSeason,
      changeViewedSeason: state.changeViewedSeason,
    })),
  );

  const selectedSeason = useMemo(() => {
    if (viewedSeason) {
      return {
        value: viewedSeason,
        label: toSeasonString(viewedSeason),
      };
    }
    return null;
  }, [viewedSeason]);

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
          changeViewedSeason(selectedOption!.value);
        }}
        showControl={false}
        minWidth={200}
      />
    </Popout>
  );
}

function SeasonDropdownMobile() {
  const { seasonCodes, viewedSeason, changeViewedSeason } = useStore(
    useShallow((state) => ({
      seasonCodes: state.worksheetMemo.getSeasonCodes(state),
      viewedSeason: state.viewedSeason,
      changeViewedSeason: state.changeViewedSeason,
    })),
  );

  return (
    <DropdownButton
      variant="dark"
      title={toSeasonString(viewedSeason)}
      onSelect={(s) => changeViewedSeason(s as Season)}
    >
      {seasonCodes.map((season) => (
        <Dropdown.Item
          key={season}
          eventKey={season}
          className="d-flex"
          // Styling if this is the current season
          style={{
            backgroundColor:
              season === viewedSeason ? 'var(--color-primary)' : '',
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
