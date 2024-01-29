import React, { useEffect, useState } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdUpdate } from 'react-icons/md';
import styled from 'styled-components';
import clsx from 'clsx';
import Logo from './Logo';
import DarkModeButton from './DarkModeButton';
import MeDropdown from './MeDropdown';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import {
  breakpoints,
  logout,
  scrollToTop,
  useComponentVisible,
} from '../../utilities/display';
import styles from './Navbar.module.css';
import { SurfaceComponent, SmallTextComponent } from '../StyledComponents';
import { NavbarCatalogSearch } from './NavbarCatalogSearch';

import { API_ENDPOINT } from '../../config';
import { useTheme } from '../../contexts/themeContext';
import { NavbarWorksheetSearch } from './NavbarWorksheetSearch';

// Profile icon
const StyledMeIcon = styled.div`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgba(1, 1, 1, 0.1)' : '#525252'};
  color: ${({ theme }) => theme.text[1]};
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SignInOutButton = styled.div`
  color: ${({ theme }) => theme.text[1]};
  ${breakpoints('font-size', 'rem', [{ 1320: 0.9 }])};
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

// Nav links
const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.text[1]};
  ${breakpoints('font-size', 'rem', [{ 1320: 0.9 }])};
  transition: color ${({ theme }) => theme.transDur};
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
  }
`;

// Nav toggle for mobile
const StyledNavToggle = styled(Navbar.Toggle)`
  border-color: ${({ theme }) => theme.border} !important;
  .navbar-toggler-icon {
    background-image: ${({ theme }) =>
      `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='${
        theme.theme === 'light'
          ? 'rgba(69, 69, 69, 1)'
          : 'rgba(219, 219, 219, 1)'
      }' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`};
  }
`;

type Props = {
  readonly isLoggedIn: boolean;
  readonly setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly setShownTutorial: React.Dispatch<React.SetStateAction<boolean>>;
};

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
    <StyledNavLink
      className={styles.navLink}
      to={to}
      onClick={scrollToTop}
      id={id}
    >
      {children}
    </StyledNavLink>
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

export default function CourseTableNavbar({
  isLoggedIn,
  setIsTutorialOpen,
  setShownTutorial,
}: Props) {
  const location = useLocation();
  // Is navbar expanded in mobile view?
  const [navExpanded, setNavExpanded] = useState<boolean>(false);
  // Ref to detect outside clicks for profile dropdown
  const { elemRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible<HTMLDivElement>(false);

  // Last updated state
  const [lastUpdated, setLastUpdated] = useState('0 hrs');

  const { toggleTheme } = useTheme();

  // Fetch current device
  const { isMobile, isLgDesktop } = useWindowDimensions();

  // Show navbar search state
  const [showSearch, setShowSearch] = useState(false);
  // Page state
  const [page, setPage] = useState('');
  // Handles page
  useEffect(() => {
    if (location.pathname === '/catalog') setPage('catalog');
    else if (location.pathname === '/worksheet') setPage('worksheet');
    else setPage('');
  }, [location]);

  // Decides whether to show search or not
  useEffect(() => {
    if (!isMobile && isLoggedIn && page) setShowSearch(true);
    else setShowSearch(false);
  }, [isMobile, isLoggedIn, page]);

  // Calculate time since last updated
  useEffect(() => {
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
      setLastUpdated(`${diffInSecs} sec${diffInSecs > 1 ? 's' : ''}`);
    } else if (diffInSecs < 3600) {
      const diffInMins = Math.floor(diffInSecs / 60);
      setLastUpdated(`${diffInMins} min${diffInMins > 1 ? 's' : ''}`);
    } else {
      const diffInHrs = Math.floor(diffInSecs / 3600);
      setLastUpdated(`${diffInHrs} hr${diffInHrs > 1 ? 's' : ''}`);
    }
  }, []);

  return (
    <div className={styles.stickyNavbar}>
      <SurfaceComponent layer={0}>
        <Container fluid className="p-0">
          <Navbar
            expanded={navExpanded}
            onToggle={(expanded: boolean) => setNavExpanded(expanded)}
            expand="md"
            className="shadow-sm px-3 align-items-start"
            style={
              showSearch && page === 'catalog'
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
            <StyledNavToggle aria-controls="basic-navbar-nav" />

            {/* Desktop navbar search */}
            {showSearch && page === 'catalog' ? (
              <NavbarCatalogSearch />
            ) : (
              showSearch && page === 'worksheet' && <NavbarWorksheetSearch />
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
                  {/* TODO */}
                  {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                  <div
                    className={clsx(
                      styles.navbarDarkModeBtn,
                      'd-flex',
                      !isMobile && 'ml-auto',
                    )}
                    onClick={toggleTheme}
                  >
                    <DarkModeButton />
                  </div>
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
                      <StyledMeIcon
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
                      </StyledMeIcon>
                    </div>
                  </div>
                  {/* Sign in/out buttons. Show if mobile */}
                  <div className="d-md-none">
                    {!isLoggedIn ? (
                      <SignInOutButton
                        className={styles.signInOutButton}
                        onClick={() => {
                          window.location.href = `${API_ENDPOINT}/api/auth/cas?redirect=catalog`;
                        }}
                      >
                        Sign In
                      </SignInOutButton>
                    ) : (
                      <SignInOutButton
                        className={styles.signInOutButton}
                        onClick={logout}
                      >
                        Sign Out
                      </SignInOutButton>
                    )}
                  </div>
                </Nav>
              </Navbar.Collapse>
              {/* Last updated ago text for desktop */}
              {showSearch && page === 'catalog' && (
                <SmallTextComponent type={2} className="mb-2 text-right">
                  <MdUpdate className="mr-1" />
                  Updated {lastUpdated} ago
                </SmallTextComponent>
              )}
            </NavCollapseWrapper>
          </Navbar>
        </Container>
      </SurfaceComponent>
      {/* Nav link dropdown that has position: absolute */}
      <div>
        <MeDropdown
          profileExpanded={isComponentVisible}
          setIsComponentVisible={setIsComponentVisible}
          isLoggedIn={isLoggedIn}
          setIsTutorialOpen={setIsTutorialOpen}
          setShownTutorial={setShownTutorial}
        />
      </div>
    </div>
  );
}
