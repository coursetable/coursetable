import React, { useState, useEffect, useMemo } from 'react';
import posthog from 'posthog-js';
import styles from './MeDropdown.module.css';
import { Row, Col, Collapse } from 'react-bootstrap';
import { FaFacebookSquare } from 'react-icons/fa';
import { FcCalendar, FcUndo } from 'react-icons/fc';
import FBLoginButton from './FBLoginButton';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { generateICS } from './GenerateICS';
import { useUser } from '../user';
import { useWorksheetInfo } from '../queries/GetWorksheetListings';
import {
  SurfaceComponent,
  TextComponent,
  StyledHoverText,
} from './StyledComponents';

// Season to export classes from
const CUR_SEASON = '202101';

/**
 * Renders the dropdown when clicking on the profile dropdown in the navbar
 * @prop profile_expanded - boolean | is dropdown visible?
 * @prop setIsComponentVisible - function that changes dropdown's visibility
 * @prop isLoggedIn - boolean | is user logged in?
 */

function MeDropdown({ profile_expanded, setIsComponentVisible, isLoggedIn }) {
  // Get user context data
  const { user } = useUser();
  // Are we exporting the user's worksheet?
  const [export_ics, setExport] = useState(false);

  const filtered_worksheet = useMemo(() => {
    return (user.worksheet || []).filter((item) => {
      return item[0] === CUR_SEASON;
    });
  }, [user.worksheet]);

  let { data } = useWorksheetInfo(filtered_worksheet);
  if (!data) data = [];

  // Handle 'export worksheet' button click
  const handleExportClick = () => {
    // Metric Tracking of Worksheet Export
    posthog.capture('worksheet-export', { component: 'MeDropdown' });

    // Start export process
    setExport(true);
  };

  // Called when worksheet updates or export_ics changes
  useEffect(() => {
    // return if worksheet isn't loaded or it isn't time to export
    if (!data || data.length === 0 || !export_ics) return;
    // Generate and download ICS file
    generateICS(data);
    // Reset export_ics state on completion
    setExport(false);
  }, [data, export_ics]);

  // Handle 'sign out' button click
  const handleLogoutClick = () => {
    posthog.capture('logout');
    posthog.reset();

    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    // Redirect to home page and refresh as well
    window.location.pathname = '/';
  };

  // Keep dropdown open on clicks
  const handleDropdownClick = () => {
    setIsComponentVisible(true);
  };
  return (
    <SurfaceComponent
      layer={1}
      className={styles.collapse_container}
      onClick={handleDropdownClick}
    >
      <Collapse in={profile_expanded}>
        {/* This wrapper div is important for making the collapse animation smooth */}
        <div>
          <Col className={styles.collapse_col + ' px-3 pt-3'}>
            {/* Revert to Old CourseTable Link */}
            <Row className=" pb-3 m-auto">
              <FcUndo
                className="mr-2 my-auto"
                size={20}
                style={{ paddingLeft: '2px' }}
              />
              <TextComponent type={1}>
                <a
                  href="https://old.coursetable.com/"
                  className={styles.collapse_text}
                >
                  <StyledHoverText>Old CourseTable</StyledHoverText>
                </a>
              </TextComponent>
            </Row>
            {/* Export Worksheet button */}
            {isLoggedIn && (
              <Row className=" pb-3 m-auto">
                <FcCalendar className="mr-2 my-auto" size={20} />
                <TextComponent
                  type={1}
                  onClick={handleExportClick}
                  className={styles.collapse_text}
                >
                  <StyledHoverText>Export Worksheet</StyledHoverText>
                </TextComponent>
              </Row>
            )}
            {/* Connect FB button */}
            {isLoggedIn && (
              <Row className=" pb-3 m-auto">
                <FaFacebookSquare
                  className="mr-2 my-auto"
                  size={20}
                  color="#007bff"
                />
                <FBLoginButton />
              </Row>
            )}
            {/* Sign In/Out button */}
            {isLoggedIn ? (
              <Row className=" pb-3 m-auto">
                <FaSignOutAlt
                  className="mr-2 my-auto"
                  size={20}
                  color="#ed5f5f"
                  style={{ paddingLeft: '2px' }}
                />
                <TextComponent
                  type={1}
                  // href="/legacy_api/index.php?logout=1"
                  onClick={handleLogoutClick}
                  className={styles.collapse_text}
                >
                  <StyledHoverText>Sign Out</StyledHoverText>
                </TextComponent>
              </Row>
            ) : (
              <Row className=" pb-3 m-auto">
                <FaSignInAlt
                  className="mr-2 my-auto"
                  size={20}
                  color="#30e36b"
                  style={{ paddingLeft: '2px' }}
                />
                <a
                  href="/legacy_api/index.php?forcelogin=1"
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
