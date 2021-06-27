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
import { SmallTextComponent, StyledInput } from '../StyledComponents';
import { useWindowDimensions } from '../WindowDimensionsProvider';
import { ValueType } from 'react-select/src/types';
import { Popout } from '../Popout';
import { PopoutSelect } from '../PopoutSelect';
import { Range } from 'rc-slider';
import { IoClose } from 'react-icons/io5';

import {
  skillsAreasOptions,
  creditOptions,
  schoolOptions,
  subjectOptions,
  sortbyOptions,
  dayOptions,
} from '../../queries/Constants';
import CustomSelect from '../CustomSelect';
import { useSearch, Option, defaultFilters } from '../../searchContext';
import { breakpoints } from '../../utilities';
import chroma from 'chroma-js';
import _ from 'lodash';
import ResultsColumnSort from '../Results/ResultsColumnSort';
import {
  toRangeTime,
  toRealTime,
  to12HourTime,
  toLinear,
  toExponential,
} from '../../courseUtilities';

// Row in navbar search
const StyledRow = styled(Row)`
  height: 50%;
  width: auto;
  margin-left: auto;
  margin-right: auto;
`;

// Wrapper for search bar
const SearchWrapper = styled.div<{ isTablet: boolean }>`
  width: ${({ isTablet }) => (isTablet ? 35 : 40)}vw;
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

// Base range styles
const BaseRange = styled(Range)`
  cursor: pointer;
`;

// Range filter
const StyledRange = styled(BaseRange)<{ isTablet: boolean }>`
  width: ${({ isTablet }) => (isTablet ? 74 : 100)}px;
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
  max-height: 80vh;
  overflow: auto;
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

// Advanced range styles
const AdvancedRange = styled(BaseRange)`
  margin-bottom: 20px;
`;

// Advanced range group
const AdvancedRangeGroup = styled.div`
  width: 75%;
  display: flex;
  flex-grow: 0;
  flex-direction: column;
  align-items: center;
  margin-right: 0.5rem;
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
  const { isMobile, isTablet, isLgDesktop } = useWindowDimensions();

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
    select_days,
    timeBounds,
    timeValueLabels,
    enrollBounds,
    enrollValueLabels,
    numBounds,
    numValueLabels,
    select_schools,
    select_credits,
    hideCancelled,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    select_sortby,
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
    setSelectDays,
    setTimeBounds,
    setTimeValueLabels,
    setEnrollBounds,
    setEnrollValueLabels,
    setNumBounds,
    setNumValueLabels,
    setSelectSchools,
    setSelectCredits,
    setHideCancelled,
    setHideFirstYearSeminars,
    setHideGraduateCourses,
    setHideDiscussionSections,
    handleResetFilters,
    setResetKey,
    setStartTime,
  } = useSearch();

  // Active state for range filters
  const [activeOverall, setActiveOverall] = useState(false);
  const [activeWorkload, setActiveWorkload] = useState(false);
  const [activeTime, setActiveTime] = useState(false);
  const [activeEnrollment, setActiveEnrollment] = useState(false);
  const [activeNumber, setActiveNumber] = useState(false);

  const globalTheme = useTheme();

  // Handle active state for range filters
  useEffect(() => {
    setActiveOverall(
      canReset && !_.isEqual(overallBounds, defaultFilters.defaultRatingBounds)
    );
    setActiveWorkload(
      canReset && !_.isEqual(workloadBounds, defaultFilters.defaultRatingBounds)
    );
    setActiveTime(
      canReset && !_.isEqual(timeBounds, defaultFilters.defaultTimeBounds)
    );
    setActiveEnrollment(
      canReset &&
        !_.isEqual(
          enrollBounds.map(Math.round),
          defaultFilters.defaultEnrollBounds
        )
    );
    setActiveNumber(
      canReset && !_.isEqual(numBounds, defaultFilters.defaultNumBounds)
    );
  }, [
    canReset,
    overallBounds,
    workloadBounds,
    timeBounds,
    enrollBounds,
    numBounds,
  ]);

  // Active styles for range filters
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
      selects: {
        select_days,
        select_schools,
        select_credits,
        select_subjects: isTablet && select_subjects,
        select_seasons: isTablet && select_seasons,
        select_skillsareas: isTablet && select_skillsareas,
      },
      ranges: {
        activeTime,
        activeEnrollment,
        activeNumber,
      },
      toggles: {
        hideCancelled,
        hideFirstYearSeminars,
        hideGraduateCourses,
        hideDiscussionSections,
      },
      sorts: {
        average_gut_rating: select_sortby.value === sortbyOptions[7].value,
      },
    }),
    [
      select_days,
      select_schools,
      select_credits,
      select_subjects,
      select_seasons,
      select_skillsareas,
      activeTime,
      activeEnrollment,
      activeNumber,
      hideCancelled,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      select_sortby,
      isTablet,
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
          <SearchWrapper isTablet={isTablet}>
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
                  !isTablet ? `${speed.length > 20 ? '\n' : ' '}(${speed})` : ''
                }`}
          </SmallTextComponent>
        </StyledRow>
        {/* Bottom row */}
        <StyledRow className="align-items-center">
          <FilterGroup className="d-flex align-items-center">
            {!isTablet && (
              <>
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
                    onChange={(selectedOption: ValueType<Option, boolean>) => {
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
                    onChange={(selectedOption: ValueType<Option, boolean>) => {
                      setSelectSkillsAreas((selectedOption as Option[]) || []);
                      setStartTime(Date.now());
                    }}
                  />
                </Popout>
              </>
            )}

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
                  min={defaultFilters.defaultRatingBounds[0]}
                  max={defaultFilters.defaultRatingBounds[1]}
                  step={0.1}
                  isTablet={isTablet}
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
                  min={defaultFilters.defaultRatingBounds[0]}
                  max={defaultFilters.defaultRatingBounds[1]}
                  step={0.1}
                  isTablet={isTablet}
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
            {!isTablet && (
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
                  hideSelectedOptions={false}
                  onChange={(selectedOption: ValueType<Option, boolean>) => {
                    setSelectSeasons((selectedOption as Option[]) || []);
                    setStartTime(Date.now());
                  }}
                />
              </Popout>
            )}
            {/* Advanced Filter Dropdown */}
            <Popout
              buttonText="Advanced"
              arrowIcon={false}
              type="advanced"
              onReset={() => {
                if (isTablet) {
                  setSelectSubjects(defaultFilters.defaultOptions);
                  setSelectSeasons(defaultFilters.defaultOptions);
                  setSelectSkillsAreas(defaultFilters.defaultOptions);
                }
                setSelectDays(defaultFilters.defaultOptions);
                setSelectSchools(defaultFilters.defaultOptions);
                setSelectCredits(defaultFilters.defaultOptions);
                setHideCancelled(defaultFilters.defaultFalse);
                setHideFirstYearSeminars(defaultFilters.defaultFalse);
                setHideGraduateCourses(defaultFilters.defaultFalse);
                setHideDiscussionSections(defaultFilters.defaultFalse);
                setTimeBounds(defaultFilters.defaultTimeBounds);
                setTimeValueLabels(defaultFilters.defaultTimeBounds);
                setEnrollBounds(defaultFilters.defaultEnrollBounds);
                setEnrollValueLabels(defaultFilters.defaultEnrollBounds);
                setNumBounds(defaultFilters.defaultNumBounds);
                setNumValueLabels(defaultFilters.defaultNumBounds);
                setStartTime(Date.now());
                setResetKey(reset_key + 1);
              }}
              select_options={advanced_options}
              data_tutorial={4}
            >
              <AdvancedWrapper>
                {isTablet && (
                  <>
                    <Row className="align-items-center justify-content-between mx-3 mt-3">
                      {/* Yale Subjects Filter Dropdown */}
                      <AdvancedLabel>Subject:</AdvancedLabel>
                      <AdvancedSelect
                        closeMenuOnSelect
                        isMulti
                        value={select_subjects}
                        options={subjectOptions}
                        placeholder="All Subjects"
                        // prevent overlap with tooltips
                        menuPortalTarget={document.querySelector('#portal')}
                        onChange={(
                          selectedOption: ValueType<Option, boolean>
                        ) => {
                          setSelectSubjects((selectedOption as Option[]) || []);
                          setStartTime(Date.now());
                        }}
                      />
                    </Row>
                    <Row className="align-items-center justify-content-between mx-3 mt-3">
                      {/* Areas/Skills Filter Dropdown */}
                      <AdvancedLabel>Areas/Skills:</AdvancedLabel>
                      <AdvancedSelect
                        useColors
                        closeMenuOnSelect
                        isMulti
                        value={select_skillsareas}
                        options={skillsAreasOptions}
                        placeholder="All Areas/Skills"
                        // prevent overlap with tooltips
                        menuPortalTarget={document.querySelector('#portal')}
                        onChange={(
                          selectedOption: ValueType<Option, boolean>
                        ) => {
                          setSelectSkillsAreas(
                            (selectedOption as Option[]) || []
                          );
                          setStartTime(Date.now());
                        }}
                      />
                    </Row>
                    <Row className="align-items-center justify-content-between mx-3 mt-3">
                      {/* Season Filter Dropdown */}
                      <AdvancedLabel>Season:</AdvancedLabel>
                      <AdvancedSelect
                        closeMenuOnSelect
                        isMulti
                        value={select_seasons}
                        options={seasonsOptions}
                        placeholder="Last 5 Years"
                        // prevent overlap with tooltips
                        menuPortalTarget={document.querySelector('#portal')}
                        onChange={(
                          selectedOption: ValueType<Option, boolean>
                        ) => {
                          setSelectSeasons((selectedOption as Option[]) || []);
                          setStartTime(Date.now());
                        }}
                      />
                    </Row>
                  </>
                )}
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  {/* Day Multi-Select */}
                  <AdvancedLabel>Day:</AdvancedLabel>
                  <AdvancedSelect
                    closeMenuOnSelect
                    isMulti
                    value={select_days}
                    options={dayOptions}
                    placeholder="All Days"
                    // prevent overlap with tooltips
                    menuPortalTarget={document.querySelector('#portal')}
                    onChange={(selectedOption: ValueType<Option, boolean>) => {
                      setSelectDays((selectedOption as Option[]) || []);
                      setStartTime(Date.now());
                    }}
                  />
                </Row>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  <AdvancedLabel style={activeStyle(activeTime)}>
                    Time:
                  </AdvancedLabel>
                  <AdvancedRangeGroup>
                    {/* Time Range */}
                    <div className="d-flex align-items-center justify-content-between mb-1 w-100">
                      <RangeValueLabel>
                        {to12HourTime(timeValueLabels[0])}
                      </RangeValueLabel>
                      <RangeValueLabel>
                        {to12HourTime(timeValueLabels[1])}
                      </RangeValueLabel>
                    </div>
                    <AdvancedRange
                      min={toRangeTime(defaultFilters.defaultTimeBounds[0])}
                      max={toRangeTime(defaultFilters.defaultTimeBounds[1])}
                      step={1}
                      marks={{
                        84: '7AM',
                        120: '10AM',
                        156: '1PM',
                        192: '4PM',
                        228: '7PM',
                        264: '10PM',
                      }}
                      key={reset_key}
                      handleStyle={range_handle_style()}
                      railStyle={range_rail_style()}
                      trackStyle={[range_rail_style()]}
                      defaultValue={timeBounds.map(toRangeTime)}
                      onChange={(value) => {
                        setTimeValueLabels(value.map(toRealTime));
                      }}
                      onAfterChange={(value) => {
                        setTimeBounds(value.map(toRealTime));
                        setStartTime(Date.now());
                      }}
                    />
                  </AdvancedRangeGroup>
                </Row>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  <AdvancedLabel style={activeStyle(activeEnrollment)}>
                    # Enrolled:
                  </AdvancedLabel>
                  <AdvancedRangeGroup>
                    {/* Enrollment Range */}
                    <div className="d-flex align-items-center justify-content-between mb-1 w-100">
                      <RangeValueLabel>{enrollValueLabels[0]}</RangeValueLabel>
                      <RangeValueLabel>{enrollValueLabels[1]}</RangeValueLabel>
                    </div>
                    <AdvancedRange
                      min={Math.round(
                        toLinear(defaultFilters.defaultEnrollBounds[0])
                      )}
                      max={Math.round(
                        toLinear(defaultFilters.defaultEnrollBounds[1])
                      )}
                      step={10}
                      marks={{ 0: 1, 290: 18, 510: 160, 630: 528 }}
                      key={reset_key}
                      handleStyle={range_handle_style()}
                      railStyle={range_rail_style()}
                      trackStyle={[range_rail_style()]}
                      defaultValue={enrollBounds.map(toLinear)}
                      onChange={(value) => {
                        setEnrollValueLabels(
                          value.map(toExponential).map(Math.round)
                        );
                      }}
                      onAfterChange={(value) => {
                        setEnrollBounds(value.map(toExponential));
                        setStartTime(Date.now());
                      }}
                    />
                  </AdvancedRangeGroup>
                </Row>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  <AdvancedLabel style={activeStyle(activeNumber)}>
                    Course #:
                  </AdvancedLabel>
                  <AdvancedRangeGroup>
                    {/* Course Number Range */}
                    <div className="d-flex align-items-center justify-content-between mb-1 w-100">
                      <RangeValueLabel>
                        {numValueLabels[0].toString().padStart(3, '0')}
                      </RangeValueLabel>
                      <RangeValueLabel>
                        {numValueLabels[1] === 1000
                          ? '1000+'
                          : numValueLabels[1].toString().padStart(3, '0')}
                      </RangeValueLabel>
                    </div>
                    <AdvancedRange
                      min={defaultFilters.defaultNumBounds[0]}
                      max={defaultFilters.defaultNumBounds[1]}
                      step={10}
                      marks={{
                        0: '000',
                        100: '100',
                        200: '200',
                        300: '300',
                        400: '400',
                        500: '500',
                        600: '600',
                        700: '700',
                        800: '800',
                        900: '900',
                        1000: '1000+',
                      }}
                      key={reset_key}
                      handleStyle={range_handle_style()}
                      railStyle={range_rail_style()}
                      trackStyle={[range_rail_style()]}
                      defaultValue={numBounds}
                      onChange={(value) => {
                        setNumValueLabels(value);
                      }}
                      onAfterChange={(value) => {
                        setNumBounds(value);
                        setStartTime(Date.now());
                      }}
                    />
                  </AdvancedRangeGroup>
                </Row>
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
                    onChange={(selectedOption: ValueType<Option, boolean>) => {
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
                    onChange={(selectedOption: ValueType<Option, boolean>) => {
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
                  {/* Hide Discussion Sections Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideDiscussionSections}
                      onChange={() => {}} // dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        setHideDiscussionSections(!hideDiscussionSections);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide discussion sections
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
