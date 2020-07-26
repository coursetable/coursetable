import React from 'react';

import styles from './MeDropdown.module.css';
import { Row, Col, Collapse } from 'react-bootstrap';
import { FaFacebookSquare } from 'react-icons/fa';
import { FcCalendar } from 'react-icons/fc';
import FBLoginButton from './FBLoginButton'
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

function MeDropdown(props) {
  const handleFBClick = () => {
    // LOGIN/LOGOUT OF FACEBOOK
  };

  const handleExportClick = () => {
    // EXPORT WORKSHEET TO ICS FILE
  };

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
          <Row className=" py-3 m-auto">
            <FcCalendar className="mr-2 my-auto" size={20} />
            <span onClick={handleExportClick} className={styles.collapse_text}>
              Export Worksheet
            </span>
          </Row>
          <Row className=" pb-3 m-auto">
            <FaFacebookSquare
              className="mr-2 my-auto"
              size={20}
              color="#007bff"
            />
            <FBLoginButton
              className={styles.collapse_text}
            >
            </FBLoginButton>
          </Row>
          <Row className=" pb-3 m-auto">
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
