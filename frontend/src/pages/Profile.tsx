import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Button, Card, Form, Tab, Tabs } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';
import { useApolloClient } from '@apollo/client';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { Popout } from '../components/Search/Popout';
import { PopoutSelect } from '../components/Search/PopoutSelect';
import { TextComponent } from '../components/Typography';
import AddFriendDropdown from '../components/Worksheet/AddFriendDropdown';
import {
  resetCatalogCache,
  useFerry,
  useWorksheetInfo,
} from '../contexts/ferryContext';
import type { Option } from '../contexts/searchContext';
import {
  getMyProfile,
  revokeEvaluationsAccess,
  updateMyProfile,
  type ProfilePrivacy,
} from '../queries/api';
import type { NetId } from '../queries/graphql-types';
import { useStore, type Store } from '../store';
import { bumpCatalogCacheBustToken } from '../utilities/catalogCache';
import { createCourseModalLink } from '../utilities/display';
import styles from './Profile.module.css';

const selectProfileStore = (state: Store) => ({
  user: state.user,
  userRefresh: state.userRefresh,
  worksheets: state.worksheets,
  worksheetsRefresh: state.worksheetsRefresh,
  friends: state.friends,
  friendRequests: state.friendRequests,
  friendRefresh: state.friendRefresh,
  friendReqRefresh: state.friendReqRefresh,
  removeFriend: state.removeFriend,
  addFriend: state.addFriend,
  viewedSeason: state.viewedSeason,
});

const alphaSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });

const visibilityLabels: {
  value: keyof ProfilePrivacy;
  label: string;
}[] = [
  { value: 'nameVisibility', label: 'Name' },
  { value: 'emailVisibility', label: 'Email' },
  { value: 'yearVisibility', label: 'Class Year' },
  { value: 'schoolVisibility', label: 'School' },
  { value: 'majorVisibility', label: 'Major' },
];

const visibilityOptions: {
  value: 'public' | 'friends' | 'self';
  label: string;
}[] = [
  { value: 'public', label: 'Public' },
  { value: 'friends', label: 'Friends' },
  { value: 'self', label: 'Only me' },
];

function Profile() {
  const navigate = useNavigate();
  const {
    user: currentUser,
    userRefresh,
    worksheets,
    worksheetsRefresh,
    friends,
    friendRequests,
    friendRefresh,
    friendReqRefresh,
    removeFriend,
    addFriend,
    viewedSeason,
  } = useStore(useShallow(selectProfileStore));
  const { requestSeasons } = useFerry();
  const apolloClient = useApolloClient();

  const [catalogRefreshing, setCatalogRefreshing] = useState(false);
  const [preferredFirstNameInput, setPreferredFirstNameInput] = useState('');
  const [preferredLastNameInput, setPreferredLastNameInput] = useState('');
  const [legalFirstPlaceholder, setLegalFirstPlaceholder] = useState('');
  const [legalLastPlaceholder, setLegalLastPlaceholder] = useState('');
  const [privacyDraft, setPrivacyDraft] = useState<ProfilePrivacy | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [revokingEvals, setRevokingEvals] = useState(false);
  const [revokeArmed, setRevokeArmed] = useState(false);
  const [revokeConfirmed, setRevokeConfirmed] = useState(false);

  const [profileWorksheetNumber, setProfileWorksheetNumber] = useState(
    () => useStore.getState().viewedWorksheetNumber,
  );

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!currentUser) void userRefresh();
  }, [currentUser, userRefresh]);

  useEffect(() => {
    if (!worksheets) void worksheetsRefresh();
  }, [worksheets, worksheetsRefresh]);

  useEffect(() => {
    if (!friends) void friendRefresh();
  }, [friends, friendRefresh]);

  useEffect(() => {
    if (!friendRequests) void friendReqRefresh();
  }, [friendRequests, friendReqRefresh]);

  useEffect(() => {
    if (!currentUser) return;
    void getMyProfile().then((data) => {
      if (!data) return;
      setPreferredFirstNameInput(data.preferredFirstName ?? '');
      setPreferredLastNameInput(data.preferredLastName ?? '');
      setLegalFirstPlaceholder(data.firstName ?? currentUser.firstName ?? '');
      setLegalLastPlaceholder(data.lastName ?? currentUser.lastName ?? '');
      setPrivacyDraft(data.privacy);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!worksheets) return;
    const seasonWs = worksheets.get(viewedSeason);
    if (!seasonWs) return;
    const globalWs = useStore.getState().viewedWorksheetNumber;
    setProfileWorksheetNumber((cur) => {
      if (seasonWs.has(cur)) return cur;
      if (seasonWs.has(globalWs)) return globalWs;
      const nums = [...seasonWs.keys()].sort((a, b) => a - b);
      return nums.includes(0) ? 0 : (nums[0] ?? 0);
    });
  }, [worksheets, viewedSeason]);

  const {
    loading: profileWorksheetCatalogLoading,
    error: profileWorksheetCatalogError,
    data: profileWorksheetCourses,
  } = useWorksheetInfo(worksheets, viewedSeason, profileWorksheetNumber);

  const worksheetOptions = useMemo(() => {
    if (!worksheets) return [];
    const seasonWorksheets = worksheets.get(viewedSeason);
    const entries = seasonWorksheets ? [...seasonWorksheets.entries()] : [];
    if (!entries.some(([number]) => number === 0)) {
      entries.push([
        0,
        {
          name: 'Main Worksheet',
          courses: [],
        },
      ]);
    }

    return entries
      .sort(([a], [b]) => a - b)
      .map(([number, worksheet]) => ({
        value: number,
        label: worksheet.name,
      }));
  }, [worksheets, viewedSeason]);

  const sortedWorksheetCourses = useMemo(
    () =>
      profileWorksheetCourses
        .filter((course) => !course.hidden)
        .sort((a, b) =>
          alphaSort(a.listing.course.title, b.listing.course.title),
        ),
    [profileWorksheetCourses],
  );

  const selectedWorksheetOption = useMemo(
    () =>
      worksheetOptions.find(
        (option) => option.value === profileWorksheetNumber,
      ) ??
      worksheetOptions[0] ??
      null,
    [worksheetOptions, profileWorksheetNumber],
  );

  if (!currentUser) {
    return (
      <div className={clsx(styles.container, 'mx-auto')}>
        <h1 className={clsx(styles.profileHeader, 'mt-5 mb-3')}>Profile</h1>
        <TextComponent type="secondary">Loading...</TextComponent>
      </div>
    );
  }

  const fullName =
    currentUser.firstName && currentUser.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : null;

  const hasName = Boolean(currentUser.firstName && currentUser.lastName);
  const friendsList = friends ? Object.entries(friends) : [];
  const friendRequestsList = friendRequests ?? [];
  const friendsLoading = !friends || !friendRequests;
  const worksheetsLoading = !worksheets || profileWorksheetCatalogLoading;

  const handleRemoveFriend = (friendNetId: NetId) => {
    void removeFriend(friendNetId, false);
  };

  const handleCatalogCacheRefresh = async () => {
    setCatalogRefreshing(true);
    try {
      bumpCatalogCacheBustToken();
      resetCatalogCache();
      toast.info('Catalog cache cleared. Re-fetching catalog data...');
      await requestSeasons([viewedSeason]);
      toast.success('Catalog data refreshed.');
    } finally {
      setCatalogRefreshing(false);
    }
  };

  const handleSaveProfileSettings = async () => {
    if (!privacyDraft) return;
    setSavingProfile(true);
    try {
      const updated = await updateMyProfile({
        preferredFirstName:
          preferredFirstNameInput.trim().length > 0
            ? preferredFirstNameInput.trim()
            : null,
        preferredLastName:
          preferredLastNameInput.trim().length > 0
            ? preferredLastNameInput.trim()
            : null,
        privacy: privacyDraft,
      });
      if (!updated) return;
      setPreferredFirstNameInput(updated.preferredFirstName ?? '');
      setPreferredLastNameInput(updated.preferredLastName ?? '');
      setLegalFirstPlaceholder(updated.firstName ?? '');
      setLegalLastPlaceholder(updated.lastName ?? '');
      setPrivacyDraft(updated.privacy);
      await Promise.all([userRefresh(), friendRefresh(), friendReqRefresh()]);
      toast.success('Profile settings updated.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRevokeEvaluations = async () => {
    if (!revokeConfirmed) {
      toast.info('Check the confirmation box first.');
      return;
    }
    if (!revokeArmed) {
      setRevokeArmed(true);
      toast.warn('Click "Revoke access" again to confirm.');
      return;
    }
    setRevokeArmed(false);
    setRevokingEvals(true);
    try {
      const res = await revokeEvaluationsAccess();
      if (!res) return;
      await userRefresh();
      await apolloClient.resetStore();
      toast.success('Evaluations access revoked.');
      void navigate('/challenge');
    } finally {
      setRevokingEvals(false);
    }
  };

  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      <div className={styles.headerContainer}>
        <div
          className={clsx(
            hasName ? styles.profileAvatar : styles.profileAvatarAnon,
          )}
        >
          {hasName ? (
            <span title={fullName || undefined}>
              {currentUser.firstName![0]!}
              {currentUser.lastName![0]!}
            </span>
          ) : (
            <BsFillPersonFill size={20} />
          )}
        </div>
        <h1 className={styles.profileHeader}>Profile</h1>
        {!currentUser.hasEvals && (
          <Button
            variant="primary"
            size="sm"
            className="ms-2"
            onClick={() => navigate('/challenge')}
          >
            Go to challenge
          </Button>
        )}
      </div>

      <Tabs
        defaultActiveKey="overview"
        className={styles.profileTabs}
        variant="tabs"
        transition={false}
      >
        <Tab eventKey="overview" title="Overview">
          <div className={styles.tabContent}>
            <div className={styles.twoColumnLayout}>
              <Card className={styles.profileCard}>
                <Card.Body className={clsx(styles.cardBody, styles.scrollCard)}>
                  <h3 className={styles.sectionTitle}>Basic Info</h3>
                  <div className={styles.infoRow}>
                    <TextComponent type="secondary" className={styles.label}>
                      Name
                    </TextComponent>
                    <TextComponent className={styles.value}>
                      {fullName || 'Not available'}
                    </TextComponent>
                  </div>
                  <div className={styles.infoRow}>
                    <TextComponent type="secondary" className={styles.label}>
                      Net ID
                    </TextComponent>
                    <TextComponent className={styles.value}>
                      {currentUser.netId}
                    </TextComponent>
                  </div>
                  <div className={styles.infoRow}>
                    <TextComponent type="secondary" className={styles.label}>
                      Email
                    </TextComponent>
                    <TextComponent className={styles.value}>
                      {currentUser.email || 'Not available'}
                    </TextComponent>
                  </div>
                  <div className={styles.infoRow}>
                    <TextComponent type="secondary" className={styles.label}>
                      Class Year
                    </TextComponent>
                    <TextComponent className={styles.value}>
                      {currentUser.year
                        ? String(currentUser.year)
                        : 'Not available'}
                    </TextComponent>
                  </div>
                  {currentUser.school && (
                    <div className={styles.infoRow}>
                      <TextComponent type="secondary" className={styles.label}>
                        School
                      </TextComponent>
                      <TextComponent className={styles.value}>
                        {currentUser.school}
                      </TextComponent>
                    </div>
                  )}
                  <div className={styles.infoRow}>
                    <TextComponent type="secondary" className={styles.label}>
                      Major
                    </TextComponent>
                    <TextComponent className={styles.value}>
                      {currentUser.major || 'Undeclared'}
                    </TextComponent>
                  </div>
                </Card.Body>
              </Card>

              <Card className={styles.profileCard}>
                <Card.Body className={clsx(styles.cardBody, styles.scrollCard)}>
                  <h3 className={styles.sectionTitle}>Friends</h3>
                  <div className={styles.friendForm}>
                    <AddFriendDropdown
                      mobile={false}
                      removeFriend={removeFriend}
                      fullWidth
                    />
                  </div>

                  {friendsLoading && (
                    <TextComponent type="secondary">
                      Loading friends...
                    </TextComponent>
                  )}

                  {!friendsLoading && friendRequestsList.length > 0 && (
                    <div className={styles.friendRequests}>
                      <TextComponent type="secondary">
                        Pending requests
                      </TextComponent>
                      {friendRequestsList.map((request) => (
                        <div
                          key={request.netId}
                          className={styles.friendRequestItem}
                        >
                          <Link
                            to={`/u/${request.netId}`}
                            className={styles.friendProfileLink}
                          >
                            <TextComponent>
                              {request.name || request.netId}
                            </TextComponent>
                          </Link>
                          <div className={styles.friendActions}>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => {
                                void addFriend(request.netId);
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => {
                                void removeFriend(request.netId, true);
                              }}
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!friendsLoading && friendsList.length === 0 ? (
                    <TextComponent type="secondary" className="mt-1">
                      No friends yet
                    </TextComponent>
                  ) : !friendsLoading ? (
                    <div className={styles.friendsList}>
                      {friendsList.map(([friendNetId, friendData]) => (
                        <div key={friendNetId} className={styles.friendItem}>
                          <div className={styles.friendDetails}>
                            <Link
                              to={`/u/${friendNetId}`}
                              className={styles.friendProfileLink}
                            >
                              <TextComponent className={styles.friendName}>
                                {friendData.name || friendNetId}
                              </TextComponent>
                            </Link>
                            <TextComponent
                              type="secondary"
                              className={styles.friendNetId}
                            >
                              {friendNetId}
                            </TextComponent>
                          </div>
                          <div className={styles.friendActions}>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                handleRemoveFriend(friendNetId as NetId)
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Card.Body>
              </Card>

              <Card className={styles.profileCard}>
                <Card.Body className={clsx(styles.cardBody, styles.scrollCard)}>
                  <h3 className={styles.sectionTitle}>Worksheets</h3>
                  {!worksheetsLoading && selectedWorksheetOption && (
                    <div className={styles.friendForm}>
                      <Popout
                        key={selectedWorksheetOption.value}
                        buttonText={selectedWorksheetOption.label}
                        clearIcon={false}
                        fullWidth
                      >
                        <PopoutSelect<Option<number>, false>
                          value={selectedWorksheetOption}
                          options={worksheetOptions}
                          showControl={false}
                          minWidth={0}
                          onChange={(option) => {
                            if (option) setProfileWorksheetNumber(option.value);
                          }}
                        />
                      </Popout>
                    </div>
                  )}
                  {worksheetsLoading ? (
                    <TextComponent type="secondary">
                      Loading worksheets...
                    </TextComponent>
                  ) : profileWorksheetCatalogError ? (
                    <TextComponent type="secondary">
                      Failed to load worksheet.
                    </TextComponent>
                  ) : sortedWorksheetCourses.length === 0 ? (
                    <TextComponent type="secondary">
                      No courses yet
                    </TextComponent>
                  ) : (
                    <ul className="ps-3 my-2">
                      {sortedWorksheetCourses.map(({ listing, crn }) => (
                        <li key={crn}>
                          <Link
                            to={createCourseModalLink(listing, searchParams)}
                            className={styles.friendLink}
                          >
                            <TextComponent>
                              {listing.course.title}
                            </TextComponent>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </Tab>
        <Tab eventKey="privacy" title="Settings">
          <div className={styles.tabContent}>
            <Card className={clsx(styles.profileCard, 'mb-3')}>
              <Card.Body className={styles.cardBody}>
                {!privacyDraft ? (
                  <TextComponent type="secondary">
                    Loading profile settings...
                  </TextComponent>
                ) : (
                  <>
                    <section className={styles.settingsSection}>
                      <TextComponent className={styles.settingsSectionTitle}>
                        Preferences
                      </TextComponent>
                      <div
                        className={clsx(
                          styles.settingsSectionFields,
                          styles.settingsSectionFieldsTwoCol,
                        )}
                      >
                        <Form.Group
                          controlId="preferredFirstName"
                          className={styles.compactField}
                        >
                          <Form.Label>Preferred first name</Form.Label>
                          <Form.Control
                            value={preferredFirstNameInput}
                            maxLength={256}
                            onChange={(event) =>
                              setPreferredFirstNameInput(event.target.value)
                            }
                            placeholder={
                              legalFirstPlaceholder.trim().length > 0
                                ? `Legal: ${legalFirstPlaceholder}`
                                : 'Optional'
                            }
                          />
                        </Form.Group>
                        <Form.Group
                          controlId="preferredLastName"
                          className={styles.compactField}
                        >
                          <Form.Label>Preferred last name</Form.Label>
                          <Form.Control
                            value={preferredLastNameInput}
                            maxLength={256}
                            onChange={(event) =>
                              setPreferredLastNameInput(event.target.value)
                            }
                            placeholder={
                              legalLastPlaceholder.trim().length > 0
                                ? `Legal: ${legalLastPlaceholder}`
                                : 'Optional'
                            }
                          />
                        </Form.Group>
                        {(legalFirstPlaceholder.trim().length > 0 ||
                          legalLastPlaceholder.trim().length > 0) && (
                          <Form.Text muted className="d-block">
                            Legal name on file:{' '}
                            {`${legalFirstPlaceholder} ${legalLastPlaceholder}`.trim()}
                          </Form.Text>
                        )}
                      </div>
                    </section>
                    <section className={styles.settingsSection}>
                      <TextComponent className={styles.settingsSectionTitle}>
                        Visibility
                      </TextComponent>
                      {privacyDraft.nameVisibility !== 'public' && (
                        <TextComponent
                          type="secondary"
                          className={styles.visibilityDisclaimer}
                        >
                          Because your name is not public, students who are not
                          your friends will only see your NetID when you send
                          them a friend request. The same applies in the other
                          direction: if someone requests you, you may only see
                          their NetID until you are friends, depending on their
                          privacy settings.
                        </TextComponent>
                      )}
                      <div
                        className={clsx(
                          styles.settingsSectionFields,
                          styles.privacyGrid,
                        )}
                      >
                        {visibilityLabels.map(({ value, label }) => (
                          <div key={value} className={styles.privacyRow}>
                            <TextComponent className={styles.privacyLabel}>
                              {label}
                            </TextComponent>
                            <div className={styles.visibilityOptions}>
                              {visibilityOptions.map((option) => {
                                const optionId = `${value}-${option.value}`;
                                return (
                                  <Form.Check
                                    key={option.value}
                                    inline
                                    type="radio"
                                    id={optionId}
                                    name={`visibility-${value}`}
                                    label={option.label}
                                    checked={
                                      privacyDraft[value] === option.value
                                    }
                                    onChange={() => {
                                      setPrivacyDraft({
                                        ...privacyDraft,
                                        [value]: option.value,
                                      });
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                    <div className={styles.settingsActions}>
                      <Button
                        variant="primary"
                        onClick={handleSaveProfileSettings}
                        disabled={savingProfile}
                      >
                        {savingProfile ? 'Saving...' : 'Save profile settings'}
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        </Tab>
        <Tab eventKey="advanced" title="Advanced">
          <div className={styles.tabContent}>
            <Card className={styles.profileCard}>
              <Card.Body className={styles.cardBody}>
                <h3 className={styles.sectionTitle}>Advanced Settings</h3>
                <div className={styles.settingsRow}>
                  <div className={styles.settingText}>
                    <TextComponent>Clear cached catalog data</TextComponent>
                    <TextComponent type="secondary">
                      Forces a re-fetch of the catalog if your browser cached an
                      incomplete response.
                    </TextComponent>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className={styles.settingsButton}
                    onClick={handleCatalogCacheRefresh}
                    disabled={catalogRefreshing}
                  >
                    {catalogRefreshing ? 'Refreshing...' : 'Clear cache'}
                  </Button>
                </div>
                {currentUser.hasEvals && (
                  <div className={clsx(styles.settingsRow, styles.dangerRow)}>
                    <div className={styles.settingText}>
                      <TextComponent>Revoke evaluations access</TextComponent>
                      <TextComponent type="secondary">
                        You will lose access to evaluation data until access is
                        restored.
                      </TextComponent>
                      <Form.Check
                        id="revoke-confirm"
                        type="checkbox"
                        label="I understand and want to revoke access."
                        checked={revokeConfirmed}
                        onChange={(event) => {
                          setRevokeConfirmed(event.target.checked);
                          if (!event.target.checked) setRevokeArmed(false);
                        }}
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      className={styles.settingsButton}
                      onClick={handleRevokeEvaluations}
                      disabled={revokingEvals || !revokeConfirmed}
                      style={{
                        cursor:
                          revokingEvals || !revokeConfirmed
                            ? 'not-allowed'
                            : 'pointer',
                      }}
                    >
                      {revokingEvals
                        ? 'Revoking...'
                        : revokeArmed
                          ? 'Confirm revoke'
                          : 'Revoke access'}
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Profile;
