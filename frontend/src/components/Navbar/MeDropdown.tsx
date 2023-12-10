import React, { useState, useEffect } from 'react';
import { Row, Col, Collapse } from 'react-bootstrap';
import {
  FcCalendar,
  FcInfo,
  FcQuestions,
  FcFeedback,
  FcPuzzle,
} from 'react-icons/fc';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';
import FileSaver from 'file-saver';

import styles from './MeDropdown.module.css';
import { useUser } from '../../contexts/userContext';
import { useWorksheetInfo } from '../../queries/GetWorksheetListings';
import { logout, scrollToTop } from '../../utilities';
import { generateICS } from '../../utilities/calendar';
import {
  SurfaceComponent,
  TextComponent,
  StyledHoverText,
} from '../StyledComponents';
import { NavLink } from 'react-router-dom';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';

import { API_ENDPOINT } from '../../config';

// Season to export classes from
const CUR_SEASON = '202401';

type Props = {
  profile_expanded: boolean;
  setIsComponentVisible(visible: boolean): void;
  isLoggedIn: boolean;
  setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Renders the dropdown when clicking on the profile dropdown in the navbar
 * @prop profile_expanded - is dropdown visible?
 * @prop setIsComponentVisible - function that changes dropdown visibility
 * @prop isLoggedIn - is user logged in?
 * @prop setIsTutorialOpen - opens tutorial
 */
function MeDropdown({
  profile_expanded,
  setIsComponentVisible,
  isLoggedIn,
  setIsTutorialOpen,
}: Props) {
  // Fetch current device
  const { isMobile, isTablet } = useWindowDimensions();

  // Get user context data
  const { user } = useUser();

  // Are we exporting the user's worksheet?
  const [export_ics, setExport] = useState(false);
  const { data } = useWorksheetInfo(user.worksheet, CUR_SEASON);

  // Called when worksheet updates or export_ics changes
  useEffect(() => {
    // return if worksheet isn't loaded or it isn't time to export
    if (!data || data.length === 0 || !export_ics) return;
    // Generate and download ICS file
    generateICS(data)
      .then((value) => {
        // Download to user's computer
        const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
        FileSaver.saveAs(blob, 'worksheet.ics');
      })
      .catch((err) => {
        toast.error(
          'Error exporting worksheet: ' + (err.message ?? '<unknown>'),
        );
        Sentry.captureException(err);
      })
      .finally(() => {
        // Reset export_ics state on completion
        setExport(false);
      });
  }, [data, export_ics]);

  return (
    <SurfaceComponent
      layer={1}
      className={styles.collapse_container}
      onClick={() => {
        setIsComponentVisible(true);
      }}
    >
      <Collapse in={profile_expanded}>
        {/* This wrapper div is important for making the collapse animation smooth */}
        <div>
          <Col className="px-3 pt-3">
            {isLoggedIn && (
              <>
                {/* About page Link */}
                <Row className="pb-3 m-auto">
                  <FcInfo
                    className="mr-2 my-auto"
                    size={20}
                    style={{ paddingLeft: '2px' }}
                  />
                  <TextComponent type={1}>
                    <NavLink
                      to="/about"
                      className={styles.collapse_text}
                      onClick={scrollToTop}
                    >
                      <StyledHoverText>About</StyledHoverText>
                    </NavLink>
                  </TextComponent>
                </Row>
                {/* FAQ page Link */}
                <Row className="pb-3 m-auto">
                  <FcQuestions
                    className="mr-2 my-auto"
                    size={20}
                    style={{ paddingLeft: '2px' }}
                  />
                  <TextComponent type={1}>
                    <NavLink
                      to="/faq"
                      className={styles.collapse_text}
                      onClick={scrollToTop}
                    >
                      <StyledHoverText>FAQ</StyledHoverText>
                    </NavLink>
                  </TextComponent>
                </Row>
              </>
            )}
            {/* Feedback page Link */}
            <Row className="pb-3 m-auto">
              <FcFeedback
                className="mr-2 my-auto"
                size={20}
                style={{ paddingLeft: '2px' }}
              />
              <TextComponent type={1}>
                <a
                  href={`https://feedback.coursetable.com/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.collapse_text}
                  onClick={scrollToTop}
                >
                  <StyledHoverText>Feedback</StyledHoverText>
                </a>
              </TextComponent>
            </Row>
            {/* Try tutorial only on desktop */}
            {!isMobile && !isTablet && isLoggedIn && (
              <Row className="pb-3 m-auto">
                <FcPuzzle
                  className="mr-2 my-auto"
                  size={20}
                  style={{ paddingLeft: '2px' }}
                />
                <TextComponent type={1}>
                  <NavLink
                    to="/catalog"
                    className={styles.collapse_text}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToTop(e);
                      setIsTutorialOpen(true);
                    }}
                  >
                    <StyledHoverText>Tutorial</StyledHoverText>
                  </NavLink>
                </TextComponent>
              </Row>
            )}
            {/* Export Worksheet button */}
            {isLoggedIn && (
              <Row className="pb-3 m-auto">
                <FcCalendar className="mr-2 my-auto" size={20} />
                <TextComponent
                  type={1}
                  onClick={() => {
                    // Start export process
                    setExport(true);
                  }}
                  className={styles.collapse_text}
                >
                  <StyledHoverText>Export Worksheet</StyledHoverText>
                </TextComponent>
              </Row>
            )}
            {/* Sign In/Out button */}
            {isLoggedIn ? (
              <Row className="pb-3 m-auto">
                <FaSignOutAlt
                  className="mr-2 my-auto"
                  size={20}
                  color="#ed5f5f"
                  style={{ paddingLeft: '2px' }}
                />
                <TextComponent
                  type={1}
                  onClick={logout}
                  className={styles.collapse_text}
                >
                  <StyledHoverText>Sign Out</StyledHoverText>
                </TextComponent>
              </Row>
            ) : (
              <Row className="pb-3 m-auto">
                <FaSignInAlt
                  className="mr-2 my-auto"
                  size={20}
                  color="#30e36b"
                  style={{ paddingLeft: '2px' }}
                />
                <a
                  href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`}
                  className={styles.collapse_text}
                >
                  <TextComponent type={1}>
                    <StyledHoverText>Sign In</StyledHoverText>
                  </TextComponent>
                </a>
              </Row>
            )}
          </Col>
        </div>
      </Collapse>
    </SurfaceComponent>
  );
}

export default MeDropdown;
