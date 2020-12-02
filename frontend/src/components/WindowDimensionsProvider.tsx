import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

import debounce from 'lodash/debounce';

type Store = {
  width: number;
  height: number;
};

const WindowDimensionsCtx = createContext<Store | undefined>(undefined);

// Return dimensions of the window
const WindowDimensionsProvider: React.FC = ({ children }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
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
        });
      }, 200),
    [setDimensions]
  );

  // Update values on window resize
  useEffect(() => {
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
};

export default WindowDimensionsProvider;
export const useWindowDimensions = () => useContext(WindowDimensionsCtx)!;
