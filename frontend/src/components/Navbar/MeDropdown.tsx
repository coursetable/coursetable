import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Collapse } from 'react-bootstrap';
import type { IconType } from 'react-icons';
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

function DropdownItem({
  icon: Icon,
  iconColor,
  children,
  to,
  href,
  externalLink,
  onClick,
}: {
  readonly icon: IconType;
  readonly iconColor?: string;
  readonly children: string;
  readonly to?: string;
  readonly href?: string;
  readonly externalLink?: boolean;
  readonly onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <Row className="pb-3 m-auto">
      <Icon
        className="mr-2 my-auto"
        size={20}
        style={{ paddingLeft: '2px' }}
        color={iconColor}
      />
      <TextComponent type="secondary">
        {to ? (
          <NavLink
            to={to}
            className={styles.collapseText}
            onClick={onClick ?? scrollToTop}
          >
            <HoverText>{children}</HoverText>
          </NavLink>
        ) : href ? (
          // eslint-disable-next-line react/jsx-no-target-blank
          <a
            href={href}
            className={styles.collapseText}
            {...(externalLink && {
              target: '_blank',
              rel: 'noreferrer noopener',
            })}
          >
            <HoverText>{children}</HoverText>
          </a>
        ) : (
          <HoverText
            {...(onClick && { onClick })}
            className={styles.collapseText}
          >
            {children}
          </HoverText>
        )}
      </TextComponent>
    </Row>
  );
}

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
            <DropdownItem icon={FcInfo} to="/about">
              About
            </DropdownItem>
            <DropdownItem icon={FcQuestions} to="/faq">
              FAQ
            </DropdownItem>
            <DropdownItem
              icon={FcFeedback}
              href="https://feedback.coursetable.com/"
              externalLink
            >
              Feedback
            </DropdownItem>
            {/* Try tutorial only on desktop */}
            {!isMobile && !isTablet && isLoggedIn && (
              <DropdownItem
                icon={FcPuzzle}
                to="/catalog"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToTop(e);
                  setIsTutorialOpen(true);
                  setShownTutorial(false);
                }}
              >
                Tutorial
              </DropdownItem>
            )}
            {/* Sign In/Out button */}
            {isLoggedIn ? (
              <DropdownItem
                icon={FaSignOutAlt}
                iconColor="#ed5f5f"
                onClick={logout}
              >
                Sign Out
              </DropdownItem>
            ) : (
              <DropdownItem
                icon={FaSignInAlt}
                iconColor="#30e36b"
                href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`}
              >
                Sign In
              </DropdownItem>
            )}
          </Col>
        </div>
      </Collapse>
    </SurfaceComponent>
  );
}

export default MeDropdown;
