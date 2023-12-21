import React, { useEffect, useState } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { BsFillPersonFill } from 'react-icons/bs';
import { MdUpdate } from 'react-icons/md';
import styled from 'styled-components';
import Logo from './Logo';
import DarkModeButton from './DarkModeButton';
import MeDropdown from './MeDropdown';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';
import {
  breakpoints,
  logout,
  scrollToTop,
  useComponentVisible,
} from '../../utilities';
import styles from './Navbar.module.css';
import { SurfaceComponent, SmallTextComponent } from '../StyledComponents';
import { NavbarCatalogSearch } from './NavbarCatalogSearch';
import { DateTime, Duration } from 'luxon';

import { API_ENDPOINT } from '../../config';
import { useTheme } from '../../contexts/themeContext';
import { NavbarWorksheetSearch } from './NavbarWorksheetSearch';

// Profile icon
const StyledMeIcon = styled.div`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgba(1, 1, 1, 0.1)' : '#525252'};
  color: ${({ theme }) => theme.text[1]};
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  transition:
    border-color ${({ theme }) => theme.transDur},
    background-color ${({ theme }) => theme.transDur},
    color ${({ theme }) => theme.transDur};
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.primary};
  }
`;

// Sign in/out buttons
const StyledDiv = styled.div`
  padding: 0.5rem 1rem 0.5rem 0rem;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 500;
  ${breakpoints('font-size', 'rem', [{ 1320: 0.9 }])};
  user-select: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

// Nav links
const StyledNavLink = styled(NavLink)`
  padding: 0.5rem 1rem 0.5rem 0rem;
  color: ${({ theme }) => theme.text[1]};
  user-select: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  ${breakpoints('font-size', 'rem', [{ 1320: 0.9 }])};
  transition: color ${({ theme }) => theme.transDur};
  &:hover {
    text-decoration: none !important;
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

// Nav logo
const NavLogo = styled(Nav)`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
`;

type Props = {
  readonly isLoggedIn: boolean;
  readonly setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

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

/**
 * Renders the navbar
 * @prop isLoggedIn - is user logged in?
 * @prop setIsTutorialOpen - opens tutorial
 */
function CourseTableNavbar({ isLoggedIn, setIsTutorialOpen }: Props) {
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
    if (location && location.pathname === '/catalog') setPage('catalog');
    else if (location && location.pathname === '/worksheet')
      setPage('worksheet');
    else setPage('');
  }, [location]);

  // Decides whether to show search or not
  useEffect(() => {
    if (!isMobile && isLoggedIn && page) setShowSearch(true);
    else setShowSearch(false);
  }, [isMobile, isLoggedIn, page]);

  // Calculate time since last updated
  useEffect(() => {
    const dt = DateTime.now().setZone('America/New_York');
    let dtUpdate: DateTime;
    if (dt.hour < 3 || (dt.hour === 3 && dt.minute < 30)) {
      dtUpdate = dt
        .plus(Duration.fromObject({ days: -1 }))
        .set({ hour: 3, minute: 30, second: 0 });
    } else {
      dtUpdate = dt.set({ hour: 3, minute: 30, second: 0 });
    }
    const diffInSecs = dt.diff(dtUpdate).as('seconds');
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
    <div className={styles.sticky_navbar}>
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
            <NavLogo className="navbar-brand">
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
                <span className={styles.nav_logo}>
                  <Logo icon={false} />
                </span>
              </NavLink>
            </NavLogo>

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
                  className={`${
                    isMobile && 'align-items-start pt-2'
                  } position-relative`}
                  style={{ width: '100%' }}
                >
                  {/* DarkMode Button */}
                  <div
                    className={`${styles.navbar_dark_mode_btn} d-flex ${
                      !isMobile ? 'ml-auto' : ''
                    }`}
                    onClick={toggleTheme}
                  >
                    <DarkModeButton />
                  </div>
                  {isLoggedIn && (
                    <>
                      {/* Catalog Page */}
                      <StyledNavLink
                        to="/catalog"
                        onClick={scrollToTop}
                        id="catalog-link"
                      >
                        Catalog
                      </StyledNavLink>
                      {/* Worksheet Page */}
                      <StyledNavLink to="/worksheet" onClick={scrollToTop}>
                        <span data-tutorial="worksheet-1">Worksheet</span>
                      </StyledNavLink>
                    </>
                  )}
                  {(isMobile || !isLoggedIn) && (
                    <>
                      {/* About Page */}
                      <StyledNavLink to="/about" onClick={scrollToTop}>
                        About
                      </StyledNavLink>
                      {/* FAQ Page */}
                      <StyledNavLink to="/faq" onClick={scrollToTop}>
                        FAQ
                      </StyledNavLink>
                    </>
                  )}
                  {/* Profile Icon. Show if not mobile */}
                  <div
                    // Right align profile icon if not mobile
                    className={`d-none d-md-block ${
                      !isMobile ? 'align-self-end' : ''
                    }`}
                  >
                    <div className={styles.navbar_me}>
                      <StyledMeIcon
                        ref={elemRef}
                        className={`${styles.icon_circle} m-auto`}
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
                    <StyledDiv>
                      <a
                        href="https://old.coursetable.com/"
                        style={{ color: 'inherit' }}
                      >
                        Old CourseTable
                      </a>
                    </StyledDiv>
                    {!isLoggedIn ? (
                      <StyledDiv
                        onClick={() => {
                          window.location.href = `${API_ENDPOINT}/api/auth/cas?redirect=catalog`;
                        }}
                      >
                        Sign In
                      </StyledDiv>
                    ) : (
                      <StyledDiv onClick={logout}>Sign Out</StyledDiv>
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
          profile_expanded={isComponentVisible}
          setIsComponentVisible={setIsComponentVisible}
          isLoggedIn={isLoggedIn}
          setIsTutorialOpen={setIsTutorialOpen}
        />
      </div>
    </div>
  );
}

export default CourseTableNavbar;
