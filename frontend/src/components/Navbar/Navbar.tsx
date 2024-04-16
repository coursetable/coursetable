import React, { useMemo, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { MdUpdate } from 'react-icons/md';
import clsx from 'clsx';
import Logo from './Logo';
import DarkModeButton from './DarkModeButton';
import MeDropdown from './MeDropdown';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { logout } from '../../utilities/api';
import { scrollToTop } from '../../utilities/display';
import styles from './Navbar.module.css';
import { SurfaceComponent, TextComponent } from '../Typography';
import { NavbarCatalogSearch } from './NavbarCatalogSearch';
import { NavbarWorksheetSearch } from './NavbarWorksheetSearch';

import { API_ENDPOINT } from '../../config';
import { useUser } from '../../contexts/userContext';

function NavbarLink({
  to,
  children,
}: {
  readonly to: string;
  readonly children: React.ReactNode;
}) {
  return (
    <NavLink className={styles.navLink} to={to} onClick={scrollToTop}>
      {children}
    </NavLink>
  );
}

//  Wrapper for nav collapse for # of results shown text
function NavCollapseWrapper({
  children,
  wrap,
}: {
  readonly children: React.ReactNode;
  readonly wrap: boolean;
}) {
  if (wrap) {
    return (
      <div className="ms-auto d-flex flex-column align-items-end justify-content-between h-100">
        {children}
      </div>
    );
  }
  return children;
}

function LastUpdatedAt() {
  const lastUpdated = useMemo(() => {
    const now = new Date();
    // We always update at around 8:25am UTC, regardless of DST
    // TODO: maybe the DB should tell us when it was last updated
    const lastUpdate = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        8,
        25,
      ),
    );
    const nowTime = now.getTime() / 1000;
    let lastUpdateTime = lastUpdate.getTime() / 1000;
    if (lastUpdateTime > nowTime) lastUpdateTime -= 24 * 60 * 60;
    const diffInSecs = nowTime - lastUpdateTime;
    if (diffInSecs < 60) {
      return `${diffInSecs} sec${diffInSecs > 1 ? 's' : ''}`;
    } else if (diffInSecs < 3600) {
      const diffInMins = Math.floor(diffInSecs / 60);
      return `${diffInMins} min${diffInMins > 1 ? 's' : ''}`;
    }
    const diffInHrs = Math.floor(diffInSecs / 3600);
    return `${diffInHrs} hr${diffInHrs > 1 ? 's' : ''}`;
  }, []);
  return (
    <TextComponent type="tertiary" small className="mb-2 text-right">
      <MdUpdate className="me-1" />
      Updated {lastUpdated} ago
    </TextComponent>
  );
}

export default function CourseTableNavbar() {
  const { authStatus } = useUser();
  const location = useLocation();
  const [navExpanded, setNavExpanded] = useState(false);
  const { isMobile } = useWindowDimensions();

  const showCatalogSearch = !isMobile && location.pathname === '/catalog';
  const showWorksheetSearch =
    !isMobile &&
    authStatus === 'authenticated' &&
    location.pathname === '/worksheet';

  return (
    <SurfaceComponent className={styles.stickyNavbar}>
      <Navbar
        expanded={navExpanded}
        onToggle={setNavExpanded}
        expand="md"
        className={clsx(
          'shadow-sm px-3 align-items-start',
          showCatalogSearch && styles.catalogSearchNavbar,
        )}
      >
        {/* Logo in top left */}
        <Nav className={clsx(styles.navLogo, 'navbar-brand')}>
          <NavLink to="/">
            <Logo icon={false} />
          </NavLink>
        </Nav>
        {showCatalogSearch && <NavbarCatalogSearch />}
        {showWorksheetSearch && <NavbarWorksheetSearch />}

        {/* Mobile nav toggle */}
        <Navbar.Toggle
          className={styles.navToggle}
          aria-controls="basic-navbar-nav"
        />

        <NavCollapseWrapper wrap={!isMobile}>
          {/* On mobile, this will be a collapsed dropdown;
              on desktop, it will be a navbar */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className={styles.navbarContent}
          >
            <Nav
              onClick={() => setNavExpanded(false)}
              className={clsx(
                isMobile && 'align-items-start pt-2',
                'position-relative',
              )}
            >
              <DarkModeButton className={styles.navbarDarkModeBtn} />
              <NavbarLink to="/catalog">Catalog</NavbarLink>
              <NavbarLink to="/worksheet">
                <span data-tutorial="worksheet-1">Worksheet</span>
              </NavbarLink>
              {/* Links are in the navbar on mobile and in the me dropdown
                  on desktop */}
              {isMobile ? (
                <>
                  <NavbarLink to="/about">About</NavbarLink>
                  <NavbarLink to="/faq">FAQ</NavbarLink>
                  <a
                    href="https://feedback.coursetable.com/"
                    className={styles.navLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Feedback
                  </a>
                  <NavbarLink to="/releases">Release Notes</NavbarLink>
                  <button
                    type="button"
                    className={styles.navLink}
                    onClick={
                      authStatus !== 'authenticated'
                        ? () => {
                            window.location.href = `${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`;
                          }
                        : logout
                    }
                  >
                    Sign {authStatus !== 'authenticated' ? 'In' : 'Out'}
                  </button>
                </>
              ) : (
                <MeDropdown />
              )}
            </Nav>
          </Navbar.Collapse>
          {showCatalogSearch && <LastUpdatedAt />}
        </NavCollapseWrapper>
      </Navbar>
    </SurfaceComponent>
  );
}
