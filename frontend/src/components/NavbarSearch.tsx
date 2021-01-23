import React, { useCallback, useRef, useState } from 'react';
import { Form, InputGroup, Row } from 'react-bootstrap';
import { GlobalHotKeys } from 'react-hotkeys';
import { scroller } from 'react-scroll';
import styles from './NavbarSearch.module.css';
import styled from 'styled-components';
import { useSessionStorageState } from '../browserStorage';
import { StyledInput } from './StyledComponents';
import { useWindowDimensions } from './WindowDimensionsProvider';
import { NavbarSearchDropdown } from './NavbarSearchDropdown';
import CustomSelect from './CustomSelect';
import { useFerry } from './FerryProvider';
import { ValueType } from 'react-select/src/types';

const NavbarStyledSearchBar = styled(StyledInput)`
  border-radius: 4px;
  height: 100%;
  font-size: 14px;
`;

type Season = {
  label: any;
  value: any;
};

export const NavbarSearch: React.FC = () => {
  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;
  // const is_relative = width < 1230;

  // Search text for the default search if search bar was used
  const searchTextInput = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useSessionStorageState('searchText', '');

  // Active dropdown
  const [activeDropdown, setActiveDropdown] = useState('');
  console.log('active dropdown: ', activeDropdown);

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
        keyMap={keyMap}
        handlers={handlers}
        allowChanges // required for global
        style={{ outline: 'none' }}
      />
      {/* Search Form */}
      <Form
        className={`px-0 ${styles.full_height}`}
        onSubmit={scroll_to_results}
      >
        <Row className={`${styles.half_height} mx-auto`}>
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
        <Row className={`${styles.half_height} mx-auto`}>
          <NavbarSearchDropdown
            name="season"
            placeholder="Season"
            toggleText=""
            setActiveDropdown={setActiveDropdown}
          >
            {/* Seasons Multi-Select */}
            <CustomSelect
              isMulti
              keepMenuOpen
              value={select_seasons}
              options={seasonsOptions}
              placeholder="Last 5 Years"
              defaultMenuIsOpen
              menuIsOpen={activeDropdown === 'season'}
              // prevent overlap with tooltips
              menuPortalTarget={document.body}
              onChange={(selectedOption: ValueType<Season>) =>
                handleSeasonChange(selectedOption as Season[])
              }
            />
          </NavbarSearchDropdown>
        </Row>
      </Form>
    </>
  );
};
