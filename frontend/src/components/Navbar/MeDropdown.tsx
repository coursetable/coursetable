import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Collapse } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaRegMoon, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import {
  FcCalendar,
  FcComboChart,
  FcInfo,
  FcQuestions,
  FcFeedback,
  FcPuzzle,
  FcNews,
  FcBusinessman,
  FcDownload,
  FcLock,
} from 'react-icons/fc';
import { FiSmile } from 'react-icons/fi';
import { ImSun } from 'react-icons/im';

import { useShallow } from 'zustand/react/shallow';
import { API_ENDPOINT } from '../../config';
import { logout } from '../../queries/api';
import { useStore } from '../../store';
import { scrollToTop, useComponentVisible } from '../../utilities/display';
import { createCatalogLink } from '../../utilities/navigation';
import { SurfaceComponent, TextComponent } from '../Typography';
import styles from './MeDropdown.module.css';

const YALEMOJI_URL = 'https://yalemoji.com?ref=ct';
const NOOP = () => {};

function DropdownItem({
  icon: Icon,
  iconColor,
  children,
  to,
  href,
  externalLink,
  onClick,
  hideIcon = false,
}: {
  readonly icon: IconType;
  readonly iconColor?: string;
  readonly children: string;
  readonly to?: string;
  readonly href?: string;
  readonly externalLink?: boolean;
  readonly onClick?: (e: React.MouseEvent) => void;
  readonly hideIcon?: boolean;
}) {
  const innerText = (
    <TextComponent className={styles.itemText} type="secondary">
      {!hideIcon && (
        <Icon size={20} className={styles.linkIcon} color={iconColor} />
      )}
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
        onClick={onClick}
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
  showMobileNavLinks,
  showInstallAsApp,
  onInstallAsApp,
}: {
  readonly isExpanded: boolean;
  readonly setIsExpanded: (visible: boolean) => void;
  readonly initials: string | undefined;
  readonly fullName: string | undefined;
  readonly showMobileNavLinks: boolean;
  readonly showInstallAsApp: boolean;
  readonly onInstallAsApp: () => void;
}) {
  const { isMobile, isTablet } = useStore(
    useShallow((state) => ({
      isMobile: state.isMobile,
      isTablet: state.isTablet,
    })),
  );
  const authStatus = useStore((state) => state.authStatus);
  const user = useStore((state) => state.user);
  const refreshAuth = useStore((state) => state.refreshAuth);
  const toggleTutorial = useStore((state) => state.toggleTutorial);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const userFirstName =
    authStatus === 'authenticated' ? user?.firstName?.trim() : undefined;
  const closeAndScroll = (e: React.MouseEvent) => {
    setIsExpanded(false);
    scrollToTop(e);
  };

  return (
    <SurfaceComponent
      elevated
      className={clsx(
        styles.collapseContainer,
        showMobileNavLinks && styles.collapseContainerMobileInline,
      )}
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
            <a
              className={styles.headerEdit}
              href={YALEMOJI_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Build your YaleMoji"
            >
              <FiSmile size={17} strokeWidth={1.7} />
            </a>
            <div className={styles.headerInitials} title={fullName}>
              {initials ? (
                <span>{initials}</span>
              ) : (
                <BsFillPersonFill size={40} />
              )}
            </div>
            {userFirstName && (
              <span className={styles.yalemojiPrompt}>
                Hello, {userFirstName}
              </span>
            )}
          </div>
          <div className={styles.menuItems}>
            {showMobileNavLinks && (
              <>
                <DropdownItem
                  icon={FcComboChart}
                  to={createCatalogLink()}
                  onClick={closeAndScroll}
                  hideIcon={showMobileNavLinks}
                >
                  Catalog
                </DropdownItem>
                <DropdownItem
                  icon={FcCalendar}
                  to="/worksheet"
                  onClick={closeAndScroll}
                  hideIcon={showMobileNavLinks}
                >
                  Worksheet
                </DropdownItem>
                {authStatus === 'authenticated' && user?.hasEvals === false && (
                  <DropdownItem
                    icon={FcLock}
                    to="/challenge"
                    onClick={closeAndScroll}
                    hideIcon={showMobileNavLinks}
                  >
                    Challenge
                  </DropdownItem>
                )}
              </>
            )}
            <DropdownItem
              icon={FcInfo}
              to="/about"
              onClick={showMobileNavLinks ? closeAndScroll : undefined}
              hideIcon={showMobileNavLinks}
            >
              About
            </DropdownItem>
            <DropdownItem
              icon={FcQuestions}
              to="/faq"
              onClick={showMobileNavLinks ? closeAndScroll : undefined}
              hideIcon={showMobileNavLinks}
            >
              FAQ
            </DropdownItem>
            <DropdownItem
              icon={FcFeedback}
              href="https://feedback.coursetable.com/"
              externalLink
              onClick={
                showMobileNavLinks ? () => setIsExpanded(false) : undefined
              }
              hideIcon={showMobileNavLinks}
            >
              Feedback
            </DropdownItem>
            <DropdownItem
              icon={FcNews}
              to="/releases"
              onClick={showMobileNavLinks ? closeAndScroll : undefined}
              hideIcon={showMobileNavLinks}
            >
              Release notes
            </DropdownItem>
            {showInstallAsApp && (
              <DropdownItem
                icon={FcDownload}
                onClick={() => {
                  setIsExpanded(false);
                  onInstallAsApp();
                }}
                hideIcon={showMobileNavLinks}
              >
                Install as app
              </DropdownItem>
            )}
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
              <DropdownItem
                icon={FcBusinessman}
                to="/profile"
                onClick={showMobileNavLinks ? closeAndScroll : undefined}
                hideIcon={showMobileNavLinks}
              >
                Profile (beta)
              </DropdownItem>
            )}
            {authStatus === 'authenticated' ? (
              <DropdownItem
                icon={FaSignOutAlt}
                iconColor="#ed5f5f"
                onClick={async () => {
                  setIsExpanded(false);
                  await logout();
                  await refreshAuth();
                  window.location.href = '/';
                }}
                hideIcon={showMobileNavLinks}
              >
                Sign out
              </DropdownItem>
            ) : (
              <DropdownItem
                icon={FaSignInAlt}
                iconColor="#30e36b"
                href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`}
                onClick={
                  showMobileNavLinks ? () => setIsExpanded(false) : undefined
                }
                hideIcon={showMobileNavLinks}
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

function MeDropdown({
  showMobileNavLinks = false,
  showInstallAsApp = false,
  onInstallAsApp = NOOP,
}: {
  readonly showMobileNavLinks?: boolean;
  readonly showInstallAsApp?: boolean;
  readonly onInstallAsApp?: () => void;
}) {
  // Ref to detect outside clicks for profile dropdown
  const { elemRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible<HTMLDivElement>(false);
  const user = useStore((state) => state.user);
  const hasName = Boolean(user?.firstName && user.lastName);
  const initials = hasName
    ? `${user!.firstName![0]!}${user!.lastName![0]!}`
    : undefined;
  const fullName = hasName
    ? `${user!.firstName!} ${user!.lastName!}`
    : undefined;
  return (
    <div
      ref={elemRef}
      className={clsx(
        styles.navbarMe,
        showMobileNavLinks && styles.navbarMeMobileInline,
        'align-self-end',
      )}
    >
      <button
        type="button"
        className={clsx(
          hasName ? styles.meIcon : styles.anonIcon,
          !showMobileNavLinks && 'm-auto',
        )}
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
        showMobileNavLinks={showMobileNavLinks}
        showInstallAsApp={showInstallAsApp}
        onInstallAsApp={onInstallAsApp}
      />
    </div>
  );
}

export default MeDropdown;
