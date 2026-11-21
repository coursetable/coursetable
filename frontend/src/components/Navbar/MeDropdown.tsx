import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Collapse } from 'react-bootstrap';
import type { IconType } from 'react-icons';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import {
  FcCalendar,
  FcComboChart,
  FcInfo,
  FcQuestions,
  FcFeedback,
  FcPuzzle,
  FcNews,
  FcDownload,
  FcLock,
} from 'react-icons/fc';

import { useShallow } from 'zustand/react/shallow';
import { API_ENDPOINT } from '../../config';
import { useYaleMoji } from '../../hooks/useYaleMoji';
import { clearYaleMojiCache } from '../../hooks/yalemojiCache';
import { logout, type UserInfo, type YaleMojiAvatar } from '../../queries/api';
import { useStore } from '../../store';
import { scrollToTop, useComponentVisible } from '../../utilities/display';
import { createCatalogLink } from '../../utilities/navigation';
import { YaleMojiImage } from '../PeopleYaleMoji';
import { SurfaceComponent, TextComponent } from '../Typography';
import styles from './MeDropdown.module.css';

const NOOP = () => {};

function getInitials(user: UserInfo | undefined) {
  const first = user?.firstName?.trim()[0];
  const last = user?.lastName?.trim()[0];
  return first && last
    ? `${first}${last}`.toUpperCase()
    : user?.netId.slice(0, 2).toUpperCase();
}

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
  avatar,
  onAvatarError,
  showMobileNavLinks,
  showInstallAsApp,
  onInstallAsApp,
}: {
  readonly isExpanded: boolean;
  readonly setIsExpanded: (visible: boolean) => void;
  readonly avatar: YaleMojiAvatar | null;
  readonly onAvatarError: () => void;
  readonly showMobileNavLinks: boolean;
  readonly showInstallAsApp: boolean;
  readonly onInstallAsApp: () => void;
}) {
  const navigate = useNavigate();
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
  const closeAndScroll = (e: React.MouseEvent) => {
    setIsExpanded(false);
    scrollToTop(e);
  };
  const avatarStyle = avatar
    ? { backgroundImage: `url("${avatar.background_url}")` }
    : undefined;

  const identityAvatar = avatar ? (
    <YaleMojiImage
      avatar={avatar}
      className={styles.headerAvatar}
      trimPadding={false}
      onAvatarError={onAvatarError}
    />
  ) : (
    <span
      className={clsx(
        styles.headerAvatar,
        styles.headerAvatarFallback,
        styles.headerInitials,
      )}
      aria-hidden="true"
    >
      {getInitials(user)}
    </span>
  );

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
          <div className={styles.identityHeader} style={avatarStyle}>
            {authStatus === 'authenticated' ? (
              <NavLink
                to="/profile"
                className={styles.profileLink}
                aria-label="Edit Profile"
                onClick={async (event) => {
                  if (
                    event.button !== 0 ||
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return;
                  event.preventDefault();
                  const image =
                    event.currentTarget.firstElementChild?.firstElementChild;
                  if (
                    image &&
                    typeof image.animate === 'function' &&
                    !window.matchMedia('(prefers-reduced-motion: reduce)')
                      .matches
                  ) {
                    try {
                      await image.animate(
                        [
                          {
                            transform: window.getComputedStyle(image).transform,
                          },
                          { transform: 'translateY(0) scale(0.96)' },
                        ],
                        { duration: 120, easing: 'ease-out' },
                      ).finished;
                    } catch {
                      /* An interrupted animation must not prevent navigation. */
                    }
                  }
                  setIsExpanded(false);
                  scrollToTop(event);
                  void navigate('/profile');
                }}
              >
                <span className={styles.profileAvatarFrame}>
                  {identityAvatar}
                  <span className={styles.profileLabel}>
                    <span className={styles.profileLabelText}>
                      Edit Profile
                    </span>
                  </span>
                </span>
              </NavLink>
            ) : (
              identityAvatar
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
            {authStatus === 'authenticated' ? (
              <DropdownItem
                icon={FaSignOutAlt}
                iconColor="#ed5f5f"
                onClick={async () => {
                  setIsExpanded(false);
                  clearYaleMojiCache();
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
  const authStatus = useStore((state) => state.authStatus);
  const { avatar, onAvatarError } = useYaleMoji(
    authStatus === 'authenticated' ? user?.netId : undefined,
  );
  const hasName = Boolean(user?.firstName && user.lastName);
  const initials = getInitials(user);
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
        className={clsx(styles.meIcon, !showMobileNavLinks && 'm-auto')}
        style={
          avatar
            ? { backgroundImage: `url("${avatar.background_url}")` }
            : undefined
        }
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        title={fullName}
        aria-label="Profile"
        aria-expanded={isComponentVisible}
      >
        {avatar ? (
          <YaleMojiImage
            avatar={avatar}
            className={styles.buttonAvatar}
            trimPadding={false}
            onAvatarError={onAvatarError}
          />
        ) : initials ? (
          <span className={styles.navInitials}>{initials}</span>
        ) : (
          <BsFillPersonFill size={20} />
        )}
      </button>
      <DropdownContent
        isExpanded={isComponentVisible}
        setIsExpanded={setIsComponentVisible}
        avatar={avatar}
        onAvatarError={onAvatarError}
        showMobileNavLinks={showMobileNavLinks}
        showInstallAsApp={showInstallAsApp}
        onInstallAsApp={onInstallAsApp}
      />
    </div>
  );
}

export default MeDropdown;
