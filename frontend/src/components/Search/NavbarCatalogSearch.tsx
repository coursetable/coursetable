import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Form, Button } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import RCSlider from 'rc-slider';
import { GlobalHotKeys } from 'react-hotkeys';

import AdvancedPanel from './AdvancedPanel';
import { Popout } from './Popout';
import { PopoutSelect } from './PopoutSelect';
import {
  useSearch,
  filterLabels,
  type FilterHandle,
  type Filters,
  type CategoricalFilters,
  type NumericFilters,
  defaultFilters,
  type IntersectableFilters,
  skillsAreasOptions,
  subjectsOptions,
  seasonsOptions,
} from '../../contexts/searchContext';
import { useStore } from '../../store';
import { searchSpeed, skillsAreasColors } from '../../utilities/constants';
import { createCourseModalLink } from '../../utilities/display';
import { TextComponent, Input } from '../Typography';
import styles from './NavbarCatalogSearch.module.css';

type SelectProps<K extends keyof CategoricalFilters> = {
  readonly handle: K;
  readonly minSelectWidth?: number;
} & Pick<
  React.ComponentProps<typeof Popout>,
  'dataTutorial' | 'className' | 'displayOptionLabel' | 'maxDisplayOptions'
> &
  Pick<
    React.ComponentProps<
      typeof PopoutSelect<FilterHandle<K>['value'][number], true>
    >,
    | 'options'
    | 'placeholder'
    | 'colors'
    | 'hideSelectedOptions'
    | 'isIntersection'
    | 'setIsIntersection'
    | 'unionIntersectionButtonLabel'
  >;

function Select<K extends keyof CategoricalFilters>({
  dataTutorial,
  className,
  displayOptionLabel,
  maxDisplayOptions,
  handle: handleName,
  colors,
  minSelectWidth,
  ...props
}: SelectProps<K>) {
  const { setStartTime, filters } = useSearch();
  const handle = filters[handleName] as FilterHandle<K>;
  return (
    <Popout
      onReset={() => {
        handle.resetToEmpty();
        setStartTime(Date.now());
      }}
      selectedOptions={handle.value}
      buttonText={filterLabels[handleName]}
      colors={colors}
      dataTutorial={dataTutorial}
      className={className}
      displayOptionLabel={displayOptionLabel}
      maxDisplayOptions={maxDisplayOptions}
    >
      {/* @ts-expect-error: TODO */}
      <PopoutSelect<FilterHandle<K>['value'][number], true>
        isMulti
        colors={colors}
        value={handle.value}
        onChange={(selectedOption) => {
          handle.set(selectedOption as Filters[K]);
          setStartTime(Date.now());
        }}
        minWidth={minSelectWidth}
        {...props}
      />
    </Popout>
  );
}

function IntersectableSelect<K extends IntersectableFilters>(
  props: SelectProps<K>,
) {
  const {
    setStartTime,
    filters: { intersectingFilters },
  } = useSearch();
  return (
    <Select
      {...props}
      isIntersection={intersectingFilters.value.includes(props.handle)}
      setIsIntersection={(v) => {
        if (v) {
          intersectingFilters.set([...intersectingFilters.value, props.handle]);
        } else {
          intersectingFilters.set(
            intersectingFilters.value.filter((x) => x !== props.handle),
          );
        }
        setStartTime(Date.now());
      }}
    />
  );
}

function Slider<K extends NumericFilters>({
  handle: handleName,
}: {
  readonly handle: K;
}) {
  const { setStartTime, filters } = useSearch();
  const handle = filters[handleName];
  // This is exactly the same as the filter handle, except it updates
  // responsively without triggering searching
  const [rangeValue, setRangeValue] = useState(handle.value);
  useEffect(() => {
    setRangeValue(handle.value);
  }, [handle.value]);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderLabels}>
        <div className={styles.rangeValueLabel}>{rangeValue[0]}</div>
        <div
          className={clsx(
            styles.rangeLabel,
            handle.isNonEmpty && styles.rangeLabelActive,
          )}
        >
          {filterLabels[handleName]}
        </div>
        <div className={styles.rangeValueLabel}>{rangeValue[1]}</div>
      </div>
      <RCSlider
        range
        ariaLabelForHandle={[
          `${filterLabels[handleName]} rating lower bound`,
          `${filterLabels[handleName]} rating upper bound`,
        ]}
        className={styles.range}
        min={defaultFilters[handleName][0]}
        max={defaultFilters[handleName][1]}
        step={0.1}
        value={rangeValue}
        onChange={(value) => {
          setRangeValue(value as [number, number]);
        }}
        onChangeComplete={(value) => {
          handle.set(value as [number, number]);
          setStartTime(Date.now());
        }}
      />
    </div>
  );
}

export function NavbarCatalogSearch() {
  const isTablet = useStore((state) => state.isTablet);
  const [searchParams] = useSearchParams();
  const hasCourseModal = searchParams.has('course-modal');
  const navigate = useNavigate();

  const searchTextInput = useRef<HTMLInputElement>(null);

  const { filters, duration, searchData, coursesLoading, setStartTime } =
    useSearch();

  const { searchText } = filters;

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

  const speed = useMemo(() => {
    const pool =
      searchSpeed[
        duration > 1 ? 'fast' : duration > 0.5 ? 'faster' : 'fastest'
      ];
    return pool[Math.floor(Math.random() * pool.length)]!;
  }, [duration]);

  const fetchRandomCourse = () => {
    if (searchData && searchData.length > 0) {
      const randomCourse =
        searchData[Math.floor(Math.random() * searchData.length)];
      const courseModalLink = createCourseModalLink(
        randomCourse,
        new URLSearchParams(),
      );
      navigate(courseModalLink);
    }
  };

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
              className={clsx(
                styles.searchBar,
                searchText.value && styles.searchBarWithValue,
              )}
              type="text"
              value={searchText.value}
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
          <TextComponent type="tertiary" small className={styles.searchSpeed}>
            {coursesLoading
              ? 'Searching ...'
              : `Showing ${searchData?.length ?? 0} results${
                  !isTablet ? `${speed.length > 20 ? '\n' : ' '}(${speed})` : ''
                }`}
          </TextComponent>
        </div>
        <div className={styles.row}>
          {!isTablet && (
            <>
              <IntersectableSelect
                options={subjectsOptions}
                handle="selectSubjects"
                placeholder="All Subjects"
                dataTutorial={2}
                hideSelectedOptions
                unionIntersectionButtonLabel={(isIntersection) =>
                  `Classes offered with ${isIntersection ? 'all' : 'any'} of the selected subjects`
                }
              />
              <IntersectableSelect
                options={skillsAreasOptions}
                handle="selectSkillsAreas"
                placeholder="All Areas/Skills"
                colors={skillsAreasColors}
                className="me-0"
                hideSelectedOptions
                minSelectWidth={300}
                unionIntersectionButtonLabel={(isIntersection) =>
                  `Classes offered with ${isIntersection ? 'all' : 'any'} of the selected areas/skills`
                }
              />
            </>
          )}

          <div
            className="w-auto flex-grow-0 d-flex align-items-center"
            data-tutorial="catalog-3"
          >
            <Slider handle="overallBounds" />
            <Slider handle="workloadBounds" />
            {!isTablet && <Slider handle="professorBounds" />}
          </div>
          {!isTablet && (
            <Select
              options={seasonsOptions}
              handle="selectSeasons"
              placeholder="Last 5 Years"
              displayOptionLabel
              maxDisplayOptions={1}
              minSelectWidth={200}
            />
          )}
          <AdvancedPanel />

          {/* Reset Filters & Sorting Button */}
          <Button
            className={styles.resetButton}
            variant="danger"
            onClick={() => {
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

          <Button
            className={styles.randomButton}
            variant="primary"
            onClick={fetchRandomCourse}
          >
            Random Course
          </Button>
        </div>
      </Form>
    </>
  );
}
