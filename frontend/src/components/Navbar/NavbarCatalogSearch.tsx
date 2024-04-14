import React, { useCallback, useMemo, useRef, useState, useId } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { GlobalHotKeys } from 'react-hotkeys';
import clsx from 'clsx';
import { Range } from 'rc-slider';
import { IoClose } from 'react-icons/io5';

import { TextComponent, Input } from '../Typography';
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
  courseInfoAttributesOptions,
} from '../../contexts/searchContext';
import ResultsColumnSort from '../Search/ResultsColumnSort';
import {
  toRealTime,
  to12HourTime,
  toLinear,
  toExponential,
} from '../../utilities/course';
import styles from './NavbarCatalogSearch.module.css';

export function NavbarCatalogSearch() {
  const { isTablet, isLgDesktop } = useWindowDimensions();
  const [searchParams] = useSearchParams();
  const hasCourseModal = searchParams.has('course-modal');
  const formLabelId = useId();

  const searchTextInput = useRef<HTMLInputElement>(null);

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
    selectCourseInfoAttributes,
    searchDescription,
    enableQuist,
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

  const activeStyle = useCallback((active: boolean) => {
    if (active) return { color: 'var(--color-primary)' };
    return undefined;
  }, []);

  const rangeHandleStyle = useMemo(() => {
    if (isLgDesktop) return undefined;
    const style: React.CSSProperties = { height: '12px', width: '12px' };
    return [style, style];
  }, [isLgDesktop]);
  const rangeRailStyle = useMemo((): React.CSSProperties => {
    if (isLgDesktop) return {};
    return { marginTop: '-1px' };
  }, [isLgDesktop]);

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
        }}
        data-tutorial="catalog-1"
      >
        <div className={styles.row}>
          <div className={styles.searchWrapper}>
            {/* Search Bar */}
            <Input
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
            {searchText.value && (
              <IoClose
                className={styles.searchTextClear}
                size={18}
                onClick={() => {
                  searchText.resetToEmpty();
                  setStartTime(Date.now());
                }}
              />
            )}
          </div>
          {/* Number of results shown & seach speed text */}
          <TextComponent
            type="tertiary"
            small
            className="ml-2 mb-1 d-flex align-items-end"
            style={{ whiteSpace: 'pre-line' }}
          >
            {coursesLoading
              ? 'Searching ...'
              : `Showing ${searchData.length} results${
                  !isTablet ? `${speed.length > 20 ? '\n' : ' '}(${speed})` : ''
                }`}
          </TextComponent>
        </div>
        <div className={styles.row}>
          {!isTablet && (
            <>
              {/* Yale Subjects Filter Dropdown */}
              <Popout
                buttonText="Subject"
                onReset={() => {
                  selectSubjects.resetToEmpty();
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
                  selectSkillsAreas.resetToEmpty();
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
            <div className={styles.sliderContainer}>
              {/* Overall Rating Range */}
              <div className={styles.sliderLabels}>
                <div className={styles.rangeValueLabel}>
                  {overallRangeValue[0]}
                </div>
                <div
                  className={styles.rangeLabel}
                  style={activeStyle(overallBounds.isNonEmpty)}
                >
                  Overall
                </div>
                <div className={styles.rangeValueLabel}>
                  {overallRangeValue[1]}
                </div>
              </div>
              <Range
                ariaLabelGroupForHandles={[
                  'Overall rating lower bound',
                  'Overall rating upper bound',
                ]}
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
            </div>
            <div className={styles.sliderContainer}>
              {/* Workload Rating Range */}
              <div className={styles.sliderLabels}>
                <div className={styles.rangeValueLabel}>
                  {workloadRangeValue[0]}
                </div>
                <div
                  className={styles.rangeLabel}
                  style={activeStyle(workloadBounds.isNonEmpty)}
                >
                  Workload
                </div>
                <div className={styles.rangeValueLabel}>
                  {workloadRangeValue[1]}
                </div>
              </div>
              <Range
                ariaLabelGroupForHandles={[
                  'Workload rating lower bound',
                  'Workload rating upper bound',
                ]}
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
            </div>

            {!isTablet && (
              <div className={styles.sliderContainer}>
                <div className={styles.sliderLabels}>
                  <div className={styles.rangeValueLabel}>
                    {professorRangeValue[0]}
                  </div>
                  <div
                    className={styles.rangeLabel}
                    style={activeStyle(professorBounds.isNonEmpty)}
                  >
                    Professor
                  </div>
                  <div className={styles.rangeValueLabel}>
                    {professorRangeValue[1]}
                  </div>
                </div>
                <Range
                  ariaLabelGroupForHandles={[
                    'Professor rating lower bound',
                    'Professor rating upper bound',
                  ]}
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
              </div>
            )}
          </div>
          {/* Season Filter Dropdown */}
          {!isTablet && (
            <Popout
              buttonText="Season"
              displayOptionLabel
              maxDisplayOptions={1}
              onReset={() => {
                selectSeasons.resetToEmpty();
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
                ).forEach((k) => filters[k].resetToEmpty());
              }
              (
                [
                  'selectDays',
                  'timeBounds',
                  'enrollBounds',
                  'numBounds',
                  'selectSchools',
                  'selectCredits',
                  'selectCourseInfoAttributes',
                  'searchDescription',
                  'enableQuist',
                  'hideCancelled',
                  'hideConflicting',
                  'hideFirstYearSeminars',
                  'hideGraduateCourses',
                  'hideDiscussionSections',
                ] as const
              ).forEach((k) => filters[k].resetToEmpty());
              if (selectSortBy.value.value === 'average_gut_rating') {
                selectSortBy.resetToEmpty();
                sortOrder.resetToEmpty();
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
                isTablet && selectSubjects.isNonEmpty,
                isTablet && selectSkillsAreas.isNonEmpty,
                isTablet && selectSeasons.isNonEmpty,
                selectDays.isNonEmpty,
                timeBounds.isNonEmpty,
                enrollBounds.isNonEmpty,
                isTablet && professorBounds.isNonEmpty,
                numBounds.isNonEmpty,
                selectSchools.isNonEmpty,
                selectCredits.isNonEmpty,
                selectCourseInfoAttributes.isNonEmpty,
                selectSortBy.value.value === 'average_gut_rating',
                searchDescription.isNonEmpty,
                enableQuist.isNonEmpty,
                hideCancelled.isNonEmpty,
                hideConflicting.isNonEmpty,
                hideFirstYearSeminars.isNonEmpty,
                hideGraduateCourses.isNonEmpty,
                hideDiscussionSections.isNonEmpty,
              ].filter(Boolean).length
            }
            dataTutorial={4}
          >
            <div className={styles.advancedWrapper}>
              {isTablet && (
                <>
                  <div className={styles.advancedRow}>
                    {/* Yale Subjects Filter Dropdown */}
                    <div
                      className={styles.advancedLabel}
                      id={`${formLabelId}-subject`}
                    >
                      Subject:
                    </div>
                    <CustomSelect
                      aria-labelledby={`${formLabelId}-subject`}
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
                  </div>
                  <div className={styles.advancedRow}>
                    {/* Areas/Skills Filter Dropdown */}
                    <div
                      className={styles.advancedLabel}
                      id={`${formLabelId}-aria-skills`}
                    >
                      Areas/Skills:
                    </div>
                    <CustomSelect
                      aria-labelledby={`${formLabelId}-aria-skills`}
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
                  </div>
                  <div className={styles.advancedRow}>
                    {/* Season Filter Dropdown */}
                    <div
                      className={styles.advancedLabel}
                      id={`${formLabelId}-season`}
                    >
                      Season:
                    </div>
                    <CustomSelect
                      aria-labelledby={`${formLabelId}-season`}
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
                  </div>
                </>
              )}
              <div className={styles.advancedRow}>
                {/* Day Multi-Select */}
                <div className={styles.advancedLabel} id={`${formLabelId}-day`}>
                  Day:
                </div>
                <CustomSelect<Option<Weekdays>, true>
                  aria-labelledby={`${formLabelId}-day`}
                  className={styles.advancedSelect}
                  closeMenuOnSelect
                  isMulti
                  value={selectDays.value}
                  options={weekdays.map((day) => ({
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
              </div>
              <div className={styles.advancedRow}>
                <div
                  className={styles.advancedLabel}
                  style={activeStyle(timeBounds.isNonEmpty)}
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
                    ariaLabelGroupForHandles={[
                      'Time lower bound',
                      'Time upper bound',
                    ]}
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
              </div>
              <div className={styles.advancedRow}>
                <div
                  className={styles.advancedLabel}
                  style={activeStyle(enrollBounds.isNonEmpty)}
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
                    ariaLabelGroupForHandles={[
                      'Enrollment lower bound',
                      'Enrollment upper bound',
                    ]}
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
              </div>
              {isTablet && (
                <div className={styles.advancedRow}>
                  <div
                    className={styles.advancedLabel}
                    style={activeStyle(professorBounds.isNonEmpty)}
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
                      ariaLabelGroupForHandles={[
                        'Professor rating lower bound',
                        'Professor rating upper bound',
                      ]}
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
                </div>
              )}
              <div className={styles.advancedRow}>
                <div
                  className={styles.advancedLabel}
                  style={activeStyle(numBounds.isNonEmpty)}
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
                    ariaLabelGroupForHandles={[
                      'Course number lower bound',
                      'Course number upper bound',
                    ]}
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
              </div>
              <div className={styles.advancedRow}>
                {/* Yale Schools Multi-Select */}
                <div
                  className={styles.advancedLabel}
                  id={`${formLabelId}-school`}
                >
                  School:
                </div>
                <CustomSelect
                  aria-labelledby={`${formLabelId}-school`}
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
              </div>
              <div className={styles.advancedRow}>
                {/* Course Credit Multi-Select */}
                <div
                  className={styles.advancedLabel}
                  id={`${formLabelId}-credit`}
                >
                  Credit:
                </div>
                <CustomSelect
                  aria-labelledby={`${formLabelId}-credit`}
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
              </div>
              <div className={styles.advancedRow}>
                {/* Course Information Attributes Multi-Select */}
                <div
                  className={styles.advancedLabel}
                  id={`${formLabelId}-info`}
                >
                  Info:
                </div>
                <CustomSelect
                  aria-labelledby={`${formLabelId}-info`}
                  className={styles.advancedSelect}
                  closeMenuOnSelect
                  isMulti
                  value={selectCourseInfoAttributes.value}
                  options={courseInfoAttributesOptions}
                  placeholder="Course Information Attributes"
                  menuPortalTarget={menuPortalTarget}
                  onChange={(selectedOption) => {
                    selectCourseInfoAttributes.set(selectedOption as Option[]);
                    setStartTime(Date.now());
                  }}
                />
              </div>
              <div className={styles.advancedRow}>
                {/* Sort by Guts */}
                <div className={styles.advancedLabel}>
                  {sortByOptions.average_gut_rating.label}:
                </div>
                <ResultsColumnSort
                  selectOption={sortByOptions.average_gut_rating}
                />
              </div>
              <div className={styles.advancedToggleRow}>
                <Toggle handle="searchDescription" />
                <Toggle handle="enableQuist" />
                <Toggle handle="hideCancelled" />
                <Toggle handle="hideConflicting" />
                <Toggle handle="hideFirstYearSeminars" />
                <Toggle handle="hideGraduateCourses" />
                <Toggle handle="hideDiscussionSections" />
              </div>
            </div>
          </Popout>

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
              Object.values(filters).forEach((filter) =>
                filter.resetToDefault(),
              );
              setStartTime(Date.now());
            }}
            // Cannot reset if no filters have changed
            disabled={Object.values(filters).every((x) => x.isDefault)}
          >
            Reset
          </Button>
        </div>
      </Form>
    </>
  );
}
