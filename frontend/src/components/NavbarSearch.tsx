import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Form, InputGroup, Row, Button } from 'react-bootstrap';
import { GlobalHotKeys } from 'react-hotkeys';
import { scroller } from 'react-scroll';
import styled, { useTheme } from 'styled-components';
import { StyledInput } from './StyledComponents';
import { useWindowDimensions } from './WindowDimensionsProvider';
import { useFerry } from './FerryProvider';
import { ValueType } from 'react-select/src/types';
import { Popout } from './Popout';
import { PopoutSelect } from './PopoutSelect';
import { Range } from 'rc-slider';
import { IoClose } from 'react-icons/io5';

import {
  // areas,
  // skills,
  skillsAreasOptions,
  creditOptions,
  schoolOptions,
  subjectOptions,
  // sortbyOptions,
} from '../queries/Constants';
import CustomSelect from './CustomSelect';
import { useSearch, Option, defaultFilters } from '../searchContext';
import { breakpoints } from '../utilities';
import chroma from 'chroma-js';

const StyledRow = styled(Row)`
  height: 50%;
  width: auto;
  margin-left: auto;
  margin-right: auto;
`;

const SearchWrapper = styled.div`
  width: 40vw;
  display: flex;
  align-items: center;
`;

const NavbarStyledSearchBar = styled(StyledInput)`
  border-radius: 4px;
  height: 100%;
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
`;

const StyledRange = styled(Range)`
  width: 100px;
  cursor: pointer;
`;

const RangeLabel = styled.div`
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
  user-select: none;
  cursor: default;
`;

const RangeValueLabel = styled.div`
  font-size: 12px;
  ${breakpoints('font-size', 'px', [{ 1320: 10 }])};
  user-select: none;
  cursor: default;
`;

const AdvancedWrapper = styled.div`
  width: 440px;
`;

const AdvancedLabel = styled.div`
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
  margin-left: 0.25rem;
  user-select: none;
  cursor: default;
`;

const AdvancedSelect = styled(CustomSelect)`
  width: 80%;
`;

const Toggle = styled(Form.Check)`
  margin: 0.25rem 0;
  user-select: none;
`;

const ToggleInput = styled(Form.Check.Input)`
  cursor: pointer !important;
`;

const ToggleLabel = styled(Form.Check.Label)`
  cursor: pointer !important;
`;

const AdvancedToggleRow = styled(Row)`
  background-color: ${({ theme }) => theme.button_active};
`;

const FilterGroup = styled.div``;

const StyledButton = styled(Button)`
  padding: 0.25rem 0.375rem;
  font-size: 12px;
  ${breakpoints('font-size', 'px', [{ 1320: 10 }])};
`;

const CloseIcon = styled(IoClose)`
  z-index: 1000;
  margin-left: -30px;
  cursor: pointer;
  color: ${({ theme }) => theme.icon_focus};
  &:hover {
    color: ${({ theme }) =>
      theme.theme === 'light'
        ? chroma(theme.icon_focus).darken().css()
        : chroma(theme.icon_focus).brighten().css()};
  }
`;

export const NavbarSearch: React.FC = () => {
  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;
  // const is_relative = width < 1230;

  // State to reset sortby dropdown and rating sliders
  // const [reset_key, setResetKey] = useState(0);

  // Search text for the default search if search bar was used
  const searchTextInput = useRef<HTMLInputElement>(null);

  // Get search context data
  const {
    canReset,
    searchText,
    select_subjects,
    select_skillsareas,
    overallBounds,
    overallValueLabels,
    workloadBounds,
    workloadValueLabels,
    select_seasons,
    select_schools,
    select_credits,
    hideCancelled,
    hideFirstYearSeminars,
    hideGraduateCourses,
    reset_key,
    setSearchText,
    setSelectSubjects,
    setSelectSkillsAreas,
    setOverallBounds,
    setOverallValueLabels,
    setWorkloadBounds,
    setWorkloadValueLabels,
    setSelectSeasons,
    setSelectSchools,
    setSelectCredits,
    setHideCancelled,
    setHideFirstYearSeminars,
    setHideGraduateCourses,
    handleResetFilters,
    setStartTime,
  } = useSearch();

  const [activeOverall, setActiveOverall] = useState(false);
  const [activeWorkload, setActiveWorkload] = useState(false);

  const globalTheme = useTheme();

  useEffect(() => {
    if (!canReset) {
      setActiveOverall(false);
      setActiveWorkload(false);
    }
  }, [canReset]);

  const activeStyle = useCallback(
    (active: boolean) => {
      if (active) {
        return { color: globalTheme.primary_hover };
      }
      return undefined;
    },
    [globalTheme]
  );

  const range_handle_style = useCallback(() => {
    if (width > 1320) {
      return undefined;
    }
    const styles: React.CSSProperties = { height: '12px', width: '12px' };
    return [styles, styles];
  }, [width]);

  const range_rail_style = useCallback(() => {
    if (width > 1320) {
      return {};
    }
    const styles: React.CSSProperties = { marginTop: '-1px' };
    return styles;
  }, [width]);

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

  const advanced_options = useMemo(
    () => ({
      selects: { select_schools, select_credits },
      toggles: { hideCancelled, hideFirstYearSeminars, hideGraduateCourses },
    }),
    [
      select_schools,
      select_credits,
      hideCancelled,
      hideFirstYearSeminars,
      hideGraduateCourses,
    ]
  );

  const searchbar_style = useMemo(() => {
    if (searchText) {
      return {
        backgroundColor: globalTheme.select_hover,
        borderColor: globalTheme.primary,
      };
    }
    return undefined;
  }, [searchText, globalTheme]);

  return (
    <>
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={handlers}
        allowChanges // required for global
        style={{ outline: 'none' }}
      />
      {/* Search Form */}
      <Form className="px-0 h-100" onSubmit={scroll_to_results}>
        <StyledRow>
          <SearchWrapper>
            {/* Search Bar */}
            <InputGroup className="h-100">
              <NavbarStyledSearchBar
                type="text"
                value={searchText}
                style={searchbar_style}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchText(event.target.value);
                  setStartTime(Date.now());
                }}
                placeholder="Search by course code, title, prof, or whatever we don't really care"
                ref={searchTextInput}
              />
            </InputGroup>
            {searchText && (
              <CloseIcon
                size={18}
                onClick={() => {
                  setSearchText('');
                  setStartTime(Date.now());
                }}
              />
            )}
          </SearchWrapper>
        </StyledRow>
        <StyledRow className="align-items-center justify-content-between">
          <FilterGroup className="d-flex align-items-center">
            {/* Yale Subjects Filter Dropdown */}
            <Popout
              buttonText="Subject"
              type="subject"
              onReset={() => {
                setSelectSubjects(defaultFilters.defaultOptions);
                setStartTime(Date.now());
              }}
              select_options={select_subjects}
            >
              <PopoutSelect
                isMulti
                value={select_subjects}
                options={subjectOptions}
                placeholder="All Subjects"
                onChange={(selectedOption: ValueType<Option>) => {
                  setSelectSubjects((selectedOption as Option[]) || []);
                  setStartTime(Date.now());
                }}
              />
            </Popout>
            {/* Skills/Areas Filter Dropdown */}
            <Popout
              buttonText="Skills/Areas"
              type="skills/areas"
              onReset={() => {
                setSelectSkillsAreas(defaultFilters.defaultOptions);
                setStartTime(Date.now());
              }}
              select_options={select_skillsareas}
              className="mr-0"
            >
              <PopoutSelect
                useColors
                isMulti
                value={select_skillsareas}
                options={skillsAreasOptions}
                placeholder="All Skills/Areas"
                onChange={(selectedOption: ValueType<Option>) => {
                  setSelectSkillsAreas((selectedOption as Option[]) || []);
                  setStartTime(Date.now());
                }}
              />
            </Popout>
            <Col className="w-auto flex-grow-0 d-flex flex-column align-items-center">
              {/* Overall Rating Range */}
              <div className="d-flex align-items-center justify-content-center mt-n1 w-100">
                <RangeValueLabel>{overallValueLabels[0]}</RangeValueLabel>
                <RangeLabel
                  className="flex-grow-1 text-center"
                  style={activeStyle(activeOverall)}
                >
                  Overall
                </RangeLabel>
                <RangeValueLabel>{overallValueLabels[1]}</RangeValueLabel>
              </div>
              <StyledRange
                min={1}
                max={5}
                step={0.1}
                key={reset_key}
                handleStyle={range_handle_style()}
                railStyle={range_rail_style()}
                trackStyle={[range_rail_style()]}
                defaultValue={overallBounds}
                onChange={(value) => {
                  setOverallValueLabels(value);
                }}
                onAfterChange={(value) => {
                  setOverallBounds(value);
                  setStartTime(Date.now());

                  setActiveOverall(true);
                }}
              />
            </Col>
            <Col className="w-auto flex-grow-0 d-flex flex-column align-items-center">
              {/* Workload Rating Range */}
              <div className="d-flex align-items-center justify-content-center mt-n1 w-100">
                <RangeValueLabel>{workloadValueLabels[0]}</RangeValueLabel>
                <RangeLabel
                  className="flex-grow-1 text-center"
                  style={activeStyle(activeWorkload)}
                >
                  Workload
                </RangeLabel>
                <RangeValueLabel>{workloadValueLabels[1]}</RangeValueLabel>
              </div>
              <StyledRange
                min={1}
                max={5}
                step={0.1}
                key={reset_key}
                handleStyle={range_handle_style()}
                railStyle={range_rail_style()}
                trackStyle={[range_rail_style()]}
                defaultValue={workloadBounds}
                onChange={(value) => {
                  setWorkloadValueLabels(value);
                }}
                onAfterChange={(value) => {
                  setWorkloadBounds(value);
                  setStartTime(Date.now());

                  setActiveWorkload(true);
                }}
              />
            </Col>
            {/* Season Filter Dropdown */}
            <Popout
              buttonText="Season"
              type="season"
              onReset={() => {
                setSelectSeasons(defaultFilters.defaultOptions);
                setStartTime(Date.now());
              }}
              select_options={select_seasons}
            >
              <PopoutSelect
                isMulti
                value={select_seasons}
                options={seasonsOptions}
                placeholder="Last 5 Years"
                onChange={(selectedOption: ValueType<Option>) => {
                  setSelectSeasons((selectedOption as Option[]) || []);
                  setStartTime(Date.now());
                }}
              />
            </Popout>
            {/* Advanced Filter Dropdown */}
            <Popout
              buttonText="Advanced"
              arrowIcon={false}
              type="advanced"
              onReset={() => {
                setSelectSchools(defaultFilters.defaultOptions);
                setSelectCredits(defaultFilters.defaultOptions);
                setHideCancelled(false);
                setHideFirstYearSeminars(false);
                setHideGraduateCourses(false);
                setStartTime(Date.now());
              }}
              select_options={advanced_options}
            >
              <AdvancedWrapper>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  {/* Yale Schools Multi-Select */}
                  <AdvancedLabel>School:</AdvancedLabel>
                  <AdvancedSelect
                    closeMenuOnSelect
                    isMulti
                    value={select_schools}
                    options={schoolOptions}
                    placeholder="All Schools"
                    // prevent overlap with tooltips
                    menuPortalTarget={document.body}
                    onChange={(selectedOption: ValueType<Option>) => {
                      setSelectSchools((selectedOption as Option[]) || []);
                      setStartTime(Date.now());
                    }}
                  />
                </Row>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  {/* Course Credit Multi-Select */}
                  <AdvancedLabel>Credit:</AdvancedLabel>
                  <AdvancedSelect
                    closeMenuOnSelect
                    isMulti
                    value={select_credits}
                    options={creditOptions}
                    placeholder="All Credits"
                    // prevent overlap with tooltips
                    menuPortalTarget={document.body}
                    onChange={(selectedOption: ValueType<Option>) => {
                      setSelectCredits((selectedOption as Option[]) || []);
                      setStartTime(Date.now());
                    }}
                  />
                </Row>
                <AdvancedToggleRow className="align-items-center justify-content-between mx-auto mt-3 py-2 px-4">
                  {/* Hide Cancelled Courses Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideCancelled}
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        setHideCancelled(!hideCancelled);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide cancelled courses
                    </ToggleLabel>
                  </Toggle>
                  {/* Hide First-Year Seminar Courses Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideFirstYearSeminars}
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        setHideFirstYearSeminars(!hideFirstYearSeminars);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide first-year seminars
                    </ToggleLabel>
                  </Toggle>
                  {/* Hide Graduate-Level Courses Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideGraduateCourses}
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        setHideGraduateCourses(!hideGraduateCourses);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide graduate courses
                    </ToggleLabel>
                  </Toggle>
                </AdvancedToggleRow>
              </AdvancedWrapper>
            </Popout>
          </FilterGroup>

          {/* Reset Filters Button */}
          <StyledButton
            variant="danger"
            onClick={handleResetFilters}
            disabled={!canReset}
          >
            Reset Filters
          </StyledButton>
        </StyledRow>
      </Form>
    </>
  );
};
