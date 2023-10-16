import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import debounce from 'lodash/debounce';

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

// Return dimensions of the window
function WindowDimensionsProvider({ children }: { children: React.ReactNode }) {
  const range = useCallback((num: number, min: number, max: number) => {
    return num >= min && num < max;
  }, []);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: range(window.innerWidth, 0, mobileBreakpoint),
    isTablet: range(window.innerWidth, mobileBreakpoint, tabletBreakpoint),
    isSmDesktop: range(
      window.innerWidth,
      tabletBreakpoint,
      smDesktopBreakpoint,
    ),
    isLgDesktop: range(window.innerWidth, smDesktopBreakpoint, 100000),
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
    [setDimensions, range],
  );

  // Update values on window resize
  useEffect(() => {
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

export default WindowDimensionsProvider;
export const useWindowDimensions = () => useContext(WindowDimensionsCtx)!;
