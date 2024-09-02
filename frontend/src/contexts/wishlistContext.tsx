import React, { createContext, useContext, useMemo } from 'react';
import { useWishlistInfo } from './ferryContext';
import type { CatalogListing } from '../queries/api';
import { useStore } from '../store';

export type WishlistCourse = {
  courseCode: string;
  upcomingListings: CatalogListing[];
  lastListing: CatalogListing[]; // Type array for section-based courses
};

type Store = {
  // Controls which courses are displayed
  courses: WishlistCourse[];
  wishlistLoading: boolean;
  wishlistError: {} | null;
};

const WishlistContext = createContext<Store | undefined>(undefined);
WishlistContext.displayName = 'WishlistContext';

export function WishlistProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = useStore((state) => state.user);

  const {
    loading: wishlistLoading,
    error: wishlistError,
    data: courses,
  } = useWishlistInfo(user.wishlist);

  const store = useMemo(
    () => ({
      courses,
      wishlistLoading,
      wishlistError,
    }),
    [courses, wishlistLoading, wishlistError],
  );

  return (
    <WishlistContext.Provider value={store}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext)!;
