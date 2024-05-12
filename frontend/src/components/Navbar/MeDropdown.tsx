import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Collapse } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import {
  FcInfo,
  FcQuestions,
  FcFeedback,
  FcPuzzle,
  FcNews,
} from 'react-icons/fc';

import { API_ENDPOINT } from '../../config';
import { useTutorial } from '../../contexts/tutorialContext';
import { useUser } from '../../contexts/userContext';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { logout } from '../../queries/api';
import { scrollToTop, useComponentVisible } from '../../utilities/display';
import { SurfaceComponent, TextComponent } from '../Typography';
import styles from './MeDropdown.module.css';

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
    <TextComponent className={styles.itemText} type="secondary">
      <Icon size={20} className={styles.linkIcon} color={iconColor} />
      {children}
    </TextComponent>
  );
  if (to) {
    return (
      <NavLink
        to={to}
        onClick={onClick ?? scrollToTop}
        className={styles.dropdownItem}
      >
        {innerText}
      </NavLink>
    );
  } else if (href) {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        href={href}
        className={styles.dropdownItem}
        {...(externalLink && {
          target: '_blank',
          rel: 'noreferrer noopener',
        })}
      >
        {innerText}
      </a>
    );
  } else if (onClick) {
    return (
      <button type="button" onClick={onClick} className={styles.dropdownItem}>
        {innerText}
      </button>
    );
  }
  throw new Error('DropdownItem must have either to, href, or onClick');
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
