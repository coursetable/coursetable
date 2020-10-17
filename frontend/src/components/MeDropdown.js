import React, { useState, useEffect } from 'react';

import styles from './MeDropdown.module.css';
import { Row, Col, Collapse } from 'react-bootstrap';
import { FaFacebookSquare } from 'react-icons/fa';
import { FcCalendar } from 'react-icons/fc';
import FBLoginButton from './FBLoginButton';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { generateICS } from './GenerateICS';
import { useUser } from '../user';
import { flatten } from '../utilities';
import { FetchWorksheetLazy } from '../queries/GetWorksheetListings';
import { preprocess_courses } from '../utilities';

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
  // Season to export classes from
  const CUR_SEASON = '202003';

  // Make sure worksheet is loaded
  if (user.worksheet) {
    // Initialize the lazy query function
    var [fetchWorksheetListings, { data }] = FetchWorksheetLazy(
      user.worksheet,
      CUR_SEASON
    );
  }

  // Handle 'export worksheet' button clikc
  const handleExportClick = () => {
    // Call the lazy query function to fetch listing data for the worksheet
    fetchWorksheetListings();
    // Start export process
    setExport(true);
  };

  // Variable used in useEffect to be statically checked
  const fetched_data = data ? data : [];
  // Called when worksheet updates or export_ics changes
  useEffect(() => {
    // return if worksheet isn't loaded or it isn't time to export
    if (fetched_data.length === 0 || !export_ics) return;
    // Preprocess listings data
    let processed_data = fetched_data.search_listing_info.map((x) => {
      return flatten(x);
    });
    processed_data = processed_data.map((x) => {
      return preprocess_courses(x);
    });
    // Generate and download ICS file
    generateICS(processed_data);
    // Reset export_ics state on completion
    setExport(false);
  }, [fetched_data, export_ics]);

  // Handle 'sign out' button click
  const handleLogoutClick = () => {
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
    <div className={styles.collapse_container} onClick={handleDropdownClick}>
      <Collapse in={profile_expanded}>
        <Col className={styles.collapse_col + ' px-3'}>
          {/* Export Worksheet button */}
          {isLoggedIn && (
            <Row className=" py-3 m-auto">
              <FcCalendar className="mr-2 my-auto" size={20} />
              <span
                onClick={handleExportClick}
                className={styles.collapse_text}
              >
                Export Worksheet
              </span>
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
              <>
                <FaSignOutAlt
                  className="mr-2 my-auto"
                  size={20}
                  color="#ed5f5f"
                  style={{ paddingLeft: '2px' }}
                />
                <span
                  // href="/legacy_api/index.php?logout=1"
                  onClick={handleLogoutClick}
                  className={styles.collapse_text}
                >
                  Sign Out
                </span>
              </>
            </Row>
          ) : (
            <Row className=" py-3 m-auto">
              <>
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
                  Sign In
                </a>
              </>
            </Row>
          )}
        </Col>
      </Collapse>
    </div>
  );
}

export default MeDropdown;
