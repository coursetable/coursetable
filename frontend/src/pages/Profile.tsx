import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { Button, Card } from 'react-bootstrap';
import { BsFillPersonFill } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';
import { Popout } from '../components/Search/Popout';
import { PopoutSelect } from '../components/Search/PopoutSelect';
import { TextComponent } from '../components/Typography';
import AddFriendDropdown from '../components/Worksheet/AddFriendDropdown';
import type { Option } from '../contexts/searchContext';
import type { NetId } from '../queries/graphql-types';
import { useStore, type Store } from '../store';
import { createCourseModalLink } from '../utilities/display';
import styles from './Profile.module.css';

const selectProfileStore = (state: Store) => ({
  user: state.user,
  userRefresh: state.userRefresh,
  worksheets: state.worksheets,
  worksheetsRefresh: state.worksheetsRefresh,
  worksheetCourses: state.courses,
  worksheetLoading: state.worksheetLoading,
  worksheetError: state.worksheetError,
  friends: state.friends,
  friendRequests: state.friendRequests,
  friendRefresh: state.friendRefresh,
  friendReqRefresh: state.friendReqRefresh,
  removeFriend: state.removeFriend,
  addFriend: state.addFriend,
  viewedSeason: state.viewedSeason,
  viewedWorksheetNumber: state.viewedWorksheetNumber,
  changeViewedWorksheetNumber: state.changeViewedWorksheetNumber,
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
    worksheetCourses,
    worksheetLoading,
    worksheetError,
    friends,
    friendRequests,
    friendRefresh,
    friendReqRefresh,
    removeFriend,
    addFriend,
    viewedSeason,
    viewedWorksheetNumber,
    changeViewedWorksheetNumber,
  } = useStore(useShallow(selectProfileStore));

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!currentUser) void userRefresh();
    if (!worksheets) void worksheetsRefresh();
    if (!friends) void friendRefresh();
    if (!friendRequests) void friendReqRefresh();
  }, [
    currentUser,
    userRefresh,
    worksheets,
    worksheetsRefresh,
    friends,
    friendRefresh,
    friendRequests,
    friendReqRefresh,
  ]);

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
      [...worksheetCourses].sort((a, b) =>
        alphaSort(a.listing.course.title, b.listing.course.title),
      ),
    [worksheetCourses],
  );

  const selectedWorksheetOption = useMemo(
    () =>
      worksheetOptions.find(
        (option) => option.value === viewedWorksheetNumber,
      ) ??
      worksheetOptions[0] ??
      null,
    [worksheetOptions, viewedWorksheetNumber],
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
  const worksheetsLoading = !worksheets || worksheetLoading;

  const handleRemoveFriend = (friendNetId: NetId) => {
    void removeFriend(friendNetId, false);
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
                {currentUser.year ? String(currentUser.year) : 'Not available'}
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
              <TextComponent type="secondary">Loading friends...</TextComponent>
            )}

            {!friendsLoading && friendRequestsList.length > 0 && (
              <div className={styles.friendRequests}>
                <TextComponent type="secondary">Pending requests</TextComponent>
                {friendRequestsList.map((request) => (
                  <div key={request.netId} className={styles.friendRequestItem}>
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
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveFriend(friendNetId as NetId)}
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
                  className={styles.profileSelectButton}
                  wrapperClassName={styles.profileSelectWrapper}
                  dropdownClassName={styles.profileSelectDropdown}
                >
                  <PopoutSelect<Option<number>, false>
                    value={selectedWorksheetOption}
                    options={worksheetOptions}
                    showControl={false}
                    minWidth={0}
                    onChange={(option) => {
                      if (option) changeViewedWorksheetNumber(option.value);
                    }}
                  />
                </Popout>
              </div>
            )}
            {worksheetsLoading ? (
              <TextComponent type="secondary">
                Loading worksheets...
              </TextComponent>
            ) : worksheetError ? (
              <TextComponent type="secondary">
                Failed to load worksheet.
              </TextComponent>
            ) : sortedWorksheetCourses.length === 0 ? (
              <TextComponent type="secondary">No courses yet</TextComponent>
            ) : (
              <ul className="ps-3 my-2">
                {sortedWorksheetCourses.map(({ listing, crn }) => (
                  <li key={crn}>
                    <Link
                      to={createCourseModalLink(listing, searchParams)}
                      className={styles.friendLink}
                    >
                      <TextComponent>{listing.course.title}</TextComponent>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
