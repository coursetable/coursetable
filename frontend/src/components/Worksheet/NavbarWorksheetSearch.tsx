// Src/components/Worksheet/NavbarWorksheetSearch.tsx
import React, { useCallback } from 'react';
import clsx from 'clsx';
import { ToggleButton, ToggleButtonGroup, Button } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';
import AddFriendDropdown from './AddFriendDropdown';
import FriendsDropdown from './FriendsDropdown';
import SeasonDropdown from './SeasonDropdown';
import WorksheetNumDropdown from './WorksheetNumberDropdown';
import { useStore } from '../../store';
import { LinkLikeText } from '../Typography';
import styles from './NavbarWorksheetSearch.module.css';

export interface EnumerationControlsProps {
  enumerationMode: boolean;
  toggleEnumerationMode: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  currentIndex: number;
  totalCombos: number;
}

interface NavbarWorksheetSearchProps {
  readonly enumerationControls?: EnumerationControlsProps;
}

export function NavbarWorksheetSearch({
  enumerationControls,
}: NavbarWorksheetSearchProps) {
  const {
    worksheetView,
    changeWorksheetView,
    viewedPerson,
    changeViewedPerson,
    isExoticWorksheet,
    exitExoticWorksheet,
  } = useStore(
    useShallow((state) => ({
      worksheetView: state.worksheetView,
      changeWorksheetView: state.changeWorksheetView,
      viewedPerson: state.viewedPerson,
      changeViewedPerson: state.changeViewedPerson,
      isExoticWorksheet: state.isExoticWorksheet,
      exitExoticWorksheet: state.exitExoticWorksheet,
    })),
  );

  const { authStatus, removeFriend } = useStore(
    useShallow((state) => ({
      removeFriend: state.removeFriend,
      authStatus: state.authStatus,
    })),
  );

  const removeFriendWithConfirmation = useCallback(
    (friendNetId: string, isRequest: boolean) =>
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

  if (authStatus !== 'authenticated' && !isExoticWorksheet()) return null;

  return (
    <div className="d-flex align-items-center">
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
      {!isExoticWorksheet() ? (
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
        <div>
          <Button variant="primary" onClick={exitExoticWorksheet}>
            Exit
          </Button>
        </div>
      )}
      {/* Enumeration Mode Controls */}
      {enumerationControls && (
        <div className={clsx(styles.enumerationControls, 'ms-3')}>
          <Button
            variant="outline-secondary"
            onClick={enumerationControls.toggleEnumerationMode}
            className={styles.enumToggleButton}
            aria-label="Toggle Enumeration Mode"
          >
            {enumerationControls.enumerationMode
              ? 'Disable Enum'
              : 'Enable Enum'}
          </Button>
          {enumerationControls.enumerationMode && (
            <div className={styles.arrowControls}>
              <Button
                variant="outline-secondary"
                onClick={enumerationControls.handlePrevious}
                className={styles.prevButton}
                aria-label="Previous Combination"
                disabled={enumerationControls.currentIndex === 0}
              >
                <FaArrowLeft />
              </Button>
              <Button
                variant="outline-secondary"
                onClick={enumerationControls.handleNext}
                className={styles.nextButton}
                aria-label="Next Combination"
              >
                <FaArrowRight />
              </Button>
              <div className={styles.indexDisplay}>
                {enumerationControls.currentIndex + 1}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NavbarWorksheetSearch;
