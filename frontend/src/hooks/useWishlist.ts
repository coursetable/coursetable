import { useShallow } from 'zustand/react/shallow';

import { useStore } from '../store';

/** Enriched wishlist rows (Apollo -> Zustand store in useWishlistEffects). */
export function useWishlist() {
  return useStore(
    useShallow((state) => ({
      wishlistCourses: state.wishlistCourses,
      wishlistLoading: state.wishlistLoading,
      wishlistError: state.wishlistError,
    })),
  );
}
