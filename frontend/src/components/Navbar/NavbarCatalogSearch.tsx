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
import { Range } from 'rc-slider';
import { IoClose } from 'react-icons/io5';
import chroma from 'chroma-js';

import { SmallTextComponent, StyledInput } from '../StyledComponents';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';

import {
  skillsAreas,
  skillsAreasColors,
  credits,
  courseInfoAttributes,
  schools,
  subjects,
  sortbyOptions,
  searchSpeed,
} from '../../utilities/constants';
import { weekdays, type Season, type Weekdays } from '../../utilities/common';
import CustomSelect from '../CustomSelect';
import {
  useSearch,
  type Option,
  defaultFilters,
} from '../../contexts/searchContext';
import { breakpoints } from '../../utilities/display';
import ResultsColumnSort from '../Search/ResultsColumnSort';
import {
  toRangeTime,
  toRealTime,
  to12HourTime,
  toLinear,
  toExponential,
} from '../../utilities/course';

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
const AdvancedSelect = styled(CustomSelect<Option<string | number>, true>)`
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
 * Identity function that casts a readonly array to a writable array
 */
const asWritable = <T,>(value: readonly T[]) => value as T[];

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
    filters,
    duration,
    resetKey,
    searchData,
    seasonsOptions,
    coursesLoading,
    handleResetFilters,
    setResetKey,
    setStartTime,
  } = useSearch();

  const {
    searchText,
    selectSubjects,
    selectSkillsAreas,
    overallBounds,
    workloadBounds,
    selectSeasons,
    selectDays,
    timeBounds,
    enrollBounds,
    numBounds,
    selectSchools,
    selectCredits,
    selectCourseInfoAttributes,
    searchDescription,
    hideCancelled,
    hideConflicting,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    selectSortby,
  } = filters;

  // Active state for range filters
  const [activeOverall, setActiveOverall] = useState(false);
  const [activeWorkload, setActiveWorkload] = useState(false);
  const [activeTime, setActiveTime] = useState(false);
  const [activeEnrollment, setActiveEnrollment] = useState(false);
  const [activeNumber, setActiveNumber] = useState(false);

  // These are exactly the same as the filters, except they update responsively
  // without triggering searching
  const [overallValueLabels, setOverallValueLabels] = useState(
    overallBounds.value,
  );
  const [workloadValueLabels, setWorkloadValueLabels] = useState(
    workloadBounds.value,
  );
  const [timeValueLabels, setTimeValueLabels] = useState(timeBounds.value);
  const [enrollValueLabels, setEnrollValueLabels] = useState(
    enrollBounds.value,
  );
  const [numValueLabels, setNumValueLabels] = useState(numBounds.value);

  const globalTheme = useTheme();

  // Handle active state for range filters
  useEffect(() => {
    setActiveOverall(canReset && overallBounds.hasChanged);
    setActiveWorkload(canReset && workloadBounds.hasChanged);
    setActiveTime(canReset && timeBounds.hasChanged);
    setActiveEnrollment(canReset && enrollBounds.hasChanged);
    setActiveNumber(canReset && numBounds.hasChanged);
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

  // Ctrl/cmd-s search hotkey
  const keyMap = {
    FOCUS_SEARCH: ['ctrl+s', 'command+s'],
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
    (): {
      [key: string]: { [key: string]: Option<string | number>[] | boolean };
    } => ({
      selects: {
        selectDays: selectDays.value,
        selectSchools: selectSchools.value,
        selectCredits: selectCredits.value,
        selectCourseInfoAttributes: selectCourseInfoAttributes.value,
        selectSubjects: isTablet && selectSubjects.value,
        selectSeasons: isTablet && selectSeasons.value,
        selectSkillsAreas: isTablet && selectSkillsAreas.value,
      },
      ranges: {
        activeTime,
        activeEnrollment,
        activeNumber,
      },
      toggles: {
        searchDescription: searchDescription.value,
        hideCancelled: hideCancelled.value,
        hideConflicting: hideConflicting.value,
        hideFirstYearSeminars: hideFirstYearSeminars.value,
        hideGraduateCourses: hideGraduateCourses.value,
        hideDiscussionSections: hideDiscussionSections.value,
      },
      sorts: {
        average_gut_rating: selectSortby.value.value === sortbyOptions[7].value,
      },
    }),
    [
      selectDays,
      selectSchools,
      selectCredits,
      selectCourseInfoAttributes,
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
    if (searchText.value) {
      return {
        backgroundColor: globalTheme.selectHover,
        borderColor: globalTheme.primary,
      };
    }
    return undefined;
  }, [searchText, globalTheme]);

  // Prevent overlap with tooltips
  const menuPortalTarget = document.querySelector<HTMLElement>('#portal');

  const speed = useMemo(() => {
    const pool =
      searchSpeed[
        duration > 1 ? 'fast' : duration > 0.5 ? 'faster' : 'fastest'
      ];
    return pool[Math.floor(Math.random() * pool.length)];
  }, [duration]);

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
          event.preventDefault();

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
                value={searchText.value}
                style={searchbarStyle}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  searchText.set(event.target.value);
                  setStartTime(Date.now());
                }}
                placeholder="Search by course code, title, prof, or whatever we don't really care"
                ref={searchTextInput}
              />
            </InputGroup>
            {searchText.value && (
              <CloseIcon
                size={18}
                onClick={() => {
                  searchText.reset();
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
                    selectSubjects.reset();
                    setStartTime(Date.now());
                  }}
                  selectOptions={selectSubjects.value}
                  dataTutorial={2}
                >
                  <PopoutSelect<Option, true>
                    isMulti
                    value={selectSubjects.value}
                    options={Object.entries(subjects).map(([code, name]) => ({
                      label: `${code} - ${name}`,
                      value: code,
                    }))}
                    placeholder="All Subjects"
                    onChange={(selectedOption) => {
                      selectSubjects.set(asWritable(selectedOption));
                      setStartTime(Date.now());
                    }}
                  />
                </Popout>
                {/* Areas/Skills Filter Dropdown */}
                <Popout
                  buttonText="Areas/Skills"
                  type="skills/areas"
                  onReset={() => {
                    selectSkillsAreas.reset();
                    setStartTime(Date.now());
                  }}
                  selectOptions={selectSkillsAreas.value}
                  className="mr-0"
                >
                  <PopoutSelect<Option, true>
                    useColors
                    isMulti
                    value={selectSkillsAreas.value}
                    options={['Areas', 'Skills'].map((type) => ({
                      label: type,
                      options: Object.entries(
                        skillsAreas[type.toLowerCase() as 'areas' | 'skills'],
                      ).map(([code, name]) => ({
                        label: `${code} - ${name}`,
                        value: code,
                        color: skillsAreasColors[code],
                      })),
                    }))}
                    placeholder="All Areas/Skills"
                    onChange={(selectedOption) => {
                      selectSkillsAreas.set(asWritable(selectedOption));
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
                  min={defaultFilters.overallBounds[0]}
                  max={defaultFilters.overallBounds[1]}
                  step={0.1}
                  isTablet={isTablet}
                  key={resetKey}
                  handleStyle={rangeHandleStyle}
                  railStyle={rangeRailStyle}
                  trackStyle={[rangeRailStyle]}
                  defaultValue={overallBounds.value}
                  onChange={(value) => {
                    setOverallValueLabels(value as [number, number]);
                  }}
                  onAfterChange={(value) => {
                    overallBounds.set(value as [number, number]);
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
                  min={defaultFilters.workloadBounds[0]}
                  max={defaultFilters.workloadBounds[1]}
                  step={0.1}
                  isTablet={isTablet}
                  key={resetKey}
                  handleStyle={rangeHandleStyle}
                  railStyle={rangeRailStyle}
                  trackStyle={[rangeRailStyle]}
                  defaultValue={workloadBounds.value}
                  onChange={(value) => {
                    setWorkloadValueLabels(value as [number, number]);
                  }}
                  onAfterChange={(value) => {
                    workloadBounds.set(value as [number, number]);
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
                  selectSeasons.reset();
                  setStartTime(Date.now());
                }}
                selectOptions={selectSeasons.value}
              >
                <PopoutSelect<Option, true>
                  isMulti
                  value={selectSeasons.value}
                  options={seasonsOptions}
                  placeholder="Last 5 Years"
                  hideSelectedOptions={false}
                  onChange={(selectedOption) => {
                    selectSeasons.set(selectedOption as Option<Season>[]);
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
                  (
                    [
                      'selectSubjects',
                      'selectSeasons',
                      'selectSkillsAreas',
                    ] as const
                  ).forEach((k) => filters[k].reset());
                }
                (
                  [
                    'selectDays',
                    'selectSchools',
                    'selectCredits',
                    'selectCourseInfoAttributes',
                    'searchDescription',
                    'hideCancelled',
                    'hideConflicting',
                    'hideFirstYearSeminars',
                    'hideGraduateCourses',
                    'hideDiscussionSections',
                    'timeBounds',
                    'enrollBounds',
                    'numBounds',
                  ] as const
                ).forEach((k) => filters[k].reset());
                setTimeValueLabels(defaultFilters.timeBounds);
                setEnrollValueLabels(defaultFilters.enrollBounds);
                setNumValueLabels(defaultFilters.numBounds);
                setStartTime(Date.now());
                setResetKey(resetKey + 1);
              }}
              selectOptions={advancedOptions}
              dataTutorial={4}
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
                        value={selectSubjects.value}
                        options={Object.entries(subjects).map(
                          ([code, name]) => ({
                            label: `${code} - ${name}`,
                            value: code,
                          }),
                        )}
                        placeholder="All Subjects"
                        menuPortalTarget={menuPortalTarget}
                        onChange={(selectedOption) => {
                          selectSubjects.set(selectedOption as Option[]);
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
                        value={selectSkillsAreas.value}
                        options={['Areas', 'Skills'].map((type) => ({
                          label: type,
                          options: Object.entries(
                            skillsAreas[
                              type.toLowerCase() as 'areas' | 'skills'
                            ],
                          ).map(([code, name]) => ({
                            label: `${code} - ${name}`,
                            value: code,
                            color: skillsAreasColors[code],
                          })),
                        }))}
                        placeholder="All Areas/Skills"
                        menuPortalTarget={menuPortalTarget}
                        onChange={(selectedOption) => {
                          selectSkillsAreas.set(selectedOption as Option[]);
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
                        value={selectSeasons.value}
                        options={seasonsOptions}
                        placeholder="Last 5 Years"
                        menuPortalTarget={menuPortalTarget}
                        onChange={(selectedOption) => {
                          selectSeasons.set(selectedOption as Option<Season>[]);
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
                    value={selectDays.value}
                    options={weekdays.slice(0, 5).map((day) => ({
                      label: day,
                      value: day,
                    }))}
                    placeholder="All Days"
                    menuPortalTarget={menuPortalTarget}
                    onChange={(selectedOption) => {
                      selectDays.set(selectedOption as Option<Weekdays>[]);
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
                      min={toRangeTime(defaultFilters.timeBounds[0])}
                      max={toRangeTime(defaultFilters.timeBounds[1])}
                      step={1}
                      marks={{
                        84: '7am',
                        120: '10am',
                        156: '1pm',
                        192: '4pm',
                        228: '7pm',
                        264: '10pm',
                      }}
                      key={resetKey}
                      handleStyle={rangeHandleStyle}
                      railStyle={rangeRailStyle}
                      trackStyle={[rangeRailStyle]}
                      defaultValue={timeBounds.value.map(toRangeTime)}
                      onChange={(value) => {
                        setTimeValueLabels(
                          value.map(toRealTime) as [string, string],
                        );
                      }}
                      onAfterChange={(value) => {
                        timeBounds.set(
                          value.map(toRealTime) as [string, string],
                        );
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
                      min={Math.round(toLinear(defaultFilters.enrollBounds[0]))}
                      max={Math.round(toLinear(defaultFilters.enrollBounds[1]))}
                      step={10}
                      marks={{ 0: 1, 290: 18, 510: 160, 630: 528 }}
                      key={resetKey}
                      handleStyle={rangeHandleStyle}
                      railStyle={rangeRailStyle}
                      trackStyle={[rangeRailStyle]}
                      defaultValue={enrollBounds.value.map(toLinear)}
                      onChange={(value) => {
                        setEnrollValueLabels(
                          value.map(toExponential).map(Math.round) as [
                            number,
                            number,
                          ],
                        );
                      }}
                      onAfterChange={(value) => {
                        enrollBounds.set(
                          value.map(toExponential).map(Math.round) as [
                            number,
                            number,
                          ],
                        );
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
                      min={defaultFilters.numBounds[0]}
                      max={defaultFilters.numBounds[1]}
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
                      defaultValue={numBounds.value}
                      onChange={(value) => {
                        setNumValueLabels(value as [number, number]);
                      }}
                      onAfterChange={(value) => {
                        numBounds.set(value as [number, number]);
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
                    value={selectSchools.value}
                    options={Object.entries(schools).map(([code, name]) => ({
                      label: name,
                      value: code,
                    }))}
                    placeholder="All Schools"
                    menuPortalTarget={menuPortalTarget}
                    onChange={(selectedOption) => {
                      selectSchools.set(selectedOption as Option[]);
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
                    value={selectCredits.value}
                    options={credits.map((credit) => ({
                      label: String(credit),
                      value: credit,
                    }))}
                    placeholder="All Credits"
                    menuPortalTarget={menuPortalTarget}
                    onChange={(selectedOption) => {
                      // If you want to get rid of these `as` casts:
                      // Don't think about these generics too much. It poisons
                      // your brain.
                      selectCredits.set(selectedOption as Option<number>[]);
                      setStartTime(Date.now());
                    }}
                  />
                </Row>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  {/* Course Information Attributes Multi-Select */}
                  <AdvancedLabel>Info:</AdvancedLabel>
                  <AdvancedSelect
                    closeMenuOnSelect
                    isMulti
                    value={selectCourseInfoAttributes.value}
                    options={courseInfoAttributes.map((attr) => ({
                      label: attr,
                      value: attr,
                    }))}
                    placeholder="Course Information Attributes"
                    // Prevent overlap with tooltips
                    menuPortalTarget={menuPortalTarget}
                    onChange={(selectedOption) => {
                      selectCourseInfoAttributes.set(
                        selectedOption as Option[],
                      );
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
                      checked={searchDescription.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        searchDescription.set((x) => !x);
                        setStartTime(Date.now());
                      }}
                    >
                      Include descriptions in search
                    </ToggleLabel>
                  </Toggle>
                  {/* Hide Cancelled Courses Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideCancelled.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        hideCancelled.set((x) => !x);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide cancelled courses
                    </ToggleLabel>
                  </Toggle>
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideConflicting.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        hideConflicting.set((x) => !x);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide courses with conflicting times
                    </ToggleLabel>
                  </Toggle>
                  {/* Hide First-Year Seminar Courses Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideFirstYearSeminars.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        hideFirstYearSeminars.set((x) => !x);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide first-year seminars
                    </ToggleLabel>
                  </Toggle>
                  {/* Hide Graduate-Level Courses Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideGraduateCourses.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        hideGraduateCourses.set((x) => !x);
                        setStartTime(Date.now());
                      }}
                    >
                      Hide graduate courses
                    </ToggleLabel>
                  </Toggle>
                  {/* Hide Discussion Sections Toggle */}
                  <Toggle type="switch">
                    <ToggleInput
                      checked={hideDiscussionSections.value}
                      onChange={() => {}} // Dummy handler to remove warning
                    />
                    <ToggleLabel
                      onClick={() => {
                        hideDiscussionSections.set((x) => !x);
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
