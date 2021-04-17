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
import { SmallTextComponent, StyledInput } from './StyledComponents';
import { useWindowDimensions } from './WindowDimensionsProvider';
import { ValueType } from 'react-select/src/types';
import { Popout } from './Popout';
import { PopoutSelect } from './PopoutSelect';
import { Range } from 'rc-slider';
import { IoClose } from 'react-icons/io5';

import {
  skillsAreasOptions,
  creditOptions,
  schoolOptions,
  subjectOptions,
  sortbyOptions,
} from '../queries/Constants';
import CustomSelect from './CustomSelect';
import { useSearch, Option, defaultFilters } from '../searchContext';
import { breakpoints } from '../utilities';
import chroma from 'chroma-js';
import _ from 'lodash';
import ResultsColumnSort from './ResultsColumnSort';

// Row in navbar search
const StyledRow = styled(Row)`
  height: 50%;
  width: auto;
  margin-left: auto;
  margin-right: auto;
`;

// Wrapper for search bar
const SearchWrapper = styled.div`
  width: 40vw;
  display: flex;
  align-items: center;
`;

// Search bar
const NavbarStyledSearchBar = styled(StyledInput)`
  border-radius: 4px;
  height: 100%;
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
`;

// Range filter
const StyledRange = styled(Range)`
  width: 100px;
  cursor: pointer;
`;

// Range filter label
const RangeLabel = styled.div`
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
  user-select: none;
  cursor: default;
`;

// Range filter value label
const RangeValueLabel = styled.div`
  font-size: 12px;
  ${breakpoints('font-size', 'px', [{ 1320: 10 }])};
  user-select: none;
  cursor: default;
`;

// Wrapper for advanced filters dropdown
const AdvancedWrapper = styled.div`
  width: 440px;
`;

// Advanced filters label in dropdown
const AdvancedLabel = styled.div`
  font-size: 14px;
  ${breakpoints('font-size', 'px', [{ 1320: 12 }])};
  margin-left: 0.25rem;
  user-select: none;
  cursor: default;
`;

// Advanced select in dropdown
const AdvancedSelect = styled(CustomSelect)`
  width: 80%;
`;

// Row for toggles in advanced filters
const AdvancedToggleRow = styled(Row)`
  background-color: ${({ theme }) => theme.button_active};
`;

// Advanced filter toggle
const Toggle = styled(Form.Check)`
  margin: 0.25rem 0;
  user-select: none;
`;

// Advanced filter toggle input
const ToggleInput = styled(Form.Check.Input)`
  cursor: pointer !important;
`;

// Advanced filter toggle label
const ToggleLabel = styled(Form.Check.Label)`
  cursor: pointer !important;
`;

// Filter group wrapper
const FilterGroup = styled.div``;

// Reset button
const StyledButton = styled(Button)`
  padding: 0.25rem 0.375rem;
  font-size: 12px;
  ${breakpoints('font-size', 'px', [{ 1320: 10 }])};
`;

// Clear search bar button
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

/**
 * Catalog search form for the desktop in the navbar
 */
export const NavbarCatalogSearch: React.FC = () => {
  // Fetch current device
  const { isMobile, isLgDesktop } = useWindowDimensions();

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
    searchData,
    seasonsOptions,
    coursesLoading,
    speed,
    course_modal,
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

  // Active state for overall and workload range filters
  const [activeOverall, setActiveOverall] = useState(false);
  const [activeWorkload, setActiveWorkload] = useState(false);

  const globalTheme = useTheme();

  // Handle active state for overall and workload range filters
  useEffect(() => {
    if (canReset && !_.isEqual(overallBounds, defaultFilters.defaultBounds)) {
      setActiveOverall(true);
    } else {
      setActiveOverall(false);
    }
    if (canReset && !_.isEqual(workloadBounds, defaultFilters.defaultBounds)) {
      setActiveWorkload(true);
    } else {
      setActiveWorkload(false);
    }
  }, [canReset, overallBounds, workloadBounds]);

  // Active styles for overall and workload range filters
  const activeStyle = useCallback(
    (active: boolean) => {
      if (active) {
        return { color: globalTheme.primary_hover };
      }
      return undefined;
    },
    [globalTheme]
  );

  // Responsive styles for overall and workload range filters
  const range_handle_style = useCallback(() => {
    if (isLgDesktop) {
      return undefined;
    }
    const styles: React.CSSProperties = { height: '12px', width: '12px' };
    return [styles, styles];
  }, [isLgDesktop]);
  const range_rail_style = useCallback(() => {
    if (isLgDesktop) {
      return {};
    }
    const styles: React.CSSProperties = { marginTop: '-1px' };
    return styles;
  }, [isLgDesktop]);

  // Scroll down to catalog when in mobile view.
  const scroll_to_results = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault();

      if (isMobile) {
        scroller.scrollTo('catalog', {
          smooth: true,
          duration: 500,
          offset: -56,
        });
      }
    },
    [isMobile]
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

  // Consolidate all advanced filters' selected options
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

  // Styles for active search bar
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
        keyMap={course_modal[0] ? {} : keyMap}
        handlers={course_modal[0] ? {} : handlers}
        allowChanges // required for global
        style={{ outline: 'none' }}
      />
      {/* Search Form */}
      <Form
        className="px-0 h-100"
        onSubmit={scroll_to_results}
        data-tutorial="catalog-1"
      >
        {/* Top row */}
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
          {/* Number of results shown & seach speed text */}
          <SmallTextComponent
            type={2}
            className="ml-2 mb-1 d-flex align-items-end"
            style={{ whiteSpace: 'pre-line' }}
          >
            {coursesLoading
              ? 'Searching ...'
              : `Showing ${searchData.length} results${
                  speed.length > 20 ? '\n' : ' '
                }(${speed})`}
          </SmallTextComponent>
        </StyledRow>
        {/* Bottom row */}
        <StyledRow className="align-items-center">
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
              data_tutorial={2}
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
            {/* Areas/Skills Filter Dropdown */}
            <Popout
              buttonText="Areas/Skills"
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
                placeholder="All Areas/Skills"
                onChange={(selectedOption: ValueType<Option>) => {
                  setSelectSkillsAreas((selectedOption as Option[]) || []);
                  setStartTime(Date.now());
                }}
              />
            </Popout>
            <div
              className="w-auto flex-grow-0 d-flex align-items-center"
              data-tutorial="catalog-3"
            >
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
                  }}
                />
              </Col>
            </div>
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
              data_tutorial={4}
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
                    menuPortalTarget={document.querySelector('#portal')}
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
                    menuPortalTarget={document.querySelector('#portal')}
                    onChange={(selectedOption: ValueType<Option>) => {
                      setSelectCredits((selectedOption as Option[]) || []);
                      setStartTime(Date.now());
                    }}
                  />
                </Row>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  {/* Sort by Guts */}
                  <AdvancedLabel>{sortbyOptions[7].label}:</AdvancedLabel>
                  <ResultsColumnSort
                    selectOption={sortbyOptions[7]}
                    key={reset_key}
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

          {/* Reset Filters & Sorting Button */}
          <StyledButton
            variant="danger"
            onClick={handleResetFilters}
            disabled={!canReset}
          >
            Reset
          </StyledButton>
        </StyledRow>
      </Form>
    </>
  );
};
