import { useEffect, useState } from 'react';

import { getOwnProfile, type UserProfile } from '../queries/api';
import styles from './OwnProfile.module.css';

export default function OwnProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getOwnProfile();
        if (data) setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchProfile();
  }, []);

  if (isLoading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  if (!profile)
    return <div className={styles.container}>Profile not found</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Profile</h1>
      <div className={styles.profileSection}>
        <h2>Personal Information</h2>
        <div className={styles.field}>
          <label htmlFor="netId">NetID:</label>
          <span id="netId">{profile.netId}</span>
        </div>
        <div className={styles.field}>
          <label htmlFor="email">Email:</label>
          <span id="email">{profile.email || 'Not set'}</span>
        </div>
        <div className={styles.field}>
          <label htmlFor="school">School:</label>
          <span id="school">{profile.school || 'Not set'}</span>
        </div>
        <div className={styles.field}>
          <label htmlFor="major">Major:</label>
          <span id="major">{profile.major || 'Not set'}</span>
        </div>
        <div className={styles.field}>
          <label htmlFor="year">Year:</label>
          <span id="year">{profile.year || 'Not set'}</span>
        </div>
      </div>
    </div>
  );
}
