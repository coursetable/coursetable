import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Update values on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <WindowDimensionsCtx.Provider value={dimensions}>
      {children}
    </WindowDimensionsCtx.Provider>
  );
};

export default WindowDimensionsProvider;
export const useWindowDimensions = () => useContext(WindowDimensionsCtx)!;
