import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { ToggleButton, ToggleButtonGroup, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AddFriendDropdown from './AddFriendDropdown';
import FriendsDropdown from './FriendsDropdown';
import SeasonDropdown from './SeasonDropdown';
import WorksheetNumDropdown from './WorksheetNumberDropdown';

import { useWorksheet, WorksheetCourse } from '../../contexts/worksheetContext';
import type { NetId } from '../../queries/graphql-types';
import { useStore } from '../../store';
import { LinkLikeText } from '../Typography';
import styles from './NavbarWorksheetSearch.module.css';

export function NavbarWorksheetSearch() {
  const {
    worksheetView,
    changeWorksheetView,
    viewedPerson,
    changeViewedPerson,
  } = useWorksheet();
  const [searchParams, setSearchParams] = useSearchParams();

  const removeFriend = useStore((state) => state.removeFriend);

  const removeFriendWithConfirmation = useCallback(
    (friendNetId: NetId, isRequest: boolean) =>
      new Promise<void>((resolve) => {
        toast.warn(
          <>
            You are about to {isRequest ? 'decline a request from' : 'remove'}{' '}
            {friendNetId}.{' '}
            <b>This is irreversible without another friend request.</b> Do you
            want to continue?
            <br />
            <LinkLikeText
              className="mx-2"
              onClick={async () => {
                if (!isRequest && viewedPerson === friendNetId)
                  changeViewedPerson('me');
                await removeFriend(friendNetId, isRequest);
                resolve();
                toast.dismiss(`remove-${friendNetId}`);
              }}
            >
              Yes
            </LinkLikeText>
            <LinkLikeText
              className="mx-2"
              onClick={() => {
                toast.dismiss(`remove-${friendNetId}`);
                resolve();
              }}
            >
              No
            </LinkLikeText>
          </>,
          { autoClose: false, toastId: `remove-${friendNetId}` },
        );
      }),
    [changeViewedPerson, viewedPerson, removeFriend],
  );

  return (
    <div className="d-flex align-items-center">
      {/* Worksheet View Toggle */}
      <ToggleButtonGroup
        name="worksheet-view-toggle"
        type="radio"
        value={worksheetView}
        onChange={(val: 'calendar' | 'list') => changeWorksheetView(val)}
        className={clsx(styles.toggleButtonGroup, 'ms-2 me-3')}
        data-tutorial="worksheet-2"
      >
        <ToggleButton
          id="view-toggle-calendar"
          className={styles.toggleButton}
          value="calendar"
        >
          Calendar
        </ToggleButton>
        <ToggleButton
          id="view-toggle-list"
          className={styles.toggleButton}
          value="list"
        >
          List
        </ToggleButton>
      </ToggleButtonGroup>
      {!searchParams.get('ws') ? (
        <>
          <SeasonDropdown mobile={false} />
          <WorksheetNumDropdown mobile={false} />
          <FriendsDropdown
            mobile={false}
            removeFriend={removeFriendWithConfirmation}
          />
          <AddFriendDropdown
            mobile={false}
            removeFriend={removeFriendWithConfirmation}
          />
        </>
      ) : (
        <>
          <div className={styles.wide}>
            <Button
              variant="primary"
              onClick={() => {
                setSearchParams({});
                window.location.reload();
              }}
            >
              Exit
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
