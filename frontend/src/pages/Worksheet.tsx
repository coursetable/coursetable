import React, { useCallback, useState } from 'react';
import { Row, Col, Fade, Spinner } from 'react-bootstrap';
import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa';
import * as Sentry from '@sentry/react';
import clsx from 'clsx';
import { toast } from 'react-toastify';

import WorksheetCalendar from '../components/Worksheet/WorksheetCalendar';
import WorksheetCalendarList from '../components/Worksheet/WorksheetCalendarList';
import WorksheetList from '../components/Worksheet/WorksheetList';
import { LinkLikeText, SurfaceComponent } from '../components/Typography';
import WorksheetNumDropdown from '../components/Worksheet/WorksheetNumberDropdown';
import SeasonDropdown from '../components/Worksheet/SeasonDropdown';
import FriendsDropdown from '../components/Worksheet/FriendsDropdown';
import { AddFriendDropdown } from '../components/Navbar/NavbarWorksheetSearch';
import styles from './Worksheet.module.css';

import ErrorPage from '../components/ErrorPage';

import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import { useWorksheet } from '../contexts/worksheetContext';
import { useUser } from '../contexts/userContext';
import type { NetId } from '../utilities/common';

function WorksheetMobile() {
  const {person, handlePersonChange } =
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

  return (
    <Row className={clsx(styles.accordion, 'm-0 p-3')}>
      <Col className="p-0">
        <Row className="mx-auto">
          <Col xs={6} className="m-0 p-0">
            <WorksheetNumDropdown />
          </Col>
          <Col xs={6} className="m-0 p-0">
            <AddFriendDropdown removeFriend={removeFriendWithConfirmation} />
          </Col>
          <Col xs={6} className="m-0 p-0">
            <SeasonDropdown />
          </Col>
          <Col xs={6} className="m-0 p-0">
            <FriendsDropdown />
          </Col>
        </Row>
        <SurfaceComponent className={styles.mobileCalendar}>
          <WorksheetCalendar />
        </SurfaceComponent>
        <WorksheetCalendarList />
      </Col>
    </Row>
  );
}

function WorksheetDesktop() {
  const { worksheetView } = useWorksheet();
  const [expanded, setExpanded] = useState(false);
  return (
    <Row className={worksheetView === 'list' ? 'mx-0' : 'mx-3 mb-3'}>
      <Col
        md={worksheetView === 'calendar' && expanded ? 12 : 9}
        className={clsx(
          'mt-3 pl-0',
          worksheetView === 'calendar' && expanded ? 'pr-0' : 'pr-3',
          worksheetView === 'list' && styles.hidden,
        )}
      >
        <SurfaceComponent className={styles.calendarContainer}>
          <WorksheetCalendar />
          <div className={clsx(styles.expandBtn, styles.topRight)}>
            {!expanded ? (
              <FaExpandAlt
                className={styles.expandIcon}
                size={12}
                style={{ display: 'block' }}
                onClick={() => {
                  setExpanded(true);
                }}
              />
            ) : (
              <FaCompressAlt
                className={styles.expandIcon}
                size={12}
                onClick={() => {
                  setExpanded(false);
                }}
              />
            )}
          </div>
        </SurfaceComponent>
      </Col>
      <Col
        md={worksheetView === 'list' ? 12 : 3}
        className={clsx(
          'ml-auto px-0',
          worksheetView === 'calendar' && expanded && styles.hidden,
        )}
      >
        <Fade in={worksheetView === 'list'}>
          <div
            style={{
              display: worksheetView === 'list' ? '' : 'none',
            }}
          >
            {worksheetView === 'list' && <WorksheetList />}
          </div>
        </Fade>
        <Fade in={worksheetView !== 'list'}>
          <div
            style={{
              display: worksheetView !== 'list' ? '' : 'none',
            }}
          >
            <WorksheetCalendarList />
          </div>
        </Fade>
      </Col>
    </Row>
  );
}

function Worksheet() {
  const { isMobile } = useWindowDimensions();
  const { worksheetLoading, worksheetError } = useWorksheet();

  // Wait for search query to finish
  if (worksheetError) {
    Sentry.captureException(worksheetError);
    return (
      <div style={{ height: '93vh', width: '100vw' }} className="d-flex">
        <ErrorPage message="There seems to be an issue with our server" />
      </div>
    );
  }
  if (worksheetLoading) {
    return (
      <div style={{ height: '93vh' }}>
        <Spinner
          className={styles.loadingSpinner}
          animation="border"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }
  // TODO: add something for when data.length === 0

  return (
    <div
      className={clsx(styles.container, !isMobile && styles.desktopContainer)}
    >
      {!isMobile ? <WorksheetDesktop /> : <WorksheetMobile />}
    </div>
  );
}

export default Worksheet;
