import React, { useState, useEffect } from 'react';

import styles from './MeDropdown.module.css';
import { Row, Col, Collapse } from 'react-bootstrap';
import { FaFacebookSquare } from 'react-icons/fa';
import { FcCalendar } from 'react-icons/fc';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { generateICS } from './GenerateICS';
import { useUser } from '../user';
import { flatten } from '../utilities';
import {
  FetchWorksheetLazy,
  preprocess_courses,
} from '../queries/GetWorksheetListings';

function MeDropdown(props) {
  const { user } = useUser();
  const [export_ics, setExport] = useState(false);

  if (user.worksheet) {
    var [fetchWorksheetListings, { data }] = FetchWorksheetLazy(
      user.worksheet,
      props.season_code
    );
  }

  const handleFBClick = () => {
    // LOGIN/LOGOUT OF FACEBOOK
  };

  const handleExportClick = () => {
    fetchWorksheetListings();
    setExport(true);
  };

  useEffect(() => {
    if (!data || !export_ics) return;
    data = data.listings.map((x) => {
      return flatten(x);
    });
    data = data.map((x) => {
      return preprocess_courses(x);
    });
    // EXPORT WORKSHEET TO ICS FILE
    generateICS(data);
    setExport(false);
  }, [data ? data : [], export_ics]);

  const handleLogoutClick = () => {
    // Sign Out
    window.location.href = '/legacy_api/index.php?logout=1';

    // SOMEHOW GO BACK TO HOME PAGE AFTER LOGOUT
  };

  const handleDropdownClick = () => {
    props.setIsComponentVisible(true);
  };
  return (
    <div className={styles.collapse_container} onClick={handleDropdownClick}>
      <Collapse in={props.profile_expanded}>
        <Col className={styles.collapse_col + ' px-3'}>
          {props.isLoggedIn && (
            <>
              <Row className=" py-3 m-auto">
                <FcCalendar className="mr-2 my-auto" size={20} />
                <span
                  onClick={handleExportClick}
                  className={styles.collapse_text}
                >
                  Export Worksheet
                </span>
              </Row>

              <Row className=" pb-3 m-auto">
                <FaFacebookSquare
                  className="mr-2 my-auto"
                  size={20}
                  color="#007bff"
                />
                <span onClick={handleFBClick} className={styles.collapse_text}>
                  Connect FB
                </span>
              </Row>
            </>
          )}
          <Row className={' pb-3 m-auto ' + (!props.isLoggedIn ? 'pt-3' : '')}>
            {props.isLoggedIn ? (
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
            ) : (
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
            )}
          </Row>
        </Col>
      </Collapse>
    </div>
  );
}

export default MeDropdown;
