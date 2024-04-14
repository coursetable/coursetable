import React, { createContext, useContext, useMemo } from 'react';
import { useWishlistInfo } from './ferryContext';
import { useUser } from './userContext';
import type { Listing } from '../utilities/common';

export type WishlistCourse = {
  courseCode: string;
  upcomingListings: Listing[];
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
  const { user } = useUser();

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
