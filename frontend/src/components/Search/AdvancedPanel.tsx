import React, { useImperativeHandle, useState, useMemo, useId } from 'react';
import clsx from 'clsx';
import { Range } from 'rc-slider';

import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import Toggle from './Toggle';
import { Popout } from './Popout';
import CustomSelect from './CustomSelect';
import ResultsColumnSort from './ResultsColumnSort';
import type { Resettable } from './NavbarCatalogSearch';

import { credits } from '../../utilities/constants';
import { weekdays, type Season, type Weekdays } from '../../utilities/common';
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
import {
  toRealTime,
  to12HourTime,
  toLinear,
  toExponential,
} from '../../utilities/course';
import styles from './AdvancedPanel.module.css';

function AdvancedPanel(props: unknown, ref: React.ForwardedRef<Resettable>) {
  const { isTablet, isLgDesktop } = useWindowDimensions();
  const formLabelId = useId();
  const { filters, setStartTime } = useSearch();
  const rangeHandleStyle = useMemo(() => {
    if (isLgDesktop) return undefined;
    const style: React.CSSProperties = { height: '12px', width: '12px' };
    return [style, style];
  }, [isLgDesktop]);
  const rangeRailStyle = useMemo((): React.CSSProperties => {
    if (isLgDesktop) return {};
    return { marginTop: '-1px' };
  }, [isLgDesktop]);

  const {
    selectSubjects,
    selectSkillsAreas,
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

  // Prevent overlap with tooltips
  const menuPortalTarget = document.querySelector<HTMLElement>('#portal');
  // These are exactly the same as the filters, except they update responsively
  // without triggering searching
  const [professorRangeValue, setProfessorRangeValue] = useState(
    professorBounds.value,
  );
  const [timeRangeValue, setTimeRangeValue] = useState(timeBounds.value);
  const [enrollRangeValue, setEnrollRangeValue] = useState(
    enrollBounds.value.map(toLinear).map(Math.round) as [number, number],
  );
  const [numRangeValue, setNumRangeValue] = useState(numBounds.value);

  useImperativeHandle(ref, () => ({
    resetToDefault() {
      setProfessorRangeValue(defaultFilters.professorBounds);
      setTimeRangeValue(defaultFilters.timeBounds);
      setEnrollRangeValue(
        defaultFilters.enrollBounds.map(toLinear).map(Math.round) as [
          number,
          number,
        ],
      );
      setNumRangeValue(defaultFilters.numBounds);
    },
  }));

  return (
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
        if (isTablet) setProfessorRangeValue(defaultFilters.professorBounds);
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
            className={clsx(
              styles.advancedLabel,
              timeBounds.isNonEmpty && styles.advancedLabelActive,
            )}
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
            className={clsx(
              styles.advancedLabel,
              enrollBounds.isNonEmpty && styles.advancedLabelActive,
            )}
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
                  value.map(toExponential).map(Math.round) as [number, number],
                );
                setStartTime(Date.now());
              }}
            />
          </div>
        </div>
        {isTablet && (
          <div className={styles.advancedRow}>
            <div
              className={clsx(
                styles.advancedLabel,
                professorBounds.isNonEmpty && styles.advancedLabelActive,
              )}
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
            className={clsx(
              styles.advancedLabel,
              numBounds.isNonEmpty && styles.advancedLabelActive,
            )}
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
          <div className={styles.advancedLabel} id={`${formLabelId}-school`}>
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
          <div className={styles.advancedLabel} id={`${formLabelId}-credit`}>
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
          <div className={styles.advancedLabel} id={`${formLabelId}-info`}>
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
          <ResultsColumnSort selectOption={sortByOptions.average_gut_rating} />
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
  );
}

export default React.forwardRef(AdvancedPanel);
