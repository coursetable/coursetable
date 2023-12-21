import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Col, Form, InputGroup, Row, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { GlobalHotKeys } from 'react-hotkeys';
import { scroller } from 'react-scroll';
import styled, { useTheme } from 'styled-components';
import type { ValueType } from 'react-select/src/types';
import { Range } from 'rc-slider';
import { IoClose } from 'react-icons/io5';
import chroma from 'chroma-js';
import _ from 'lodash';

import { SmallTextComponent, StyledInput } from '../StyledComponents';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

import {
  skillsAreasOptions,
  creditOptions,
  schoolOptions,
  subjectOptions,
  sortbyOptions,
  dayOptions,
} from '../../queries/Constants';
import CustomSelect from '../CustomSelect';
import {
  useSearch,
  type Option,
  defaultFilters,
} from '../../contexts/searchContext';
import { breakpoints } from '../../utilities';
import ResultsColumnSort from '../Search/ResultsColumnSort';
import {
  toRangeTime,
  toRealTime,
  to12HourTime,
  toLinear,
  toExponential,
} from '../../utilities/courseUtilities';

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
  transition: color ${({ theme }) => theme.transDur};
`;

// Range filter value label
const RangeValueLabel = styled.div`
  font-size: 12px;
  ${breakpoints('font-size', 'px', [{ 1320: 10 }])};
  user-select: none;
  cursor: default;
  transition: color ${({ theme }) => theme.transDur};
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
  background-color: ${({ theme }) => theme.buttonActive};
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
  color: ${({ theme }) => theme.iconFocus};
  transition: color ${({ theme }) => theme.transDur};
  &:hover {
    color: ${({ theme }) =>
      theme.theme === 'light'
        ? chroma(theme.iconFocus).darken().css()
        : chroma(theme.iconFocus).brighten().css()};
  }
`;

/**
 * Catalog search form for the desktop in the navbar
 */
export function NavbarCatalogSearch() {
  // Fetch current device
  const { isMobile, isTablet, isLgDesktop } = useWindowDimensions();
  const [searchParams] = useSearchParams();
  const hasCourseModal = searchParams.has('course-modal');

  // Search text for the default search if search bar was used
  const searchTextInput = useRef<HTMLInputElement>(null);

  // Get search context data
  const {
    canReset,
    searchText,
    selectSubjects,
    selectSkillsAreas,
    overallBounds,
    overallValueLabels,
    workloadBounds,
    workloadValueLabels,
    selectSeasons,
    selectDays,
    timeBounds,
    timeValueLabels,
    enrollBounds,
    enrollValueLabels,
    numBounds,
    numValueLabels,
    selectSchools,
    selectCredits,
    searchDescription,
    hideCancelled,
    hideConflicting,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    selectSortby,
    resetKey,
    searchData,
    seasonsOptions,
    coursesLoading,
    speed,
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
    setSearchDescription,
    setHideCancelled,
    setHideConflicting,
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
      canReset && !_.isEqual(overallBounds, defaultFilters.defaultRatingBounds),
    );
    setActiveWorkload(
      canReset &&
        !_.isEqual(workloadBounds, defaultFilters.defaultRatingBounds),
    );
    setActiveTime(
      canReset && !_.isEqual(timeBounds, defaultFilters.defaultTimeBounds),
    );
    setActiveEnrollment(
      canReset &&
        !_.isEqual(
          enrollBounds.map(Math.round),
          defaultFilters.defaultEnrollBounds,
        ),
    );
    setActiveNumber(
      canReset && !_.isEqual(numBounds, defaultFilters.defaultNumBounds),
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
      if (active) return { color: globalTheme.primaryHover };

      return undefined;
    },
    [globalTheme],
  );

  // Responsive styles for overall and workload range filters
  const rangeHandleStyle = useMemo(() => {
    if (isLgDesktop) return undefined;

    const styles: React.CSSProperties = { height: '12px', width: '12px' };
    return [styles, styles];
  }, [isLgDesktop]);
  const rangeRailStyle = useMemo((): React.CSSProperties => {
    if (isLgDesktop) return {};

    const styles = { marginTop: '-1px' };
    return styles;
  }, [isLgDesktop]);

  // Ctrl/cmd-f search hotkey
  const keyMap = {
    FOCUS_SEARCH: ['ctrl+f', 'command+f'],
  };
  const handlers = {
    FOCUS_SEARCH(e: KeyboardEvent | undefined) {
      if (e && searchTextInput.current) {
        e.preventDefault();
        searchTextInput.current.focus();
      }
    },
  };

  // Consolidate all advanced filters' selected options
  const advancedOptions = useMemo(
    () => ({
      selects: {
        selectDays,
        selectSchools,
        selectCredits,
        selectSubjects: isTablet && selectSubjects,
        selectSeasons: isTablet && selectSeasons,
        selectSkillsAreas: isTablet && selectSkillsAreas,
      },
      ranges: {
        activeTime,
        activeEnrollment,
        activeNumber,
      },
      toggles: {
        searchDescription,
        hideCancelled,
        hideConflicting,
        hideFirstYearSeminars,
        hideGraduateCourses,
        hideDiscussionSections,
      },
      sorts: {
        average_gut_rating: selectSortby.value === sortbyOptions[7].value,
      },
    }),
    [
      selectDays,
      selectSchools,
      selectCredits,
      selectSubjects,
      selectSeasons,
      selectSkillsAreas,
      activeTime,
      activeEnrollment,
      activeNumber,
      searchDescription,
      hideCancelled,
      hideConflicting,
      hideFirstYearSeminars,
      hideGraduateCourses,
      hideDiscussionSections,
      selectSortby,
      isTablet,
    ],
  );

  // Styles for active search bar
  const searchbarStyle = useMemo(() => {
    if (searchText) {
      return {
        backgroundColor: globalTheme.selectHover,
        borderColor: globalTheme.primary,
      };
    }
    return undefined;
  }, [searchText, globalTheme]);

  return (
    <>
      <GlobalHotKeys
        keyMap={hasCourseModal ? {} : keyMap}
        handlers={hasCourseModal ? {} : handlers}
        allowChanges // Required for global
        style={{ outline: 'none' }}
      />
      {/* Search Form */}
      <Form
        className="px-0 h-100"
        onSubmit={(event) => {
          if (event) event.preventDefault();

          if (isMobile) {
            scroller.scrollTo('catalog', {
              smooth: true,
              duration: 500,
              offset: -56,
            });
          }
        }}
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
                style={searchbarStyle}
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
                  select_options={selectSubjects}
                  data_tutorial={2}
                >
                  <PopoutSelect
                    isMulti
                    value={selectSubjects}
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
                  select_options={selectSkillsAreas}
                  className="mr-0"
                >
                  <PopoutSelect
                    useColors
                    isMulti
                    value={selectSkillsAreas}
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
                  key={resetKey}
                  handleStyle={rangeHandleStyle}
                  railStyle={rangeRailStyle}
                  trackStyle={[rangeRailStyle]}
                  defaultValue={overallBounds}
                  onChange={(value: React.SetStateAction<number[]>) => {
                    setOverallValueLabels(value);
                  }}
                  onAfterChange={(value: React.SetStateAction<number[]>) => {
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
                  key={resetKey}
                  handleStyle={rangeHandleStyle}
                  railStyle={rangeRailStyle}
                  trackStyle={[rangeRailStyle]}
                  defaultValue={workloadBounds}
                  onChange={(value: React.SetStateAction<number[]>) => {
                    setWorkloadValueLabels(value);
                  }}
                  onAfterChange={(value: React.SetStateAction<number[]>) => {
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
                select_options={selectSeasons}
              >
                <PopoutSelect
                  isMulti
                  value={selectSeasons}
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
                setSearchDescription(defaultFilters.defaultFalse);
                setHideCancelled(defaultFilters.defaultTrue);
                setHideConflicting(defaultFilters.defaultFalse);
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
                setResetKey(resetKey + 1);
              }}
              select_options={advancedOptions}
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
                        value={selectSubjects}
                        options={subjectOptions}
                        placeholder="All Subjects"
                        // Prevent overlap with tooltips
                        menuPortalTarget={document.querySelector('#portal')}
                        onChange={(
                          selectedOption: ValueType<Option, boolean>,
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
                        value={selectSkillsAreas}
                        options={skillsAreasOptions}
                        placeholder="All Areas/Skills"
                        // Prevent overlap with tooltips
                        menuPortalTarget={document.querySelector('#portal')}
                        onChange={(
                          selectedOption: ValueType<Option, boolean>,
                        ) => {
                          setSelectSkillsAreas(
                            (selectedOption as Option[]) || [],
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
                        value={selectSeasons}
                        options={seasonsOptions}
                        placeholder="Last 5 Years"
                        // Prevent overlap with tooltips
                        menuPortalTarget={document.querySelector('#portal')}
                        onChange={(
                          selectedOption: ValueType<Option, boolean>,
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
                    value={selectDays}
                    options={dayOptions}
                    placeholder="All Days"
                    // Prevent overlap with tooltips
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
                      key={resetKey}
                      handleStyle={rangeHandleStyle}
                      railStyle={rangeRailStyle}
                      trackStyle={[rangeRailStyle]}
                      defaultValue={timeBounds.map(toRangeTime)}
                      onChange={(value: number[]) => {
                        setTimeValueLabels(value.map(toRealTime));
                      }}
                      onAfterChange={(value: number[]) => {
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
                        toLinear(defaultFilters.defaultEnrollBounds[0]),
                      )}
                      max={Math.round(
                        toLinear(defaultFilters.defaultEnrollBounds[1]),
                      )}
                      step={10}
                      marks={{ 0: 1, 290: 18, 510: 160, 630: 528 }}
                      key={resetKey}
                      handleStyle={rangeHandleStyle}
                      railStyle={rangeRailStyle}
                      trackStyle={[rangeRailStyle]}
                      defaultValue={enrollBounds.map(toLinear)}
                      onChange={(value: number[]) => {
                        setEnrollValueLabels(
                          value.map(toExponential).map(Math.round),
                        );
                      }}
                      onAfterChange={(value: number[]) => {
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
                      key={resetKey}
                      handleStyle={rangeHandleStyle}
                      railStyle={rangeRailStyle}
                      trackStyle={[rangeRailStyle]}
                      defaultValue={numBounds}
                      onChange={(value: React.SetStateAction<number[]>) => {
                        setNumValueLabels(value);
                      }}
                      onAfterChange={(
                        value: React.SetStateAction<number[]>,
                      ) => {
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
                    value={selectSchools}
                    options={schoolOptions}
                    placeholder="All Schools"
                    // Prevent overlap with tooltips
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
                    value={selectCredits}
                    options={creditOptions}
                    placeholder="All Credits"
                    // Prevent overlap with tooltips
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
                    key={resetKey}
                  />
                </Row>
                <AdvancedToggleRow className="align-items-center justify-content-between mx-auto mt-3 py-2 px-4">
                  {/* Search By Description Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={searchDescription}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        setSearchDescription(!searchDescription);
                        setStartTime(Date.now());
                      }}
                    >
                      Include descriptions in search
                    </ToggleLabel>
                  </Toggle>
                  {/* Hide Cancelled Courses Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideCancelled}
                      onChange={() => {}} // Dummy handler to remove warning
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
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideConflicting}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        setHideConflicting(!hideConflicting);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide courses with conflicting times
                    </ToggleLabel>
                  </Toggle>
                  {/* Hide First-Year Seminar Courses Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideFirstYearSeminars}
                      onChange={() => {}} // Dummy handler to remove warning
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
                      onChange={() => {}} // Dummy handler to remove warning
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
                      onChange={() => {}} // Dummy handler to remove warning
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
}
