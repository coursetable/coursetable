import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { SurfaceComponent, Input } from '../components/Typography';
import type { UserProfile } from '../queries/api';
import { useStore } from '../store';
import styles from './OwnProfile.module.css';

export default function OwnProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Partial<UserProfile>>(
    {},
  );

  const { ownProfile, ownProfileRefresh, updateProfile } = useStore(
    (state) => ({
      ownProfile: state.ownProfile,
      ownProfileRefresh: state.ownProfileRefresh,
      updateProfile: state.updateProfile,
    }),
  );

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);
      try {
        await ownProfileRefresh();
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchProfile();
  }, [ownProfileRefresh]);

  const handleToggleHide = (
    field: 'isHideMajor' | 'isHideSchool' | 'isHideYear',
  ) => {
    if (!ownProfile) return;
    setPendingChanges((prev) => ({
      ...prev,
      [field]:
        pendingChanges[field] !== undefined
          ? !pendingChanges[field] // Toggle the pending change if it exists
          : !ownProfile[field], // Otherwise toggle the original value
    }));
  };

  const handleSaveChanges = async () => {
    if (!ownProfile || Object.keys(pendingChanges).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      await updateProfile(pendingChanges);
      setPendingChanges({});
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (isLoading) return <div className={styles.pageContainer}>Loading...</div>;
  if (error) return <div className={styles.pageContainer}>{error}</div>;
  if (!ownProfile)
    return <div className={styles.pageContainer}>Profile not found</div>;

  return (
    <div className={styles.pageContainer}>
      <SurfaceComponent className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Profile</h1>
          {isEditing ? (
            <div>
              <button
                type="button"
                className={styles.editButton}
                onClick={handleSaveChanges}
              >
                <FaEdit /> Save Changes
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
        <div className={styles.section}>
          <h2>Personal Information</h2>
          <div className={styles.field}>
            <label htmlFor="netid-display">NetID</label>
            <span id="netid-display">{ownProfile.netId}</span>
          </div>
          <div className={styles.field}>
            <label htmlFor="name-display">Name</label>
            {isEditing ? (
              <div className={styles.nameInputs}>
                <label className={styles.visuallyHidden} htmlFor="first-name">
                  First name
                </label>
                <Input
                  id="first-name"
                  type="text"
                  value={
                    pendingChanges.preferredFirstName !== undefined
                      ? pendingChanges.preferredFirstName || ''
                      : ownProfile.preferredFirstName ||
                        ownProfile.firstName ||
                        ''
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPendingChanges((prev) => ({
                      ...prev,
                      preferredFirstName: e.target.value || null,
                    }))
                  }
                  placeholder="First name (displayed)"
                  className={styles.nameInput}
                />
                <label className={styles.visuallyHidden} htmlFor="last-name">
                  Last name
                </label>
                <Input
                  id="last-name"
                  type="text"
                  value={
                    pendingChanges.preferredLastName !== undefined
                      ? pendingChanges.preferredLastName || ''
                      : ownProfile.preferredLastName ||
                        ownProfile.lastName ||
                        ''
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPendingChanges((prev) => ({
                      ...prev,
                      preferredLastName: e.target.value || null,
                    }))
                  }
                  placeholder="Last name (displayed)"
                  className={styles.nameInput}
                />
              </div>
            ) : (
              <span id="name-display">
                {`${ownProfile.preferredFirstName || ownProfile.firstName || ''} ${ownProfile.preferredLastName || ownProfile.lastName || ''}`}
              </span>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="email-display">Email</label>
            <span id="email-display">{ownProfile.email}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Academic Information</h2>
          <div className={styles.field}>
            <label htmlFor="school-display">School</label>
            <span id="school-display">{ownProfile.school}</span>
            <div className={styles.hideOption}>
              <label className={styles.switch} aria-label="Toggle hide school">
                <input
                  type="checkbox"
                  role="switch"
                  checked={
                    pendingChanges.isHideSchool ?? ownProfile.isHideSchool
                  }
                  onChange={() => handleToggleHide('isHideSchool')}
                  disabled={!isEditing}
                />
                <span className={styles.slider} />
              </label>
              Hide school
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="major-display">Major</label>
            <span id="major-display">{ownProfile.major}</span>
            <div className={styles.hideOption}>
              <label className={styles.switch} aria-label="Toggle hide major">
                <input
                  type="checkbox"
                  role="switch"
                  checked={pendingChanges.isHideMajor ?? ownProfile.isHideMajor}
                  onChange={() => handleToggleHide('isHideMajor')}
                  disabled={!isEditing}
                />
                <span className={styles.slider} />
              </label>
              Hide major
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="year-display">Year</label>
            <span id="year-display">{ownProfile.year}</span>
            <div className={styles.hideOption}>
              <label className={styles.switch} aria-label="Toggle hide year">
                <input
                  type="checkbox"
                  role="switch"
                  checked={pendingChanges.isHideYear ?? ownProfile.isHideYear}
                  onChange={() => handleToggleHide('isHideYear')}
                  disabled={!isEditing}
                />
                <span className={styles.slider} />
              </label>
              Hide year
            </div>
          </div>
        </div>
      </SurfaceComponent>
    </div>
  );
}
