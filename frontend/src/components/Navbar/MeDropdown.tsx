import React from 'react';
import { NavLink } from 'react-router-dom';
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
  FcBusinessman,
  FcDownload,
  FcLock,
} from 'react-icons/fc';

import { useShallow } from 'zustand/react/shallow';
import DarkModeButton from './DarkModeButton';
import YaleMojiLink from './YaleMojiLink';
import { API_ENDPOINT } from '../../config';
import { useYaleMoji } from '../../hooks/useYaleMoji';
import { clearYaleMojiCache } from '../../hooks/yalemojiCache';
import yalemojiIcon from '../../images/yalemoji.svg';
import { logout, type YaleMojiAvatar } from '../../queries/api';
import { useStore } from '../../store';
import { scrollToTop, useComponentVisible } from '../../utilities/display';
import { createCatalogLink } from '../../utilities/navigation';
import { SurfaceComponent, TextComponent } from '../Typography';
import styles from './MeDropdown.module.css';

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
  avatar,
  onAvatarError,
  showMobileNavLinks,
  showInstallAsApp,
  onInstallAsApp,
}: {
  readonly isExpanded: boolean;
  readonly setIsExpanded: (visible: boolean) => void;
  readonly initials: string | undefined;
  readonly fullName: string | undefined;
  readonly avatar: YaleMojiAvatar | null;
  readonly onAvatarError: () => void;
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
  const closeAndScroll = (e: React.MouseEvent) => {
    setIsExpanded(false);
    scrollToTop(e);
  };
  const avatarStyle = avatar
    ? { backgroundImage: `url("${avatar.background_url}")` }
    : undefined;

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
            {avatar && (
              <YaleMojiLink
                className={styles.headerEdit}
                href="https://yalemoji.com/editor?ref=coursetable"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Edit your Yalemoji"
                title="Edit your Yalemoji"
              >
                <img
                  src={yalemojiIcon}
                  alt=""
                  className={styles.headerEditIcon}
                  width={20}
                  height={16}
                />
              </YaleMojiLink>
            )}
            {avatar ? (
              <img
                src={avatar.png_url}
                alt="Your Yalemoji"
                className={styles.headerAvatar}
                onError={onAvatarError}
              />
            ) : (
              <div className={styles.headerInitials} title={fullName}>
                {initials ? (
                  <span>{initials}</span>
                ) : (
                  <BsFillPersonFill size={40} />
                )}
              </div>
            )}
            {!avatar && (
              <YaleMojiLink
                className={styles.createYalemoji}
                href="https://yalemoji.com/create?ref=coursetable"
                target="_blank"
                rel="noopener noreferrer"
              >
                Make your Yalemoji
              </YaleMojiLink>
            )}
          </div>
          <div className={styles.menuItems}>
            {showMobileNavLinks && (
              <>
                <DarkModeButton className={styles.dropdownItem} />
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
          avatar || hasName ? styles.meIcon : styles.anonIcon,
          !showMobileNavLinks && 'm-auto',
        )}
        style={
          avatar
            ? { backgroundImage: `url("${avatar.background_url}")` }
            : undefined
        }
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        aria-label="Profile"
        aria-expanded={isComponentVisible}
      >
        {avatar ? (
          <img
            src={avatar.png_url}
            alt=""
            className={styles.buttonAvatar}
            onError={onAvatarError}
          />
        ) : hasName ? (
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
