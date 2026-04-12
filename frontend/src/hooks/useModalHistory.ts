import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useStore } from '../store';

export function useModalHistory() {
  const [, setSearchParams] = useSearchParams();
  const navigate = useStore((s) => s.navigate);
  const closeModalFromStore = useStore((s) => s.closeModal);

  const closeModal = useCallback(() => {
    closeModalFromStore(setSearchParams);
  }, [closeModalFromStore, setSearchParams]);

  return { navigate, closeModal };
}
