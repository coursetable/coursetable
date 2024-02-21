import React, { useMemo, useState } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdUpdate } from 'react-icons/md';
import clsx from 'clsx';
import Logo from './Logo';
import DarkModeButton from './DarkModeButton';
import MeDropdown from './MeDropdown';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import { logout } from '../../utilities/api';
import { scrollToTop, useComponentVisible } from '../../utilities/display';
import styles from './Navbar.module.css';
import { SurfaceComponent, TextComponent } from '../Typography';
import { NavbarCatalogSearch } from './NavbarCatalogSearch';

import { API_ENDPOINT } from '../../config';
import { useUser } from '../../contexts/userContext';
import { NavbarWorksheetSearch } from './NavbarWorksheetSearch';

function NavbarLink({
  to,
  children,
  id,
}: {
  readonly to: string;
  readonly children: React.ReactNode;
  readonly id?: string;
}) {
  return (
    <NavLink className={styles.navLink} to={to} onClick={scrollToTop} id={id}>
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
      <div className="ml-auto d-flex flex-column align-items-end justify-content-between h-100">
        {children}
      </div>
    );
  }
  return <>{children}</>;
}

export default function CourseTableNavbar() {
  const { user } = useUser();
  const isLoggedIn = Boolean(user.worksheets);
  const location = useLocation();
  // Is navbar expanded in mobile view?
  const [navExpanded, setNavExpanded] = useState<boolean>(false);
  // Ref to detect outside clicks for profile dropdown
  const { elemRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible<HTMLDivElement>(false);

  // Fetch current device
  const { isMobile, isLgDesktop } = useWindowDimensions();

  // Show navbar search state
  const showSearch =
    !isMobile &&
    isLoggedIn &&
    ['/catalog', '/worksheet'].includes(location.pathname);

  // Calculate time since last updated
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
    <div className={styles.stickyNavbar}>
      <SurfaceComponent>
        <Container fluid className="p-0">
          <Navbar
            expanded={navExpanded}
            onToggle={(expanded: boolean) => setNavExpanded(expanded)}
            expand="md"
            className="shadow-sm px-3 align-items-start"
            style={
              showSearch && location.pathname === '/catalog'
                ? {
                    height: isLgDesktop ? '100px' : '88px',
                    paddingBottom: '0px',
                  }
                : undefined
            }
          >
            {/* Logo in top left */}
            <Nav className={clsx(styles.navLogo, 'navbar-brand')}>
              <NavLink
                to="/"
                style={({ isActive }) =>
                  isActive
                    ? {
                        textDecoration: 'none',
                        display: 'table-cell',
                        verticalAlign: 'middle',
                      }
                    : {}
                }
              >
                {/* Condense logo if on home page */}
                <span className={styles.navLogo}>
                  <Logo icon={false} />
                </span>
              </NavLink>
            </Nav>

            {/* Mobile nav toggle */}
            <Navbar.Toggle
              className={styles.navToggle}
              aria-controls="basic-navbar-nav"
            />

            {/* Desktop navbar search */}
            {showSearch && location.pathname === '/catalog' ? (
              <NavbarCatalogSearch />
            ) : (
              showSearch &&
              location.pathname === '/worksheet' && <NavbarWorksheetSearch />
            )}

            <NavCollapseWrapper wrap={!isMobile && showSearch}>
              {/* Navbar collapse */}
              <Navbar.Collapse
                id="basic-navbar-nav"
                // Make navbar display: flex when not mobile. If mobile, normal
                // formatting
                className={!isMobile ? 'd-flex' : 'justify-content-end'}
                style={!isMobile && showSearch ? { flexGrow: 0 } : undefined}
              >
                {/* Close navbar on click in mobile view */}
                <Nav
                  onClick={() => setNavExpanded(false)}
                  className={clsx(
                    isMobile && 'align-items-start pt-2',
                    'position-relative',
                  )}
                  style={{ width: '100%' }}
                >
                  {/* DarkMode Button */}
                  <DarkModeButton
                    className={clsx(
                      styles.navbarDarkModeBtn,
                      'd-flex',
                      !isMobile && 'ml-auto',
                    )}
                  />
                  {isLoggedIn && (
                    <>
                      {/* Catalog Page */}
                      <NavbarLink to="/catalog" id="catalog-link">
                        Catalog
                      </NavbarLink>
                      {/* Worksheet Page */}
                      <NavbarLink to="/worksheet">
                        <span data-tutorial="worksheet-1">Worksheet</span>
                      </NavbarLink>
                    </>
                  )}
                  {(isMobile || !isLoggedIn) && (
                    <>
                      {/* About Page */}
                      <NavbarLink to="/about">About</NavbarLink>
                      {/* FAQ Page */}
                      <NavbarLink to="/faq">FAQ</NavbarLink>
                    </>
                  )}
                  {/* Profile Icon. Show if not mobile */}
                  <div
                    // Right align profile icon if not mobile
                    className={clsx(
                      'd-none d-md-block',
                      !isMobile && 'align-self-end',
                    )}
                  >
                    <div className={styles.navbarMe}>
                      {/* TODO */}
                      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                      <div
                        ref={elemRef}
                        className={clsx(styles.meIcon, 'm-auto')}
                        onClick={() =>
                          setIsComponentVisible(!isComponentVisible)
                        }
                      >
                        <BsFillPersonFill
                          className="m-auto"
                          size={20}
                          color={isComponentVisible ? '#007bff' : undefined}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Sign in/out buttons. Show if mobile */}
                  <div className="d-md-none">
                    {!isLoggedIn ? (
                      // TODO
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                      <div
                        className={styles.signInOutButton}
                        onClick={() => {
                          window.location.href = `${API_ENDPOINT}/api/auth/cas?redirect=catalog`;
                        }}
                      >
                        Sign In
                      </div>
                    ) : (
                      // TODO
                      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                      <div className={styles.signInOutButton} onClick={logout}>
                        Sign Out
                      </div>
                    )}
                  </div>
                </Nav>
              </Navbar.Collapse>
              {/* Last updated ago text for desktop */}
              {showSearch && location.pathname === '/catalog' && (
                <TextComponent
                  type="tertiary"
                  small
                  className="mb-2 text-right"
                >
                  <MdUpdate className="mr-1" />
                  Updated {lastUpdated} ago
                </TextComponent>
              )}
            </NavCollapseWrapper>
          </Navbar>
        </Container>
      </SurfaceComponent>
      {/* Nav link dropdown that has position: absolute */}
      <div>
        <MeDropdown
          isExpanded={isComponentVisible}
          setIsExpanded={setIsComponentVisible}
        />
      </div>
    </div>
  );
}
