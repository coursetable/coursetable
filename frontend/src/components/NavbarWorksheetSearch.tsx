import React, { useMemo } from 'react';
import { Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { ValueType } from 'react-select/src/types';
import { Popout } from './Popout';
import { PopoutSelect } from './PopoutSelect';

// import { sortbyOptions } from '../queries/Constants';
import { isOption, Option } from '../searchContext';
// import { breakpoints } from '../utilities';
import _ from 'lodash';
import { useWorksheet } from '../worksheetContext';
import { toSeasonString } from '../courseUtilities';
import { useUser } from '../user';
// import CatalogColumnSort from './CatalogColumnSort';

// Row in navbar search
const StyledRow = styled(Row)`
  width: auto;
  margin-left: auto;
  margin-right: auto;
`;

// Filter group wrapper
const FilterGroup = styled.div``;

/**
 * Worksheet search form for the desktop in the navbar
 */
export const NavbarWorksheetSearch: React.FC = () => {
  // Get search context data
  // const { } = useSearch();

  const {
    season_options,
    cur_season,
    changeSeason,
    fb_person,
    handleFBPersonChange,
  } = useWorksheet();

  const selected_season = useMemo(() => {
    return {
      value: cur_season,
      label: toSeasonString(cur_season)[0],
    };
  }, [cur_season]);

  // Fetch user context data
  const { user } = useUser();

  // FB Friends names
  const friendInfo = useMemo(() => {
    return user.fbLogin && user.fbWorksheets
      ? user.fbWorksheets.friendInfo
      : {};
  }, [user.fbLogin, user.fbWorksheets]);

  // List of FB friend options. Initialize with me option
  const friend_options = useMemo(() => {
    const friend_options_temp = [];
    // Add FB friend to dropdown if they have worksheet courses in the current season
    for (const friend in friendInfo) {
      friend_options_temp.push({
        value: friend,
        label: friendInfo[friend].name,
      });
    }
    // Sort FB friends in alphabetical order
    friend_options_temp.sort((a, b) => {
      return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : 1;
    });
    return friend_options_temp;
  }, [friendInfo]);

  const selected_fb = useMemo(() => {
    if (!user.fbLogin) {
      return {
        value: fb_person,
        label: 'Connect FB',
      };
    }
    if (fb_person === 'me') {
      return null;
    }
    return {
      value: fb_person,
      label: friendInfo[fb_person].name,
    };
  }, [user.fbLogin, fb_person, friendInfo]);

  // const globalTheme = useTheme();

  return (
    <>
      {/* Search Form */}
      <Form
        className="px-0"
        // onSubmit={scroll_to_results}
        data-tutorial="catalog-1"
      >
        <StyledRow>
          <FilterGroup className="d-flex align-items-center">
            {/* Season Filter Dropdown */}
            <Popout
              buttonText="Season"
              type="season"
              select_options={selected_season}
              clearIcon={false}
            >
              <PopoutSelect
                isMulti={false}
                value={selected_season}
                options={season_options}
                placeholder="Last 5 Years"
                onChange={(selectedOption: ValueType<Option>) => {
                  if (isOption(selectedOption)) {
                    changeSeason(selectedOption.value);
                  }
                }}
              />
            </Popout>
            {/* Facebook Dropdown */}
            <Popout
              buttonText="Friends' courses"
              type="facebook"
              select_options={selected_fb}
              clearIcon={false}
              isDisabled={!user.fbLogin}
              disabledButtonText="Connect FB"
            >
              <PopoutSelect
                isMulti={false}
                value={selected_fb}
                options={friend_options}
                placeholder="Friends' courses"
                onChange={(selectedOption: ValueType<Option>) => {
                  // Cleared FB friend
                  if (!selectedOption) handleFBPersonChange('me');
                  // Selected FB friend
                  else if (isOption(selectedOption))
                    handleFBPersonChange(selectedOption.value);
                }}
                isDisabled={!user.fbLogin}
              />
            </Popout>
          </FilterGroup>
        </StyledRow>
      </Form>
    </>
  );
};
