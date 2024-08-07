import React, { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  skillsAreasOptions,
  subjectsOptions,
  seasonsOptions,
} from '../../contexts/searchContext';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { searchSpeed, skillsAreasColors } from '../../utilities/constants';
import { TextComponent, Input } from '../Typography';
import styles from './NavbarCatalogSearch.module.css';

function Select<K extends keyof CategoricalFilters>({
  options,
  handle: handleName,
  placeholder,
  colors,
  hideSelectedOptions,
  ...props
}: Omit<React.ComponentProps<typeof Popout>, 'children' | 'buttonText'> & {
  readonly options: React.ComponentProps<
    typeof PopoutSelect<FilterHandle<K>['value'][number], true>
  >['options'];
  readonly handle: K;
  readonly placeholder: string;
  readonly colors?: { [optionValue: string]: string };
  readonly hideSelectedOptions?: boolean;
}) {
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
      {...props}
    >
      <PopoutSelect<FilterHandle<K>['value'][number], true>
        isMulti
        colors={colors}
        value={handle.value}
        options={options}
        placeholder={placeholder}
        onChange={(selectedOption) => {
          handle.set(selectedOption as Filters[K]);
          setStartTime(Date.now());
        }}
        hideSelectedOptions={hideSelectedOptions}
      />
    </Popout>
  );
}

export type Resettable = { resetToDefault: () => void };

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
  const { isTablet } = useWindowDimensions();
  const [searchParams] = useSearchParams();
  const hasCourseModal = searchParams.has('course-modal');
  const resetKey = useRef(0);

  const searchTextInput = useRef<HTMLInputElement>(null);

  const { filters, duration, searchData, coursesLoading, setStartTime } =
    useSearch();

  const { searchText } = filters;

  const advanced = useRef<Resettable>(null);

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
              <Select
                options={subjectsOptions}
                handle="selectSubjects"
                placeholder="All Subjects"
                dataTutorial={2}
                hideSelectedOptions
              />
              <Select
                options={skillsAreasOptions}
                handle="selectSkillsAreas"
                placeholder="All Areas/Skills"
                colors={skillsAreasColors}
                className="me-0"
                hideSelectedOptions
              />
            </>
          )}

          <div
            key={resetKey.current}
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
            />
          )}
          <AdvancedPanel ref={advanced} />

          {/* Reset Filters & Sorting Button */}
          <Button
            className={styles.resetButton}
            variant="danger"
            onClick={() => {
              resetKey.current++;
              advanced.current?.resetToDefault();
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
