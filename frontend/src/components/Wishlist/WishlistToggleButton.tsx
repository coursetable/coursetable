import React, { useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';

import { useShallow } from 'zustand/react/shallow';
import { useWishlist } from '../../contexts/wishlistContext';
import type { CourseModalPrefetchListingDataFragment } from '../../generated/graphql-types';
import { updateWishlistCourses, type WishlistItem } from '../../queries/api';
import { useStore } from '../../store';
import { isInWishlist } from '../../utilities/course';
import styles from './WishlistToggleButton.module.css';

export type WishlistItemWithMetadata = WishlistItem & {
  courseCode: string;
  listingId: number;
  sameCourseId: number;
};

function WishlistToggleButton({
  listing,
  modal,
  inWishlist: inWishlistProp,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
  readonly modal: boolean;
  readonly inWishlist?: boolean;
}) {
  const { worksheets, wishlistRefresh, isLgDesktop } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      wishlistRefresh: state.wishlistRefresh,
      isLgDesktop: state.isLgDesktop,
    })),
  );

  const { wishlistWithMetadata } = useWishlist();

  const inWishlist = useMemo(
    () =>
      inWishlistProp ??
      isInWishlist(listing.course.same_course_id, wishlistWithMetadata),
    [inWishlistProp, listing, wishlistWithMetadata],
  );

  const allCourseCrns = listing.course.listings.map((l) => l.crn);

  const toggleWishlist = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Determine if we are adding or removing the course
      const addRemove = inWishlist ? 'remove' : 'add';
      await Promise.all(
        allCourseCrns.map((crn) =>
          updateWishlistCourses({
            action: addRemove,
            season: listing.course.season_code,
            crn,
          }),
        ),
      );

      await wishlistRefresh();
    },
    [allCourseCrns, inWishlist, listing.course.season_code, wishlistRefresh],
  );

  const size = modal ? 20 : isLgDesktop ? 16 : 14;
  const Icon = inWishlist ? FaBookmark : FaRegBookmark;

  // Disabled wishlist add/remove button if not logged in
  if (!worksheets) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-disabled">
            Log in to add to your wishlist
          </Tooltip>
        }
      >
        <Button
          className={clsx('p-0', styles.toggleButton, styles.disabledButton)}
          disabled
        >
          <FaBookmark size={size} className={styles.disabledButtonIcon} />
        </Button>
      </OverlayTrigger>
    );
  }

  return (
    <div className={styles.container}>
      <OverlayTrigger
        placement="top"
        delay={modal ? { show: 300, hide: 0 } : undefined}
        overlay={(props) => (
          <Tooltip id="button-tooltip" {...props}>
            <small>
              {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </small>
          </Tooltip>
        )}
      >
        <Button
          variant="toggle"
          className={clsx(
            'py-auto px-1 d-flex align-items-center',
            styles.toggleButton,
          )}
          onClick={toggleWishlist}
        >
          <Icon size={size} />
        </Button>
      </OverlayTrigger>
    </div>
  );
}

export default WishlistToggleButton;
