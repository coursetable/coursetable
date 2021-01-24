import React, { useCallback, useRef } from 'react';
import { Form, InputGroup, Row } from 'react-bootstrap';
import { GlobalHotKeys } from 'react-hotkeys';
import { scroller } from 'react-scroll';
import styles from './NavbarSearch.module.css';
import styled from 'styled-components';
import { useSessionStorageState } from '../browserStorage';
import { StyledInput } from './StyledComponents';
import { useWindowDimensions } from './WindowDimensionsProvider';
import { useFerry } from './FerryProvider';
import { ValueType } from 'react-select/src/types';
import { Popout } from './Popout';
import { PopoutSelect } from './PopoutSelect';

const NavbarStyledSearchBar = styled(StyledInput)`
  border-radius: 4px;
  height: 100%;
  font-size: 14px;
`;

type Season = {
  label: string;
  value: string;
};

export const NavbarSearch: React.FC = () => {
  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;
  // const is_relative = width < 1230;

  // Search text for the default search if search bar was used
  const searchTextInput = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useSessionStorageState('searchText', '');

  const defaultSeason: Season = { value: '202101', label: 'Spring 2021' };
  const [
    select_seasons,
    setSelectSeasons,
  ] = useSessionStorageState('select_seasons', [defaultSeason]);

  const scroll_to_results = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault();

      // Scroll down to catalog when in mobile view.
      if (is_mobile) {
        scroller.scrollTo('catalog', {
          smooth: true,
          duration: 500,
          offset: -56,
        });
      }
    },
    [is_mobile]
  );

  // ctrl/cmd-f search hotkey
  const focusSearch = (e: KeyboardEvent | undefined) => {
    if (e && searchTextInput.current) {
      e.preventDefault();
      searchTextInput.current.focus();
    }
  };
  const keyMap = {
    FOCUS_SEARCH: ['ctrl+f', 'command+f'],
  };
  const handlers = {
    FOCUS_SEARCH: focusSearch,
  };

  // populate seasons from database
  let seasonsOptions;
  const { seasons: seasonsData } = useFerry();
  if (seasonsData && seasonsData.seasons) {
    seasonsOptions = seasonsData.seasons.map((x) => {
      return {
        value: x.season_code,
        // capitalize term and add year
        label: `${x.term.charAt(0).toUpperCase() + x.term.slice(1)} ${x.year}`,
      };
    });
  }

  const handleSeasonChange = (options: Season[]) => {
    // Set seasons state
    setSelectSeasons(options || []);
  };

  return (
    <>
      <GlobalHotKeys
        keyMap={keyMap} // TODO: Add changes from a66c8c837ae2e56c47666121c1e377826a12151b to disable GlobalHotKeys if modal is open
        handlers={handlers}
        allowChanges // required for global
        style={{ outline: 'none' }}
      />
      {/* Search Form */}
      <Form className="px-0 h-100" onSubmit={scroll_to_results}>
        <Row className="h-50 mx-auto">
          <div className={styles.search_bar}>
            {/* Search Bar */}
            <InputGroup className={styles.full_height}>
              <NavbarStyledSearchBar
                type="text"
                value={searchText}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search by course code, title, prof, or whatever we don't really care"
                ref={searchTextInput}
              />
            </InputGroup>
          </div>
        </Row>
        <Row className="h-50 mx-auto align-items-center">
          {/* <NavbarSearchDropdown
            name="season"
            placeholder="Season"
            toggleText=""
            setActiveDropdown={setActiveDropdown}
            ref_select={seasonRef}
          >
            <CustomSelect
              isMulti
              openMenuOnFocus
              keepMenuOpen
              value={select_seasons}
              options={seasonsOptions}
              placeholder="Last 5 Years"
              // defaultMenuIsOpen
              // menuIsOpen={activeDropdown === 'season'}
              // prevent overlap with tooltips
              menuPortalTarget={document.body}
              onChange={(selectedOption: ValueType<Season>) =>
                handleSeasonChange(selectedOption as Season[])
              }
              innerRef={seasonRef}
            />
          </NavbarSearchDropdown> */}
          <Popout buttonText="Season">
            <PopoutSelect
              isMulti
              value={select_seasons}
              options={seasonsOptions}
              placeholder="Last 5 Years"
              onChange={(selectedOption: ValueType<Season>) =>
                handleSeasonChange(selectedOption as Season[])
              }
            />
          </Popout>
        </Row>
      </Form>
    </>
  );
};
