import debounce from 'lodash.debounce';
import type { StateCreator } from 'zustand';
import type { Store } from '../store';

const range = (num: number, min: number, max: number) =>
  num >= min && num < max;

export const breakpoints = {
  mobile: 768,
  tablet: 1200,
  smDesktop: 1320,
};

interface DimensionsSliceState {
  isMobile: boolean;
  isTablet: boolean;
  isSmDesktop: boolean;
  isLgDesktop: boolean;
}

interface DimensionsSliceActions {
  handleResize: () => void;
}

export interface DimensionsSlice
  extends DimensionsSliceState,
    DimensionsSliceActions {}

export const createDimensionsSlice: StateCreator<
  Store,
  [],
  [],
  DimensionsSlice
> = (set) => ({
  isMobile: false,
  isTablet: false,
  isSmDesktop: false,
  isLgDesktop: false,
  handleResize: debounce(() => {
    set({
      isMobile: range(window.innerWidth, 0, breakpoints.mobile),
      isTablet: range(
        window.innerWidth,
        breakpoints.mobile,
        breakpoints.tablet,
      ),
      isSmDesktop: range(
        window.innerWidth,
        breakpoints.tablet,
        breakpoints.smDesktop,
      ),
      isLgDesktop: range(window.innerWidth, breakpoints.smDesktop, Infinity),
    });
  }, 100),
});
