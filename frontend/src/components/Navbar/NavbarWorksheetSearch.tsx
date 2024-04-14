import React, { useCallback } from 'react';
import clsx from 'clsx';
import { Form, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { LinkLikeText } from '../Typography';
import FriendsDropdown from '../Worksheet/FriendsDropdown';
import SeasonDropdown from '../Worksheet/SeasonDropdown';
import WorksheetNumDropdown from '../Worksheet/WorksheetNumberDropdown';
import AddFriendDropdown from '../Worksheet/AddFriendDropdown';

import { useWorksheet } from '../../contexts/worksheetContext';
import { useUser } from '../../contexts/userContext';
import type { NetId } from '../../utilities/common';
import styles from './NavbarWorksheetSearch.module.css';

export function NavbarWorksheetSearch() {
  const { worksheetView, handleWorksheetView, person, handlePersonChange } =
    useWorksheet();

  const { removeFriend } = useUser();

  const removeFriendWithConfirmation = useCallback(
    (friendNetId: NetId, isRequest: boolean) => {
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
              if (!isRequest && person === friendNetId)
                handlePersonChange('me');
              await removeFriend(friendNetId, isRequest);
              toast.dismiss(`remove-${friendNetId}`);
            }}
          >
            Yes
          </LinkLikeText>
          <LinkLikeText
            className="mx-2"
            onClick={() => {
              toast.dismiss(`remove-${friendNetId}`);
            }}
          >
            No
          </LinkLikeText>
        </>,
        { autoClose: false, toastId: `remove-${friendNetId}` },
      );
    },
    [handlePersonChange, person, removeFriend],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  return (
    <>
      {/* Filters Form, no form needs reload i think */}
      <Form onSubmit={handleSubmit} className="px-0" data-tutorial="">
        <Row className={styles.row}>
          <div className="d-flex align-items-center">
            {/* Worksheet View Toggle */}
            <ToggleButtonGroup
              name="worksheet-view-toggle"
              type="radio"
              value={worksheetView}
              onChange={(val: 'calendar' | 'list') => handleWorksheetView(val)}
              className={clsx(styles.toggleButtonGroup, 'ml-2 mr-3')}
              data-tutorial="worksheet-2"
            >
              <ToggleButton className={styles.toggleButton} value="calendar">
                Calendar
              </ToggleButton>
              <ToggleButton className={styles.toggleButton} value="list">
                List
              </ToggleButton>
            </ToggleButtonGroup>
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
          </div>
        </Row>
      </Form>
    </>
  );
}
