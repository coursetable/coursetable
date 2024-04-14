import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlobalHotKeys } from 'react-hotkeys';

import { useWindowDimensions } from '../../contexts/windowDimensionsContext';

import { searchSpeed } from '../../utilities/constants';
import { toLinear } from '../../utilities/course';

export function NavbarWishlistSearch() {
  const { isMobile, isTablet, isLgDesktop } = useWindowDimensions();
  const [searchParams] = useSearchParams();
  const hasCourseModal = searchParams.has('course-modal');

  const searchTextInput = useRef<HTMLInputElement>(null);

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
    if (active) return { color: 'var(--color-primary-hover)' };
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

  return;
}
