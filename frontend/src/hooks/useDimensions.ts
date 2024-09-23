import { useEffect } from 'react';
import { useStore } from '../store';

export const useDimensions = () => {
  const handleResize = useStore((state) => state.handleResize);

  useEffect(() => {
    // Initial update after first render
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
};
