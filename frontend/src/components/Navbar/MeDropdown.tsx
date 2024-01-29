import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Collapse } from 'react-bootstrap';
import { FcInfo, FcQuestions, FcFeedback, FcPuzzle } from 'react-icons/fc';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

import styles from './MeDropdown.module.css';
import { logout, scrollToTop } from '../../utilities/display';
import { SurfaceComponent, TextComponent, HoverText } from '../Typography';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { API_ENDPOINT } from '../../config';

type Props = {
  readonly profileExpanded: boolean;
  readonly setIsComponentVisible: (visible: boolean) => void;
  readonly isLoggedIn: boolean;
  readonly setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setShownTutorial: React.Dispatch<React.SetStateAction<boolean>>;
};

function MeDropdown({
  profileExpanded,
  setIsComponentVisible,
  isLoggedIn,
  setIsTutorialOpen,
  setShownTutorial,
}: Props) {
  // Fetch current device
  const { isMobile, isTablet } = useWindowDimensions();

  return (
    <SurfaceComponent
      elevated
      className={styles.collapseContainer}
      onClick={() => {
        setIsComponentVisible(true);
      }}
    >
      <Collapse in={profileExpanded}>
        {/* This wrapper div is important for making the collapse animation
          smooth */}
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
                  <TextComponent type="secondary">
                    <NavLink
                      to="/about"
                      className={styles.collapseText}
                      onClick={scrollToTop}
                    >
                      <HoverText>About</HoverText>
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
                  <TextComponent type="secondary">
                    <NavLink
                      to="/faq"
                      className={styles.collapseText}
                      onClick={scrollToTop}
                    >
                      <HoverText>FAQ</HoverText>
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
              <TextComponent type="secondary">
                <a
                  href="https://feedback.coursetable.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.collapseText}
                  onClick={scrollToTop}
                >
                  <HoverText>Feedback</HoverText>
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
                <TextComponent type="secondary">
                  <NavLink
                    to="/catalog"
                    className={styles.collapseText}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToTop(e);
                      setIsTutorialOpen(true);
                      setShownTutorial(false);
                    }}
                  >
                    <HoverText>Tutorial</HoverText>
                  </NavLink>
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
                  type="secondary"
                  onClick={logout}
                  className={styles.collapseText}
                >
                  <HoverText>Sign Out</HoverText>
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
                  className={styles.collapseText}
                >
                  <TextComponent type="secondary">
                    <HoverText>Sign In</HoverText>
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
