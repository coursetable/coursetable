import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

import debounce from 'lodash.debounce';

type Store = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isSmDesktop: boolean;
  isLgDesktop: boolean;
};

/**
 * Each one is the upper bound of the range (exclusive)
 */
export const breakpoints = {
  mobile: 768,
  tablet: 1200,
  smDesktop: 1320,
};

const WindowDimensionsCtx = createContext<Store | undefined>(undefined);

const range = (num: number, min: number, max: number) =>
  num >= min && num < max;

// Return dimensions of the window
export function WindowDimensionsProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isSmDesktop: false,
    isLgDesktop: true,
    // TODO: make a proper "SSR" dimension
  });

  // Fires whenever the window size changes.
  // We're using useMemo instead of useCallback here, as per
  // https://github.com/facebook/react/issues/19240#issuecomment-652945246.
  const handleResize = useMemo(
    () =>
      debounce(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
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
          isLgDesktop: range(
            window.innerWidth,
            breakpoints.smDesktop,
            Infinity,
          ),
        });
      }, 200),
    [setDimensions],
  );

  // Update values on window resize
  useEffect(() => {
    // Initial update after first render
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <WindowDimensionsCtx.Provider value={dimensions}>
      {children}
    </WindowDimensionsCtx.Provider>
  );
}

export const useWindowDimensions = () => useContext(WindowDimensionsCtx)!;
