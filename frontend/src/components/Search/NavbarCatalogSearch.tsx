import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { GlobalHotKeys } from 'react-hotkeys';
import clsx from 'clsx';
import { Range } from 'rc-slider';
import { IoClose } from 'react-icons/io5';

import { TextComponent, Input } from '../Typography';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { Popout } from './Popout';
import { PopoutSelect } from './PopoutSelect';
import AdvancedPanel from './AdvancedPanel';

import { searchSpeed } from '../../utilities/constants';
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
import styles from './NavbarCatalogSearch.module.css';

function Select<K extends keyof CategoricalFilters>({
  options,
  handle: handleName,
  placeholder,
  useColors,
  hideSelectedOptions,
  ...props
}: Omit<React.ComponentProps<typeof Popout>, 'children' | 'buttonText'> & {
  readonly options: React.ComponentProps<
    typeof PopoutSelect<FilterHandle<K>['value'][number], true>
  >['options'];
  readonly handle: K;
  readonly placeholder: string;
  readonly useColors?: boolean;
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
      {...props}
    >
      <PopoutSelect<FilterHandle<K>['value'][number], true>
        isMulti
        useColors={useColors}
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

function BaseSlider<K extends NumericFilters>(
  { handle: handleName }: { readonly handle: K },
  ref: React.ForwardedRef<Resettable>,
) {
  const { isLgDesktop } = useWindowDimensions();
  const { setStartTime, filters } = useSearch();
  const handle = filters[handleName];
  // This is exactly the same as the filter handle, except it updates
  // responsively without triggering searching
  const [rangeValue, setRangeValue] = useState(handle.value);
  const [prevRangeValue, setPrevRangeValue] = useState(handle.value);
  if (handle.value !== prevRangeValue) {
    setRangeValue(handle.value);
    setPrevRangeValue(handle.value);
  }
  useImperativeHandle(ref, () => ({
    resetToDefault() {
      setRangeValue(defaultFilters[handleName]);
    },
  }));
  const rangeHandleStyle = useMemo(() => {
    if (isLgDesktop) return undefined;
    const style: React.CSSProperties = { height: '12px', width: '12px' };
    return [style, style];
  }, [isLgDesktop]);
  const rangeRailStyle = useMemo((): React.CSSProperties => {
    if (isLgDesktop) return {};
    return { marginTop: '-1px' };
  }, [isLgDesktop]);

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
      <Range
        ariaLabelGroupForHandles={[
          `${filterLabels[handleName]} rating lower bound`,
          `${filterLabels[handleName]} rating upper bound`,
        ]}
        className={clsx(styles.range, styles.mainRange)}
        min={defaultFilters[handleName][0]}
        max={defaultFilters[handleName][1]}
        step={0.1}
        handleStyle={rangeHandleStyle}
        railStyle={rangeRailStyle}
        trackStyle={[rangeRailStyle]}
        value={rangeValue}
        onChange={(value) => {
          setRangeValue(value as [number, number]);
        }}
        onAfterChange={(value) => {
          handle.set(value as [number, number]);
          setStartTime(Date.now());
        }}
      />
    </div>
  );
}

const Slider = React.forwardRef(BaseSlider);

export function NavbarCatalogSearch() {
  const { isTablet } = useWindowDimensions();
  const [searchParams] = useSearchParams();
  const hasCourseModal = searchParams.has('course-modal');

  const searchTextInput = useRef<HTMLInputElement>(null);

  const { filters, duration, searchData, coursesLoading, setStartTime } =
    useSearch();

  const { searchText } = filters;

  const range1 = useRef<Resettable>(null);
  const range2 = useRef<Resettable>(null);
  const range3 = useRef<Resettable>(null);
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
          {/* Number of results shown & search speed text */}
          <TextComponent
            type="tertiary"
            small
            className="ms-2 mb-1 d-flex align-items-end"
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
              <Select
                options={subjectsOptions}
                handle="selectSubjects"
                placeholder="All Subjects"
                dataTutorial={2}
              />
              <Select
                options={skillsAreasOptions}
                handle="selectSkillsAreas"
                placeholder="All Areas/Skills"
                useColors
                className="me-0"
              />
            </>
          )}

          <div
            className="w-auto flex-grow-0 d-flex align-items-center"
            data-tutorial="catalog-3"
          >
            <Slider handle="overallBounds" ref={range1} />
            <Slider handle="workloadBounds" ref={range2} />
            {!isTablet && <Slider handle="professorBounds" ref={range3} />}
          </div>
          {!isTablet && (
            <Select
              options={seasonsOptions}
              handle="selectSeasons"
              placeholder="Last 5 Years"
              displayOptionLabel
              maxDisplayOptions={1}
              hideSelectedOptions={false}
            />
          )}
          <AdvancedPanel ref={advanced} />

          {/* Reset Filters & Sorting Button */}
          <Button
            className={styles.resetButton}
            variant="danger"
            onClick={() => {
              range1.current?.resetToDefault();
              range2.current?.resetToDefault();
              range3.current?.resetToDefault();
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
