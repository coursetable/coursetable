import React from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { BsFillPersonFill } from 'react-icons/bs';
import {
  FcInfo,
  FcQuestions,
  FcFeedback,
  FcPuzzle,
  FcNews,
} from 'react-icons/fc';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import clsx from 'clsx';

import styles from './MeDropdown.module.css';
import { logout } from '../../utilities/api';
import { scrollToTop, useComponentVisible } from '../../utilities/display';
import { SurfaceComponent, TextComponent, HoverText } from '../Typography';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { useUser } from '../../contexts/userContext';
import { useTutorial } from '../../contexts/tutorialContext';
import { API_ENDPOINT } from '../../config';

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
  const innerText = (
    <HoverText>
      <Icon
        className="mr-2 my-auto"
        size={20}
        style={{ paddingLeft: '2px', paddingBottom: '2px' }}
        color={iconColor}
      />
      {children}
    </HoverText>
  );
  return (
    <div className="my-3">
      <TextComponent type="secondary">
        {to ? (
          <NavLink
            to={to}
            className={styles.collapseText}
            onClick={onClick ?? scrollToTop}
          >
            {innerText}
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
            {innerText}
          </a>
        ) : onClick ? (
          <button
            type="button"
            onClick={onClick}
            className={styles.collapseText}
          >
            {innerText}
          </button>
        ) : (
          <span className={styles.collapseText}>{innerText}</span>
        )}
      </TextComponent>
    </div>
  );
}

function DropdownContent({
  isExpanded,
  setIsExpanded,
}: {
  readonly isExpanded: boolean;
  readonly setIsExpanded: (visible: boolean) => void;
}) {
  const { isMobile, isTablet } = useWindowDimensions();
  const { authStatus } = useUser();
  const { toggleTutorial } = useTutorial();

  return (
    <SurfaceComponent
      elevated
      className={styles.collapseContainer}
      onClick={() => {
        setIsExpanded(true);
      }}
    >
      <Collapse in={isExpanded}>
        {/* Do not add vertical spacing to this div because it will break
          collapsing animation */}
        <div className="px-3">
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
          <DropdownItem icon={FcNews} to="/releases">
            Release Notes
          </DropdownItem>
          {/* Try tutorial only on desktop */}
          {!isMobile && !isTablet && authStatus === 'authenticated' && (
            <DropdownItem
              icon={FcPuzzle}
              to="/catalog"
              onClick={(e) => {
                e.stopPropagation();
                scrollToTop(e);
                toggleTutorial(true);
              }}
            >
              Tutorial
            </DropdownItem>
          )}
          {authStatus === 'authenticated' ? (
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
        </div>
      </Collapse>
    </SurfaceComponent>
  );
}

function MeDropdown() {
  // Ref to detect outside clicks for profile dropdown
  const { elemRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible<HTMLButtonElement>(false);
  return (
    <div className={clsx(styles.navbarMe, 'align-self-end')}>
      <button
        type="button"
        ref={elemRef}
        className={clsx(styles.meIcon, 'm-auto')}
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        aria-label="Profile"
      >
        <BsFillPersonFill
          className="m-auto"
          size={20}
          color={isComponentVisible ? '#007bff' : undefined}
        />
      </button>
      <DropdownContent
        isExpanded={isComponentVisible}
        setIsExpanded={setIsComponentVisible}
      />
    </div>
  );
}

export default MeDropdown;
