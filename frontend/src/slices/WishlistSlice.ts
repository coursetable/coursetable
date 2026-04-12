import { useMemo } from 'react';
import type { ApolloError } from '@apollo/client';
import type { StateCreator } from 'zustand';
import type { WishlistItem } from '../queries/api';
import {
  useCourseDataFromListingIdsQuery,
  useCourseDataFromSameCourseIdsQuery,
} from '../queries/graphql-queries';
import { type Store, useStore } from '../store';
import type { WishlistItemWithListings } from '../types/wishlist';
import { getListingId } from '../utilities/course';

type WishlistItemWithMetadata = WishlistItem & {
  courseCode: string;
  listingId: number;
  sameCourseId: number;
  avgWorkload?: number | null;
  avgRating?: number | null;
};

type WishlistListing = WishlistItemWithMetadata & {
  title: string;
  profName?: string;
};

interface WishlistState {
  wishlistCourses: WishlistItemWithListings[];
  wishlistLoading: boolean;
  wishlistError?: ApolloError;
}

interface WishlistActions {
  setWishlistDisplay: (
    wishlistCourses: WishlistItemWithListings[],
    wishlistLoading: boolean,
    wishlistError?: ApolloError,
  ) => void;
}

export interface WishlistSlice extends WishlistState, WishlistActions {}

export const createWishlistSlice: StateCreator<Store, [], [], WishlistSlice> = (
  set,
) => ({
  wishlistCourses: [],
  wishlistLoading: false,
  wishlistError: undefined,
  setWishlistDisplay(wishlistCourses, wishlistLoading, wishlistError) {
    set({ wishlistCourses, wishlistLoading, wishlistError });
  },
});

function useWishlistWithMetadata(wishlist?: WishlistItem[]) {
  const listingIds = useMemo(
    () =>
      Array.from(
        new Set(
          (wishlist ?? []).map((wishlistItem) =>
            getListingId(wishlistItem.season, wishlistItem.crn),
          ),
        ),
      ),
    [wishlist],
  );

  const {
    data: queryRes,
    loading: listingLoading,
    error: listingError,
  } = useCourseDataFromListingIdsQuery({
    variables: { listingIds },
    skip: listingIds.length === 0,
  });

  const wishlistWithMetadata = useMemo(():
    | WishlistItemWithMetadata[]
    | undefined => {
    if (listingIds.length === 0) {
      if (wishlist?.length === 0) return [];
      return undefined;
    }
    if (listingLoading) return undefined;
    if (listingError) return undefined;
    if (!queryRes?.listings) return undefined;
    return queryRes.listings.map((queryListing) => ({
      season: queryListing.season_code,
      crn: queryListing.crn,
      courseCode: queryListing.course_code,
      listingId: queryListing.listing_id,
      sameCourseId: queryListing.course.same_course_id,
    }));
  }, [listingError, listingIds.length, listingLoading, queryRes, wishlist]);

  return { wishlistWithMetadata, listingLoading, listingError };
}

function useWishlistInfo(wishlist?: WishlistItemWithMetadata[]) {
  const user = useStore((state) => state.user);
  const sameCourseIds = useMemo(
    () =>
      Array.from(
        new Set(
          wishlist?.map((wishlistItem) => wishlistItem.sameCourseId) ?? [],
        ),
      ),
    [wishlist],
  );
  const {
    data: queryRes,
    loading,
    error,
  } = useCourseDataFromSameCourseIdsQuery({
    variables: { sameCourseIds, hasEvals: user?.hasEvals ?? false },
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
        avgWorkload: queryListing.course.evaluation_statistic?.avg_workload,
        avgRating: queryListing.course.evaluation_statistic?.avg_rating,
      };
      if (queryResMap.has(sameCourseId))
        queryResMap.get(sameCourseId)!.push(queryWishlistItem);
      else queryResMap.set(sameCourseId, [queryWishlistItem]);
    });

    const uniqueSameCourseIdMap = new Map<number, WishlistItemWithListings>();
    for (const { crn, sameCourseId, season, courseCode } of wishlist) {
      if (uniqueSameCourseIdMap.has(sameCourseId)) continue;

      const listings: WishlistListing[] = [];
      const courseCodes = new Set<string>([courseCode]);
      if (queryResMap.has(sameCourseId)) {
        for (const queryItem of queryResMap.get(sameCourseId)!) {
          courseCodes.add(queryItem.courseCode);
          listings.push(queryItem);
        }
      }
      const wishlistItem: WishlistItemWithListings = {
        crn,
        courseCodes: Array.from(courseCodes),
        sameCourseId,
        season,
        listings,
      };
      uniqueSameCourseIdMap.set(sameCourseId, wishlistItem);
    }
    let dataReturn: WishlistItemWithListings[] = Array.from(
      uniqueSameCourseIdMap.values(),
    );
    dataReturn = dataReturn.map((item) => ({
      ...item,
      courseCodes: [...item.courseCodes].sort((a, b) =>
        a.localeCompare(b, 'en-US'),
      ),
      listings: [...item.listings].sort((a, b) =>
        a.season.localeCompare(b.season, 'en-US'),
      ),
    }));
    return dataReturn.sort((a, b) =>
      (a.courseCodes[0] ?? '').localeCompare(b.courseCodes[0] ?? '', 'en-US'),
    );
  }, [queryRes, loading, error, wishlist]);
  return { loading, error, data };
}

/** Writes Apollo-derived wishlist UI state to the store. */
export function useWishlistEffects() {
  const userWishlist = useStore((state) => state.wishlist);
  const setWishlistDisplay = useStore((state) => state.setWishlistDisplay);

  const { wishlistWithMetadata, listingLoading, listingError } =
    useWishlistWithMetadata(userWishlist);

  const {
    loading: sameCourseLoading,
    error: sameCourseError,
    data: wishlistCourses,
  } = useWishlistInfo(wishlistWithMetadata);

  setWishlistDisplay(
    wishlistCourses,
    listingLoading || sameCourseLoading || !userWishlist,
    listingError ?? sameCourseError,
  );
}
