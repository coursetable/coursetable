import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Card } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';

import { TextComponent } from '../components/Typography';
import {
  getSharedProfile,
  isLoadedSharedProfile,
  type SharedProfile,
} from '../queries/api';
import type { NetId } from '../queries/graphql-types';
import { useStore } from '../store';
import { suspended } from '../utilities/display';
import styles from './UserProfile.module.css';

const NotFound = suspended(() => import('./NotFound'));

const formatValue = ({
  value,
  visible,
}: {
  value: string | number | null;
  visible: boolean;
}) => {
  if (!visible) return 'Private';
  if (value === null || value === '') return 'Not available';
  return String(value);
};

function UserProfile() {
  const { netId } = useParams<{ netId: string }>();
  const currentUser = useStore((state) => state.user);
  const [profile, setProfile] = useState<SharedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!netId) {
      return () => {
        cancelled = true;
      };
    }
    setLoading(true);
    setNotFound(false);
    setLoadError(false);
    setProfile(null);
    void getSharedProfile(netId as NetId).then((data) => {
      if (cancelled) return;
      setLoading(false);
      if (data === undefined) {
        setLoadError(true);
        return;
      }
      if (!isLoadedSharedProfile(data)) {
        setNotFound(true);
        return;
      }
      setProfile(data);
    });
    return () => {
      cancelled = true;
    };
  }, [netId]);

  if (!netId) return <Navigate to="/profile" replace />;
  if (currentUser?.netId === netId) return <Navigate to="/profile" replace />;
  if (!loading && !loadError && notFound) return <NotFound />;

  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      {profile ? (
        <div className={styles.headerContainer}>
          <div
            className={clsx(
              profile.visible.name
                ? styles.profileAvatar
                : styles.profileAvatarAnon,
            )}
          >
            {profile.visible.name && profile.firstName && profile.lastName ? (
              <span>
                {profile.firstName[0]!}
                {profile.lastName[0]!}
              </span>
            ) : (
              <BsFillPersonFill size={20} />
            )}
          </div>
          <h1 className={styles.profileHeader}>
            {profile.displayName ?? profile.netId}
          </h1>
        </div>
      ) : null}

      <Card className={styles.profileCard}>
        <Card.Body className={styles.cardBody}>
          <h3 className={styles.sectionTitle}>Profile</h3>
          {loading ? (
            <TextComponent type="secondary">Loading profile...</TextComponent>
          ) : loadError ? (
            <TextComponent type="secondary">
              Could not load this profile. Try again in a moment.
            </TextComponent>
          ) : profile ? (
            <>
              <div className={styles.infoRow}>
                <TextComponent type="secondary" className={styles.label}>
                  Name
                </TextComponent>
                <TextComponent className={styles.value}>
                  {formatValue({
                    value: profile.displayName,
                    visible: profile.visible.name,
                  })}
                </TextComponent>
              </div>
              <div className={styles.infoRow}>
                <TextComponent type="secondary" className={styles.label}>
                  Net ID
                </TextComponent>
                <TextComponent className={styles.value}>
                  {profile.netId}
                </TextComponent>
              </div>
              <div className={styles.infoRow}>
                <TextComponent type="secondary" className={styles.label}>
                  Email
                </TextComponent>
                <TextComponent className={styles.value}>
                  {formatValue({
                    value: profile.email,
                    visible: profile.visible.email,
                  })}
                </TextComponent>
              </div>
              <div className={styles.infoRow}>
                <TextComponent type="secondary" className={styles.label}>
                  Class Year
                </TextComponent>
                <TextComponent className={styles.value}>
                  {formatValue({
                    value: profile.year,
                    visible: profile.visible.year,
                  })}
                </TextComponent>
              </div>
              <div className={styles.infoRow}>
                <TextComponent type="secondary" className={styles.label}>
                  School
                </TextComponent>
                <TextComponent className={styles.value}>
                  {formatValue({
                    value: profile.school,
                    visible: profile.visible.school,
                  })}
                </TextComponent>
              </div>
              <div className={styles.infoRow}>
                <TextComponent type="secondary" className={styles.label}>
                  Major
                </TextComponent>
                <TextComponent className={styles.value}>
                  {formatValue({
                    value: profile.major,
                    visible: profile.visible.major,
                  })}
                </TextComponent>
              </div>
            </>
          ) : null}
        </Card.Body>
      </Card>

      <div className="mt-3">
        <Link to="/profile" className={styles.friendLink}>
          Back to my profile
        </Link>
      </div>
    </div>
  );
}

export default UserProfile;
