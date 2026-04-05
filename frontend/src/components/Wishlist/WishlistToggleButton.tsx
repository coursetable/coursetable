import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useShallow } from 'zustand/react/shallow';
import type { CourseModalPrefetchListingDataFragment } from '../../generated/graphql-types';
import { useModalHistory } from '../../hooks/useModalHistory';
import { useWishlist } from '../../hooks/useWishlist';
import { updateWishlistCourses } from '../../queries/api';
import type { Crn, Season } from '../../queries/graphql-types';
import { useStore } from '../../store';
import { isInWishlist } from '../../utilities/course';
import styles from './WishlistToggleButton.module.css';

function WishlistToggleButton({
  listing,
  modal,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
  readonly modal: boolean;
}) {
  const { worksheets, wishlistRefresh, isLgDesktop } = useStore(
    useShallow((state) => ({
      worksheets: state.worksheets,
      wishlistRefresh: state.wishlistRefresh,
      isLgDesktop: state.isLgDesktop,
    })),
  );
  const { closeModal } = useModalHistory();
  const tooltipId = `wishlist-tooltip-${listing.course.season_code}-${listing.crn}`;

  const { wishlistCourses } = useWishlist();

  const inWishlist = useMemo(
    () => isInWishlist(listing.course.same_course_id, wishlistCourses),
    [listing.course.same_course_id, wishlistCourses],
  );

  // Should theoretically only be one course (unique by same_course_id)
  const sameCoursesInWishlist = useMemo(
    () =>
      wishlistCourses.filter(
        (item) => item.sameCourseId === listing.course.same_course_id,
      ),
    [listing.course.same_course_id, wishlistCourses],
  );

  const buttonLabel = inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
  const loggedOutLabel = 'Log in to add to your wishlist';

  const toggleWishlist = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        if (!inWishlist) {
          const ok = await updateWishlistCourses({
            action: 'add',
            season: listing.course.season_code,
            crn: listing.crn,
          }).catch(() => false);
          if (!ok) {
            toast.error(
              'Could not add this course to your wishlist. Please try again.',
            );
          } else {
            toast.info(
              <span>
                Saved to your wishlist{' '}
                <span className="text-nowrap">
                  (
                  <Link
                    to="/profile?tab=wishlist"
                    className="fw-semibold"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    view in profile
                  </Link>
                  )
                </span>
              </span>,
            );
          }
        } else {
          const failures: { season: Season; crn: Crn }[] = [];
          for (const course of sameCoursesInWishlist) {
            try {
              const ok = await updateWishlistCourses({
                action: 'remove',
                season: course.season,
                crn: course.crn,
              });
              if (!ok)
                failures.push({ season: course.season, crn: course.crn });
            } catch {
              failures.push({ season: course.season, crn: course.crn });
            }
          }
          if (failures.length > 0) {
            toast.error(
              failures.length === sameCoursesInWishlist.length
                ? 'Could not remove these courses from your wishlist.'
                : `Could not remove ${failures.length} item(s) from your wishlist.`,
            );
          } else if (sameCoursesInWishlist.length > 0) {
            toast.success('Removed from wishlist');
          }
        }
      } finally {
        await wishlistRefresh();
      }
    },
    [
      closeModal,
      inWishlist,
      wishlistRefresh,
      listing.course.season_code,
      listing.crn,
      sameCoursesInWishlist,
    ],
  );

  const size = modal ? 20 : isLgDesktop ? 16 : 14;
  const Icon = inWishlist ? FaBookmark : FaRegBookmark;

  // Disabled wishlist add/remove button if not logged in
  if (!worksheets) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={tooltipId}>{loggedOutLabel}</Tooltip>}
      >
        <Button
          className={clsx('p-0', styles.toggleButton, styles.disabledButton)}
          disabled
          aria-label={loggedOutLabel}
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
          <Tooltip id={tooltipId} {...props}>
            <small>{buttonLabel}</small>
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
          aria-label={buttonLabel}
        >
          <Icon size={size} />
        </Button>
      </OverlayTrigger>
    </div>
  );
}

export default WishlistToggleButton;
