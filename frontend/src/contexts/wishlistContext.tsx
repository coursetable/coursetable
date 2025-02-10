import React, { createContext, useContext, useMemo } from 'react';
import { useWishlistInfo } from './ferryContext';
import type { WishlistItemWithMetadata } from '../components/Wishlist/WishlistToggleButton';
import type { CatalogListing, WishlistItem } from '../queries/api';
import { useCourseDataFromListingIdsQuery } from '../queries/graphql-queries';
import type { Crn } from '../queries/graphql-types';
import { useStore } from '../store';
import { getListingId } from '../utilities/course';

export type WishlistItemWithListings = {
  crn: Crn;
  courseCode: string;
  sameCourseId: number;
  upcomingListings: CatalogListing[];
  lastListing: CatalogListing[]; // Type array for section-based courses
};

type Store = {
  // Controls which courses are displayed
  courses: WishlistItemWithListings[];
  wishlistWithMetadata?: WishlistItemWithMetadata[];
  wishlistLoading: boolean;
  wishlistError: {} | null;
};

const WishlistContext = createContext<Store | undefined>(undefined);
WishlistContext.displayName = 'WishlistContext';

function useWishlistWithMetadata(wishlist?: WishlistItem[]) {
  const listingIds = wishlist?.map((wishlistItem) => getListingId(wishlistItem.season, wishlistItem.crn)) ?? [];
  const { data: queryRes } = useCourseDataFromListingIdsQuery({
    variables: { listingIds },
    skip: listingIds.length === 0,
  });

  if (queryRes?.listings) {
    return (
      queryRes.listings.map((queryListing) => ({
        season: queryListing.season_code,
        crn: queryListing.crn,
        courseCode: queryListing.course_code,
        listingId: queryListing.listing_id,
        sameCourseId: queryListing.course.same_course_id,
      }))
    );
  }
  return undefined;
}

export function WishlistProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const userWishlist = useStore((state) => state.wishlist);
  const wishlistWithMetadata = useWishlistWithMetadata(userWishlist);

  const {
    loading: wishlistLoading,
    error: wishlistError,
    data: courses,
  } = useWishlistInfo(wishlistWithMetadata);

  const store = useMemo(
    () => ({
      courses,
      wishlistWithMetadata,
      wishlistLoading,
      wishlistError,
    }),
    [courses, wishlistWithMetadata, wishlistLoading, wishlistError],
  );

  return (
    <WishlistContext.Provider value={store}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext)!;
