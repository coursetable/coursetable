import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaBell, FaRegBell } from 'react-icons/fa';
import { toast } from 'react-toastify';

import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';
import {
  getCourseAlertStatus,
  subscribeCourseAlert,
  unsubscribeCourseAlert,
} from '../../../queries/api';
import { useStore } from '../../../store';
import { getListingId } from '../../../utilities/course';
import styles from './CourseAlertBellButton.module.css';

export default function CourseAlertBellButton({
  listing,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
}) {
  const user = useStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [statusFetchFailed, setStatusFetchFailed] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    const id = getListingId(listing.course.season_code, listing.crn);
    setLoading(true);
    setStatusFetchFailed(false);
    try {
      const res = await getCourseAlertStatus(id);
      if (!res) {
        setStatusFetchFailed(true);
        setSubscribed(false);
        setSubscriptionId(null);
      } else {
        setSubscribed(res.subscribed);
        setSubscriptionId(res.subscriptionId);
      }
    } catch {
      setStatusFetchFailed(true);
      setSubscribed(false);
      setSubscriptionId(null);
    } finally {
      setLoading(false);
    }
  }, [user, listing.course.season_code, listing.crn]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setStatusFetchFailed(false);
      return;
    }
    void refresh();
  }, [user, refresh]);

  if (!user) return null;

  const listingId = getListingId(listing.course.season_code, listing.crn);

  const onToggle = async () => {
    if (busy || loading) return;
    if (statusFetchFailed) {
      void refresh();
      return;
    }
    setBusy(true);
    try {
      if (subscribed && subscriptionId !== null) {
        const ok = await unsubscribeCourseAlert(subscriptionId);
        if (ok) {
          setSubscribed(false);
          setSubscriptionId(null);
          toast.success('Email alerts turned off for this course.');
        }
      } else {
        const row = await subscribeCourseAlert(listingId);
        if (row) {
          setSubscribed(true);
          setSubscriptionId(row.id);
          toast.success(
            <div>
              <div>
                You will get an email when this course is updated on
                CourseTable.
              </div>
              <div className="mt-2">
                To view all alerts you are signed up for, go{' '}
                <Link
                  to="/profile?tab=alerts"
                  className={styles.toastProfileLink}
                >
                  here
                </Link>
                .
              </div>
            </div>,
          );
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const tooltip = statusFetchFailed
    ? 'Could not load alert status — click to retry'
    : subscribed
      ? 'Email alerts on — click to turn off'
      : 'Email me when this course updates';

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={(props) => (
        <Tooltip {...props} id="course-alert-bell-tooltip">
          {tooltip}
        </Tooltip>
      )}
    >
      <button
        type="button"
        className={clsx(styles.bell, subscribed && styles.bellSubscribed)}
        aria-label={tooltip}
        aria-pressed={subscribed}
        disabled={(loading || busy) && !statusFetchFailed}
        onClick={() => {
          void onToggle();
        }}
      >
        {subscribed ? (
          <FaBell size={20} aria-hidden />
        ) : (
          <FaRegBell size={20} aria-hidden />
        )}
      </button>
    </OverlayTrigger>
  );
}
