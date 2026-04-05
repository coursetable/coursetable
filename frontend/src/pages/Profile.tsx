import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import clsx from 'clsx';
import { Button, Card, Spinner, Tab, Tabs } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import { Popout } from '../components/Search/Popout';
import { PopoutSelect } from '../components/Search/PopoutSelect';
import { TextComponent } from '../components/Typography';
import WishlistItems from '../components/Wishlist/WishlistItems';
import AddFriendDropdown from '../components/Worksheet/AddFriendDropdown';
import { resetCatalogCache } from '../ferry/ferryCatalogCache';
import { useFerry, useWorksheetInfo } from '../hooks/useFerry';
import type { NetId } from '../queries/graphql-types';
import type { Option } from '../search/searchTypes';
import { useWishlist } from '../search/wishlistContext';
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

  const [catalogRefreshing, setCatalogRefreshing] = useState(false);

  const [profileWorksheetNumber, setProfileWorksheetNumber] = useState(
    () => useStore.getState().viewedWorksheetNumber,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const profileTabParam = searchParams.get('tab');
  const activeProfileTab =
    profileTabParam === 'wishlist' || profileTabParam === 'advanced'
      ? profileTabParam
      : 'overview';

  const { wishlistLoading, wishlistError, wishlistCourses } = useWishlist();

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
    if (wishlistError) Sentry.captureException(wishlistError);
  }, [wishlistError]);

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
        activeKey={activeProfileTab}
        onSelect={(k) => {
          if (k === null) return;
          const next = new URLSearchParams(searchParams);
          if (k === 'overview') next.delete('tab');
          else next.set('tab', k);
          setSearchParams(next, { replace: true });
        }}
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
                          <TextComponent>
                            {request.name || request.netId}
                          </TextComponent>
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
                            <TextComponent className={styles.friendName}>
                              {friendData.name || friendNetId}
                            </TextComponent>
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
        <Tab eventKey="wishlist" title="Wishlist">
          <div className={styles.tabContent}>
            <Card className={styles.profileCard}>
              <Card.Body className={styles.cardBody}>
                <h3 className={styles.sectionTitle}>Wishlist</h3>
                <TextComponent
                  type="secondary"
                  className={styles.wishlistIntro}
                >
                  Courses you bookmark appear here. Use the bookmark icon on a
                  course to add or remove them.
                </TextComponent>
                {wishlistError ? (
                  <TextComponent type="secondary">
                    Couldn&apos;t load your wishlist. Try again later.
                  </TextComponent>
                ) : wishlistLoading ? (
                  <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" aria-label="Loading wishlist" />
                  </div>
                ) : (
                  <WishlistItems
                    data={wishlistCourses}
                    courseLinkClassName={styles.friendLink}
                  />
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
              </Card.Body>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Profile;
