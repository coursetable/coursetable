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

const mobileBreakpoint = 768;
const tabletBreakpoint = 1200;
const smDesktopBreakpoint = 1320;

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
          isMobile: range(window.innerWidth, 0, mobileBreakpoint),
          isTablet: range(
            window.innerWidth,
            mobileBreakpoint,
            tabletBreakpoint,
          ),
          isSmDesktop: range(
            window.innerWidth,
            tabletBreakpoint,
            smDesktopBreakpoint,
          ),
          isLgDesktop: range(window.innerWidth, smDesktopBreakpoint, 100000),
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

  // Store object returned in context provider
  const store = useMemo(
    () => ({
      ...dimensions,
    }),
    [dimensions],
  );

  return (
    <WindowDimensionsCtx.Provider value={store}>
      {children}
    </WindowDimensionsCtx.Provider>
  );
}

export const useWindowDimensions = () => useContext(WindowDimensionsCtx)!;
