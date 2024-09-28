import { useEffect } from 'react';

import { useHydration } from './useHydration';
import { useStore } from '../store';

export const useTheme = () => {
  const theme = useStore((state) => state.theme);

  const loaded = useHydration();

  useEffect(() => {
    if (!loaded) return;
    document.documentElement.dataset.theme = theme;
    // We don't actually use this ourselves, but it helps Bootstrap apply sane
    // defaults for colors
    document.documentElement.dataset.bsTheme = theme;
  }, [theme, loaded]);
};
