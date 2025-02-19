import React, { createContext, useContext, useMemo } from 'react';
import type { ApolloError } from '@apollo/client';
import type { WishlistItemWithMetadata } from '../components/Wishlist/WishlistToggleButton';
import { CUR_YEAR } from '../config';
import type { WishlistItem } from '../queries/api';
import {
  useCourseDataFromListingIdsQuery,
  useCourseDataFromSameCourseIdsQuery,
} from '../queries/graphql-queries';
import type { Crn } from '../queries/graphql-types';
import { useStore } from '../store';
import { getListingId } from '../utilities/course';

export type WishlistListing = WishlistItemWithMetadata & {
  title: string;
  profName?: string;
};

export type WishlistItemWithListings = {
  crn: Crn;
  courseCodes: string[];
  sameCourseId: number;
  upcomingListings: WishlistListing[];
  prevListings: WishlistListing[];
};

type Store = {
  // Controls which courses are displayed
  courses: WishlistItemWithListings[];
  wishlistWithMetadata?: WishlistItemWithMetadata[];
  wishlistLoading: boolean;
  wishlistError?: ApolloError;
};

const WishlistContext = createContext<Store | undefined>(undefined);
WishlistContext.displayName = 'WishlistContext';

function useWishlistWithMetadata(wishlist?: WishlistItem[]) {
  const listingIds =
    wishlist?.map((wishlistItem) =>
      getListingId(wishlistItem.season, wishlistItem.crn),
    ) ?? [];
  const { data: queryRes } = useCourseDataFromListingIdsQuery({
    variables: { listingIds },
    skip: listingIds.length === 0,
  });

  if (queryRes?.listings) {
    return queryRes.listings.map((queryListing) => ({
      season: queryListing.season_code,
      crn: queryListing.crn,
      courseCode: queryListing.course_code,
      listingId: queryListing.listing_id,
      sameCourseId: queryListing.course.same_course_id,
    }));
  }
  return undefined;
}

export function useWishlistInfo(
  wishlist: WishlistItemWithMetadata[] | undefined,
) {
  const sameCourseIds =
    wishlist?.map((wishlistItem) => wishlistItem.sameCourseId) ?? [];
  const {
    data: queryRes,
    loading,
    error,
  } = useCourseDataFromSameCourseIdsQuery({
    variables: { sameCourseIds },
    skip: sameCourseIds.length === 0,
  });

  const data = useMemo(() => {
    if (!wishlist) return [];
    if (loading || error) return [];
    const queryResMap = new Map<number, WishlistListing[]>();
    queryRes?.listings.forEach((queryListing) => {
      const sameCourseId = queryListing.course.same_course_id;
      const queryWishlistItem: WishlistListing = {
        courseCode: queryListing.course_code,
        crn: queryListing.crn,
        listingId: queryListing.listing_id,
        season: queryListing.season_code,
        sameCourseId: queryListing.course.same_course_id,
        title: queryListing.course.title,
        profName: queryListing.course.course_professors[0]?.professor.name,
      };
      if (queryResMap.has(sameCourseId))
        queryResMap.get(sameCourseId)!.push(queryWishlistItem);
      else queryResMap.set(sameCourseId, [queryWishlistItem]);
    });

    const uniqueSameCourseIdMap = new Map<number, WishlistItemWithListings>();
    for (const { crn, sameCourseId } of wishlist) {
      if (uniqueSameCourseIdMap.has(sameCourseId)) continue;

      let upcomingListings: WishlistListing[] = [];
      let prevListings: WishlistListing[] = [];
      let courseCodes: Set<string> = new Set();
      if (queryResMap.has(sameCourseId)) {
        for (const queryItem of queryResMap.get(sameCourseId)!) {
          courseCodes.add(queryItem.courseCode);
          if (CUR_YEAR.includes(queryItem.season))
            upcomingListings.push(queryItem);
          else prevListings.push(queryItem);
        }
      }
      const wishlistItem: WishlistItemWithListings = {
        crn,
        courseCodes: Array.from(courseCodes),
        sameCourseId,
        upcomingListings,
        prevListings,
      };
      uniqueSameCourseIdMap.set(sameCourseId, wishlistItem);
    }
    const dataReturn: WishlistItemWithListings[] = Array.from(
      uniqueSameCourseIdMap.values(),
    );
    dataReturn.forEach((item) => ({
      ...item,
      courseCodes: item.courseCodes.sort((a, b) => a.localeCompare(b, 'en-US')),
      upcomingListings: item.upcomingListings.sort((a, b) =>
        a.season.localeCompare(b.season, 'en-US'),
      ),
      prevListings: item.prevListings
        .sort((a, b) => a.season.localeCompare(b.season, 'en-US'))
        .reverse(),
    }));
    return dataReturn.sort((a, b) =>
      a.courseCodes[0]!.localeCompare(b.courseCodes[0]!, 'en-US'),
    );
  }, [queryRes, loading, error, wishlist]);
  return { loading, error, data };
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
