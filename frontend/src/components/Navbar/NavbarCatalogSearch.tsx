import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Col, Form, InputGroup, Row, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { GlobalHotKeys } from 'react-hotkeys';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import clsx from 'clsx';
import { Range } from 'rc-slider';
import { IoClose } from 'react-icons/io5';
import chroma from 'chroma-js';

import { SmallTextComponent, StyledInput } from '../StyledComponents';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import Toggle from '../Search/Toggle';

import { credits, searchSpeed } from '../../utilities/constants';
import { weekdays, type Season, type Weekdays } from '../../utilities/common';
import CustomSelect from '../Search/CustomSelect';
import {
  useSearch,
  type Option,
  defaultFilters,
  sortByOptions,
  skillsAreasOptions,
  subjectsOptions,
  schoolsOptions,
  seasonsOptions,
} from '../../contexts/searchContext';
import ResultsColumnSort from '../Search/ResultsColumnSort';
import {
  toRealTime,
  to12HourTime,
  toLinear,
  toExponential,
} from '../../utilities/course';
import styles from './NavbarCatalogSearch.module.css';

// Clear search bar button
const CloseIcon = styled(IoClose)`
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
  const { filters, duration, searchData, coursesLoading, setStartTime } =
    useSearch();

  const {
    searchText,
    selectSubjects,
    selectSkillsAreas,
    overallBounds,
    workloadBounds,
    professorBounds,
    selectSeasons,
    selectDays,
    timeBounds,
    enrollBounds,
    numBounds,
    selectSchools,
    selectCredits,
    searchDescription,
    hideCancelled,
    hideConflicting,
    hideFirstYearSeminars,
    hideGraduateCourses,
    hideDiscussionSections,
    selectSortBy,
    sortOrder,
  } = filters;

  // These are exactly the same as the filters, except they update responsively
  // without triggering searching
  const [overallRangeValue, setOverallRangeValue] = useState(
    overallBounds.value,
  );
  const [workloadRangeValue, setWorkloadRangeValue] = useState(
    workloadBounds.value,
  );
  const [professorRangeValue, setProfessorRangeValue] = useState(
    professorBounds.value,
  );
  const [timeRangeValue, setTimeRangeValue] = useState(timeBounds.value);
  const [enrollRangeValue, setEnrollRangeValue] = useState(
    enrollBounds.value.map(toLinear).map(Math.round) as [number, number],
  );
  const [numRangeValue, setNumRangeValue] = useState(numBounds.value);

  // Active styles for range filters
  const activeStyle = useCallback((active: boolean) => {
    if (active) return { color: 'var(--color-primary-hover)' };
    return undefined;
  }, []);

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

  // Styles for active search bar
  const searchbarStyle = useMemo(() => {
    if (searchText.value) {
      return {
        backgroundColor: 'var(--color-select-hover)',
        borderColor: 'var(--color-primary)',
      };
    }
    return undefined;
  }, [searchText]);

  // Prevent overlap with tooltips
  const menuPortalTarget = document.querySelector<HTMLElement>('#portal');

  const speed = useMemo(() => {
    const pool =
      searchSpeed[
        duration > 1 ? 'fast' : duration > 0.5 ? 'faster' : 'fastest'
      ];
    return pool[Math.floor(Math.random() * pool.length)]!;
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
        <Row className={styles.row}>
          <div className={styles.searchWrapper}>
            {/* Search Bar */}
            <InputGroup className="h-100">
              <StyledInput
                className={styles.searchBar}
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
                className={styles.searchTextClear}
                size={18}
                onClick={() => {
                  searchText.reset();
                  setStartTime(Date.now());
                }}
              />
            )}
          </div>
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
        </Row>
        {/* Bottom row */}
        <Row className={clsx(styles.row, 'align-items-center')}>
          <div className="d-flex align-items-center">
            {!isTablet && (
              <>
                {/* Yale Subjects Filter Dropdown */}
                <Popout
                  buttonText="Subject"
                  onReset={() => {
                    selectSubjects.reset();
                    setStartTime(Date.now());
                  }}
                  selectedOptions={selectSubjects.value}
                  dataTutorial={2}
                >
                  <PopoutSelect<Option, true>
                    isMulti
                    value={selectSubjects.value}
                    options={subjectsOptions}
                    placeholder="All Subjects"
                    onChange={(selectedOption) => {
                      selectSubjects.set(selectedOption as Option[]);
                      setStartTime(Date.now());
                    }}
                  />
                </Popout>
                {/* Areas/Skills Filter Dropdown */}
                <Popout
                  buttonText="Areas/Skills"
                  onReset={() => {
                    selectSkillsAreas.reset();
                    setStartTime(Date.now());
                  }}
                  selectedOptions={selectSkillsAreas.value}
                  className="mr-0"
                >
                  <PopoutSelect<Option, true>
                    useColors
                    isMulti
                    value={selectSkillsAreas.value}
                    options={skillsAreasOptions}
                    placeholder="All Areas/Skills"
                    onChange={(selectedOption) => {
                      selectSkillsAreas.set(selectedOption as Option[]);
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
                  <div className={styles.rangeValueLabel}>
                    {overallRangeValue[0]}
                  </div>
                  <div
                    className={styles.rangeLabel}
                    style={activeStyle(overallBounds.hasChanged)}
                  >
                    Overall
                  </div>
                  <div className={styles.rangeValueLabel}>
                    {overallRangeValue[1]}
                  </div>
                </div>
                <Range
                  className={clsx(styles.range, styles.mainRange)}
                  min={defaultFilters.overallBounds[0]}
                  max={defaultFilters.overallBounds[1]}
                  step={0.1}
                  handleStyle={rangeHandleStyle}
                  railStyle={rangeRailStyle}
                  trackStyle={[rangeRailStyle]}
                  value={overallRangeValue}
                  onChange={(value) => {
                    setOverallRangeValue(value as [number, number]);
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
                  <div className={styles.rangeValueLabel}>
                    {workloadRangeValue[0]}
                  </div>
                  <div
                    className={styles.rangeLabel}
                    style={activeStyle(workloadBounds.hasChanged)}
                  >
                    Workload
                  </div>
                  <div className={styles.rangeValueLabel}>
                    {workloadRangeValue[1]}
                  </div>
                </div>
                <Range
                  className={clsx(styles.range, styles.mainRange)}
                  min={defaultFilters.workloadBounds[0]}
                  max={defaultFilters.workloadBounds[1]}
                  step={0.1}
                  handleStyle={rangeHandleStyle}
                  railStyle={rangeRailStyle}
                  trackStyle={[rangeRailStyle]}
                  value={workloadRangeValue}
                  onChange={(value) => {
                    setWorkloadRangeValue(value as [number, number]);
                  }}
                  onAfterChange={(value) => {
                    workloadBounds.set(value as [number, number]);
                    setStartTime(Date.now());
                  }}
                />
              </Col>

              {!isTablet && (
                <Col className="w-auto flex-grow-0 d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center justify-content-center mt-n1 w-100">
                    <div className={styles.rangeValueLabel}>
                      {professorRangeValue[0]}
                    </div>
                    <div
                      className={styles.rangeLabel}
                      style={activeStyle(professorBounds.hasChanged)}
                    >
                      Professor
                    </div>
                    <div className={styles.rangeValueLabel}>
                      {professorRangeValue[1]}
                    </div>
                  </div>
                  <Range
                    className={clsx(styles.range, styles.mainRange)}
                    min={defaultFilters.professorBounds[0]}
                    max={defaultFilters.professorBounds[1]}
                    step={0.1}
                    handleStyle={rangeHandleStyle}
                    railStyle={rangeRailStyle}
                    trackStyle={[rangeRailStyle]}
                    value={professorRangeValue}
                    onChange={(value) => {
                      setProfessorRangeValue(value as [number, number]);
                    }}
                    onAfterChange={(value) => {
                      professorBounds.set(value as [number, number]);
                      setStartTime(Date.now());
                    }}
                  />
                </Col>
              )}
            </div>
            {/* Season Filter Dropdown */}
            {!isTablet && (
              <Popout
                buttonText="Season"
                displayOptionLabel
                maxDisplayOptions={1}
                onReset={() => {
                  selectSeasons.reset();
                  setStartTime(Date.now());
                }}
                selectedOptions={selectSeasons.value}
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
              onReset={() => {
                if (isTablet) {
                  (
                    [
                      'selectSubjects',
                      'selectSkillsAreas',
                      'selectSeasons',
                      'professorBounds',
                    ] as const
                  ).forEach((k) => filters[k].reset());
                }
                (
                  [
                    'selectDays',
                    'timeBounds',
                    'enrollBounds',
                    'numBounds',
                    'selectSchools',
                    'selectCredits',
                    'searchDescription',
                    'hideCancelled',
                    'hideConflicting',
                    'hideFirstYearSeminars',
                    'hideGraduateCourses',
                    'hideDiscussionSections',
                  ] as const
                ).forEach((k) => filters[k].reset());
                if (selectSortBy.value.value === 'average_gut_rating') {
                  selectSortBy.reset();
                  sortOrder.reset();
                }
                setTimeRangeValue(defaultFilters.timeBounds);
                setEnrollRangeValue(
                  defaultFilters.enrollBounds.map(toLinear).map(Math.round) as [
                    number,
                    number,
                  ],
                );
                setNumRangeValue(defaultFilters.numBounds);
                if (isTablet)
                  setProfessorRangeValue(defaultFilters.professorBounds);
                setStartTime(Date.now());
              }}
              selectedOptions={
                [
                  isTablet && selectSubjects.hasChanged,
                  isTablet && selectSkillsAreas.hasChanged,
                  isTablet && selectSeasons.hasChanged,
                  selectDays.hasChanged,
                  timeBounds.hasChanged,
                  enrollBounds.hasChanged,
                  isTablet && professorBounds.hasChanged,
                  numBounds.hasChanged,
                  selectSchools.hasChanged,
                  selectCredits.hasChanged,
                  selectSortBy.value.value === 'average_gut_rating',
                  searchDescription.value,
                  hideCancelled.value,
                  hideConflicting.value,
                  hideFirstYearSeminars.value,
                  hideGraduateCourses.value,
                  hideDiscussionSections.value,
                ].filter(Boolean).length
              }
              dataTutorial={4}
            >
              <div className={styles.advancedWrapper}>
                {isTablet && (
                  <>
                    <Row className="align-items-center justify-content-between mx-3 mt-3">
                      {/* Yale Subjects Filter Dropdown */}
                      <div className={styles.advancedLabel}>Subject:</div>
                      <CustomSelect
                        className={styles.advancedSelect}
                        closeMenuOnSelect
                        isMulti
                        value={selectSubjects.value}
                        options={subjectsOptions}
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
                      <div className={styles.advancedLabel}>Areas/Skills:</div>
                      <CustomSelect
                        className={styles.advancedSelect}
                        useColors
                        closeMenuOnSelect
                        isMulti
                        value={selectSkillsAreas.value}
                        options={skillsAreasOptions}
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
                      <div className={styles.advancedLabel}>Season:</div>
                      <CustomSelect
                        className={styles.advancedSelect}
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
                  <div className={styles.advancedLabel}>Day:</div>
                  <CustomSelect<Option<Weekdays>, true>
                    className={styles.advancedSelect}
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
                  <div
                    className={styles.advancedLabel}
                    style={activeStyle(timeBounds.hasChanged)}
                  >
                    Time:
                  </div>
                  <div className={styles.advancedRangeGroup}>
                    {/* Time Range */}
                    <div className="d-flex align-items-center justify-content-between mb-1 w-100">
                      <div className={styles.rangeValueLabel}>
                        {to12HourTime(toRealTime(timeRangeValue[0]))}
                      </div>
                      <div className={styles.rangeValueLabel}>
                        {to12HourTime(toRealTime(timeRangeValue[1]))}
                      </div>
                    </div>
                    <Range
                      className={clsx(styles.range, styles.advancedRange)}
                      min={defaultFilters.timeBounds[0]}
                      max={defaultFilters.timeBounds[1]}
                      step={1}
                      marks={{
                        84: '7am',
                        120: '10am',
                        156: '1pm',
                        192: '4pm',
                        228: '7pm',
                        264: '10pm',
                      }}
                      handleStyle={rangeHandleStyle}
                      railStyle={rangeRailStyle}
                      trackStyle={[rangeRailStyle]}
                      value={timeRangeValue}
                      onChange={(value) => {
                        setTimeRangeValue(value as [number, number]);
                      }}
                      onAfterChange={(value) => {
                        timeBounds.set(value as [number, number]);
                        setStartTime(Date.now());
                      }}
                    />
                  </div>
                </Row>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  <div
                    className={styles.advancedLabel}
                    style={activeStyle(enrollBounds.hasChanged)}
                  >
                    # Enrolled:
                  </div>
                  <div className={styles.advancedRangeGroup}>
                    {/* Enrollment Range */}
                    <div className="d-flex align-items-center justify-content-between mb-1 w-100">
                      <div className={styles.rangeValueLabel}>
                        {Math.round(toExponential(enrollRangeValue[0]))}
                      </div>
                      <div className={styles.rangeValueLabel}>
                        {Math.round(toExponential(enrollRangeValue[1]))}
                      </div>
                    </div>
                    <Range
                      className={clsx(styles.range, styles.advancedRange)}
                      min={Math.round(toLinear(defaultFilters.enrollBounds[0]))}
                      max={Math.round(toLinear(defaultFilters.enrollBounds[1]))}
                      step={10}
                      marks={{ 0: 1, 290: 18, 510: 160, 630: 528 }}
                      handleStyle={rangeHandleStyle}
                      railStyle={rangeRailStyle}
                      trackStyle={[rangeRailStyle]}
                      value={enrollRangeValue}
                      onChange={(value) => {
                        setEnrollRangeValue(value as [number, number]);
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
                  </div>
                </Row>
                {isTablet && (
                  <Row className="align-items-center justify-content-between mx-3 mt-3">
                    <div
                      className={styles.advancedLabel}
                      style={activeStyle(professorBounds.hasChanged)}
                    >
                      Professor:
                    </div>
                    <div className={styles.advancedRangeGroup}>
                      {/* Professor Rating Range */}
                      <div className="d-flex align-items-center justify-content-between mb-1 w-100">
                        <div className={styles.rangeValueLabel}>
                          {professorRangeValue[0]}
                        </div>
                        <div className={styles.rangeValueLabel}>
                          {professorRangeValue[1]}
                        </div>
                      </div>
                      <Range
                        className={clsx(styles.range, styles.advancedRange)}
                        min={defaultFilters.professorBounds[0]}
                        max={defaultFilters.professorBounds[1]}
                        step={0.1}
                        handleStyle={rangeHandleStyle}
                        railStyle={rangeRailStyle}
                        trackStyle={[rangeRailStyle]}
                        value={professorRangeValue}
                        onChange={(value) => {
                          setProfessorRangeValue(value as [number, number]);
                        }}
                        onAfterChange={(value) => {
                          professorBounds.set(value as [number, number]);
                          setStartTime(Date.now());
                        }}
                      />
                    </div>
                  </Row>
                )}
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  <div
                    className={styles.advancedLabel}
                    style={activeStyle(numBounds.hasChanged)}
                  >
                    Course #:
                  </div>
                  <div className={styles.advancedRangeGroup}>
                    {/* Course Number Range */}
                    <div className="d-flex align-items-center justify-content-between mb-1 w-100">
                      <div className={styles.rangeValueLabel}>
                        {numRangeValue[0].toString().padStart(3, '0')}
                      </div>
                      <div className={styles.rangeValueLabel}>
                        {numRangeValue[1] === 1000
                          ? '1000+'
                          : numRangeValue[1].toString().padStart(3, '0')}
                      </div>
                    </div>
                    <Range
                      className={clsx(styles.range, styles.advancedRange)}
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
                      handleStyle={rangeHandleStyle}
                      railStyle={rangeRailStyle}
                      trackStyle={[rangeRailStyle]}
                      value={numRangeValue}
                      onChange={(value) => {
                        setNumRangeValue(value as [number, number]);
                      }}
                      onAfterChange={(value) => {
                        numBounds.set(value as [number, number]);
                        setStartTime(Date.now());
                      }}
                    />
                  </div>
                </Row>
                <Row className="align-items-center justify-content-between mx-3 mt-3">
                  {/* Yale Schools Multi-Select */}
                  <div className={styles.advancedLabel}>School:</div>
                  <CustomSelect
                    className={styles.advancedSelect}
                    closeMenuOnSelect
                    isMulti
                    value={selectSchools.value}
                    options={schoolsOptions}
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
                  <div className={styles.advancedLabel}>Credit:</div>
                  <CustomSelect
                    className={styles.advancedSelect}
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
                  {/* Sort by Guts */}
                  <div className={styles.advancedLabel}>
                    {sortByOptions.average_gut_rating.label}:
                  </div>
                  <ResultsColumnSort
                    selectOption={sortByOptions.average_gut_rating}
                  />
                </Row>
                <Row
                  className={clsx(
                    styles.advancedToggleRow,
                    'align-items-center justify-content-between mx-auto mt-3 py-2 px-4',
                  )}
                >
                  <Toggle handle="searchDescription" />
                  <Toggle handle="hideCancelled" />
                  <Toggle handle="hideConflicting" />
                  <Toggle handle="hideFirstYearSeminars" />
                  <Toggle handle="hideGraduateCourses" />
                  <Toggle handle="hideDiscussionSections" />
                </Row>
              </div>
            </Popout>
          </div>

          {/* Reset Filters & Sorting Button */}
          <Button
            className={styles.resetButton}
            variant="danger"
            onClick={() => {
              setOverallRangeValue(defaultFilters.overallBounds);
              setWorkloadRangeValue(defaultFilters.workloadBounds);
              setTimeRangeValue(defaultFilters.timeBounds);
              setEnrollRangeValue(
                defaultFilters.enrollBounds.map(toLinear).map(Math.round) as [
                  number,
                  number,
                ],
              );
              setNumRangeValue(defaultFilters.numBounds);
              setProfessorRangeValue(defaultFilters.professorBounds);
              Object.values(filters).forEach((filter) => filter.reset());
              setStartTime(Date.now());
            }}
            // Cannot reset if no filters have changed
            disabled={Object.values(filters).every((x) => !x.hasChanged)}
          >
            Reset
          </Button>
        </Row>
      </Form>
    </>
  );
}
