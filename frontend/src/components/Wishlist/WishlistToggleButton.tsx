import React, { useMemo, useCallback } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import clsx from 'clsx';

import { useUser } from '../../contexts/userContext';
import type { Listing } from '../../utilities/common';
import { isInWishlist } from '../../utilities/course';
import { toggleWish } from '../../utilities/api';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import styles from './WishlistToggleButton.module.css';

function WorksheetToggleButton({
  listing,
  modal,
  inWorksheet: inWishlistProp,
}: {
  readonly listing: Listing;
  readonly modal: boolean;
  readonly inWorksheet?: boolean;
}) {
  const { user, userRefresh } = useUser();

  const inWishlist = useMemo(
    () =>
      inWishlistProp ?? isInWishlist(listing.all_course_codes, user.wishlist),
    [inWishlistProp, listing.all_course_codes, user.wishlist],
  );

  const { isLgDesktop } = useWindowDimensions();

  const toggleWishlist = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      // Determine if we are adding or removing the course
      const addRemove = inWishlist ? 'remove' : 'add';

      const success = await toggleWish({
        action: addRemove,
        season: listing.season_code,
        crn: listing.crn,
      });
      if (success) await userRefresh();
    },
    [inWishlist, listing.season_code, listing.crn, userRefresh],
  );

  const size = modal ? 20 : isLgDesktop ? 16 : 14;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const Icon = inWishlist ? FaRegBookmark : FaBookmark;

  // Disabled worksheet add/remove button if not logged in
  if (!user.worksheets) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-disabled">
            Log in to add to your worksheet
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

export default WorksheetToggleButton;
