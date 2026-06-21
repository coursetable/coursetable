import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Collapse } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaRegMoon, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import {
  FcInfo,
  FcQuestions,
  FcFeedback,
  FcPuzzle,
  FcNews,
  FcBusinessman,
} from 'react-icons/fc';
import { FiEdit2 } from 'react-icons/fi';
import { ImSun } from 'react-icons/im';

import { useShallow } from 'zustand/react/shallow';
import { API_ENDPOINT } from '../../config';
import { logout } from '../../queries/api';
import { useStore } from '../../store';
import { scrollToTop, useComponentVisible } from '../../utilities/display';
import { createCatalogLink } from '../../utilities/navigation';
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
  initials,
  fullName,
}: {
  readonly isExpanded: boolean;
  readonly setIsExpanded: (visible: boolean) => void;
  readonly initials: string | undefined;
  readonly fullName: string | undefined;
}) {
  const { isMobile, isTablet } = useStore(
    useShallow((state) => ({
      isMobile: state.isMobile,
      isTablet: state.isTablet,
    })),
  );
  const authStatus = useStore((state) => state.authStatus);
  const refreshAuth = useStore((state) => state.refreshAuth);
  const toggleTutorial = useStore((state) => state.toggleTutorial);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

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
        <div>
          <div className={styles.identityHeader}>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'light' ? (
                <ImSun size={17} />
              ) : (
                <FaRegMoon size={16} />
              )}
            </button>
            <span className={styles.headerEdit} aria-hidden>
              <FiEdit2 size={16} strokeWidth={1.5} />
            </span>
            <div className={styles.headerInitials} title={fullName}>
              {initials ? (
                <span>{initials}</span>
              ) : (
                <BsFillPersonFill size={40} />
              )}
            </div>
            {initials && (
              <span className={styles.yalemojiPrompt}>Build your YaleMoji</span>
            )}
          </div>
          <div className={styles.menuItems}>
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
              Release notes
            </DropdownItem>
            {/* Try tutorial only on desktop */}
            {!isMobile && !isTablet && authStatus === 'authenticated' && (
              <DropdownItem
                icon={FcPuzzle}
                to={createCatalogLink()}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToTop(e);
                  toggleTutorial(true);
                }}
              >
                Tutorial
              </DropdownItem>
            )}
            {authStatus === 'authenticated' && (
              <DropdownItem icon={FcBusinessman} to="/profile">
                Profile (beta)
              </DropdownItem>
            )}
            {authStatus === 'authenticated' ? (
              <DropdownItem
                icon={FaSignOutAlt}
                iconColor="#ed5f5f"
                onClick={async () => {
                  await logout();
                  await refreshAuth();
                  window.location.href = '/';
                }}
              >
                Sign out
              </DropdownItem>
            ) : (
              <DropdownItem
                icon={FaSignInAlt}
                iconColor="#30e36b"
                href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`}
              >
                Sign in
              </DropdownItem>
            )}
          </div>
        </div>
      </Collapse>
    </SurfaceComponent>
  );
}

function MeDropdown() {
  // Ref to detect outside clicks for profile dropdown
  const { elemRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible<HTMLButtonElement>(false);
  const user = useStore((state) => state.user);
  const hasName = Boolean(user?.firstName && user.lastName);
  const initials = hasName
    ? `${user!.firstName![0]!}${user!.lastName![0]!}`
    : undefined;
  const fullName = hasName
    ? `${user!.firstName!} ${user!.lastName!}`
    : undefined;
  return (
    <div className={clsx(styles.navbarMe, 'align-self-end')}>
      <button
        type="button"
        ref={elemRef}
        className={clsx(hasName ? styles.meIcon : styles.anonIcon, 'm-auto')}
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        aria-label="Profile"
      >
        {hasName ? (
          <span title={fullName}>{initials}</span>
        ) : (
          <BsFillPersonFill
            className="m-auto"
            size={20}
            color={isComponentVisible ? '#007bff' : undefined}
          />
        )}
      </button>
      <DropdownContent
        isExpanded={isComponentVisible}
        setIsExpanded={setIsComponentVisible}
        initials={initials}
        fullName={fullName}
      />
    </div>
  );
}

export default MeDropdown;
