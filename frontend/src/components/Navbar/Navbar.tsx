import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Nav, Navbar } from 'react-bootstrap';
import PWAPrompt from 'react-ios-pwa-prompt';
import DarkModeButton from './DarkModeButton';
import Logo from './Logo';
import MeDropdown from './MeDropdown';
import { API_ENDPOINT } from '../../config';
import { logout } from '../../queries/api';
import { useStore } from '../../store';
import { scrollToTop } from '../../utilities/display';
import { createCatalogLink } from '../../utilities/navigation';
import LastUpdated from '../Search/LastUpdated';
import { NavbarCatalogSearch } from '../Search/NavbarCatalogSearch';
import RandomButton from '../Search/RandomButton';
import { SurfaceComponent } from '../Typography';
import { NavbarWorksheetSearch } from '../Worksheet/NavbarWorksheetSearch';

import styles from './Navbar.module.css';

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
function NavbarRight({
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
  // It's important to not render this wrapper at all, otherwise on mobile
  // it will still be a column on the right
  return children;
}

export default function CourseTableNavbar() {
  const authStatus = useStore((state) => state.authStatus);
  const user = useStore((state) => state.user);
  const location = useLocation();
  const [navExpanded, setNavExpanded] = useState(false);
  const isMobile = useStore((state) => state.isMobile);

  const showCatalogSearch = !isMobile && location.pathname === '/catalog';
  const isWorksheetPage = location.pathname === '/worksheet';

  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [isIOSNotInstalled, setIsIOSNotInstalled] = useState(false);

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/iu.test(navigator.userAgent);
    const isPWAInstalled = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;
    if (isIOS && !isPWAInstalled) setIsIOSNotInstalled(true);
  }, []);

  return (
    <SurfaceComponent className={styles.container}>
      <Navbar
        expanded={navExpanded}
        onToggle={setNavExpanded}
        expand="md"
        className={clsx(
          'shadow-sm px-3 align-items-start',
          styles.navbar,
          showCatalogSearch && styles.catalogSearchNavbar,
        )}
      >
        <PWAPrompt
          isShown={showPWAPrompt}
          appIconPath="/icon200x200.png"
          onClose={() => setShowPWAPrompt(false)}
        />
        {/* Logo in top left and random underneath */}
        <div className={styles.navLogoWrapper}>
          <Nav className={clsx(styles.navLogo, 'navbar-brand')}>
            <NavLink to="/">
              <Logo icon={false} />
            </NavLink>
          </Nav>
          {showCatalogSearch && <RandomButton />}
        </div>
        {showCatalogSearch && <NavbarCatalogSearch />}
        {isWorksheetPage && <NavbarWorksheetSearch isMobile={isMobile} />}

        {/* Mobile nav toggle */}
        <Navbar.Toggle
          className={styles.navToggle}
          aria-controls="basic-navbar-nav"
        />

        <NavbarRight wrap={!isMobile}>
          {/* On mobile, this will be a collapsed dropdown;
              on desktop, it will be a navbar */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            // It must have height exactly equal to its children otherwise on
            // desktop it won't align to the top
            className={styles.navbarCollapse}
          >
            <Nav
              onClick={() => setNavExpanded(false)}
              className={styles.navbarLinks}
            >
              <DarkModeButton className={styles.navbarDarkModeBtn} />
              <NavbarLink to={createCatalogLink()}>Catalog</NavbarLink>
              <NavbarLink to="/worksheet">
                <span data-tutorial="worksheet-1">Worksheet</span>
              </NavbarLink>
              {user?.hasEvals === false && (
                <NavbarLink to="/challenge">
                  <span style={{ position: 'relative' }}>
                    <span className={styles.challengeIndicator} />
                    Challenge
                  </span>
                </NavbarLink>
              )}
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
                  <NavbarLink to="/releases">Release notes</NavbarLink>
                  {isIOSNotInstalled && (
                    <button
                      type="button"
                      className={styles.navLink}
                      onClick={() => setShowPWAPrompt(true)}
                    >
                      Install as app
                    </button>
                  )}
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
          {showCatalogSearch && <LastUpdated />}
        </NavbarRight>
      </Navbar>
    </SurfaceComponent>
  );
}
