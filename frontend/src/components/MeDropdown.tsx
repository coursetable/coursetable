import React, { useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { Row, Col, Collapse } from 'react-bootstrap';
import { FaFacebookSquare, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { FcCalendar, FcUndo, FcInfo, FcQuestions } from 'react-icons/fc';
import FBLoginButton from './FBLoginButton';

import styles from './MeDropdown.module.css';
import { generateICS } from './GenerateICS';
import { useUser } from '../user';
import { useWorksheetInfo } from '../queries/GetWorksheetListings';
import { logout } from '../utilities';
import {
  SurfaceComponent,
  TextComponent,
  StyledHoverText,
} from './StyledComponents';
import { NavLink } from 'react-router-dom';

// Season to export classes from
const CUR_SEASON = '202101';

type Props = {
  /** Is dropdown visible? */
  profile_expanded: boolean;

  /** Function that changes dropdown visibility */
  setIsComponentVisible(visible: boolean): void;

  /** Is user logged in? */
  isLoggedIn: boolean;

  onNavLinkClick(
    event: React.MouseEvent<Element, MouseEvent>,
    catalog: boolean
  ): void;
};

/**
 * Renders the dropdown when clicking on the profile dropdown in the navbar
 */
const MeDropdown: React.VFC<Props> = ({
  profile_expanded,
  setIsComponentVisible,
  isLoggedIn,
  onNavLinkClick,
}) => {
  // Get user context data
  const { user } = useUser();
  // Are we exporting the user's worksheet?
  const [export_ics, setExport] = useState(false);

  let { data } = useWorksheetInfo(user.worksheet, CUR_SEASON);
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
          <Col className="px-3 pt-3">
            {isLoggedIn && (
              <>
                {/* About page Link */}
                <Row className=" pb-3 m-auto">
                  <FcInfo
                    className="mr-2 my-auto"
                    size={20}
                    style={{ paddingLeft: '2px' }}
                  />
                  <TextComponent type={1}>
                    <NavLink
                      to="/about"
                      // Left align about link if not mobile
                      className={styles.collapse_text}
                      onClick={(event) => {
                        onNavLinkClick(event, false);
                      }}
                    >
                      <StyledHoverText>About</StyledHoverText>
                    </NavLink>
                  </TextComponent>
                </Row>
                {/* FAQ page Link */}
                <Row className=" pb-3 m-auto">
                  <FcQuestions
                    className="mr-2 my-auto"
                    size={20}
                    style={{ paddingLeft: '2px' }}
                  />
                  <TextComponent type={1}>
                    <NavLink
                      to="/faq"
                      // Left align about link if not mobile
                      className={styles.collapse_text}
                      onClick={(event) => {
                        onNavLinkClick(event, false);
                      }}
                    >
                      <StyledHoverText>FAQ</StyledHoverText>
                    </NavLink>
                  </TextComponent>
                </Row>
              </>
            )}
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
                  onClick={logout}
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
                  href="/api/auth/cas?redirect=catalog"
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
};

export default MeDropdown;
