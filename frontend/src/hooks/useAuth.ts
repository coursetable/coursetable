import { useEffect } from 'react';

import { useHydration } from './useHydration';
import { useStore } from '../store';

export const useAuth = () => {
  const refreshAuth = useStore((state) => state.refreshAuth);

  const loaded = useHydration();

  useEffect(() => {
    if (!loaded) return;
    void refreshAuth();
  }, [loaded, refreshAuth]);
};
