import React, { useEffect, useState, useCallback } from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { BsFillPersonFill } from 'react-icons/bs';
import styled from 'styled-components';
import posthog from 'posthog-js';
import Logo from './Logo';
import DarkModeButton from './DarkModeButton';
import MeDropdown from './MeDropdown';
import { useWindowDimensions } from './WindowDimensionsProvider';
import {
  breakpoints,
  logout,
  scrollToTop,
  useComponentVisible,
} from '../utilities';
import FBLoginButton from './FBLoginButton';
import styles from './Navbar.module.css';
import { SurfaceComponent, TextComponent } from './StyledComponents';
import { NavbarSearch } from './NavbarSearch';
import { useSearch } from '../searchContext';

const StyledMeIcon = styled.div`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgba(1, 1, 1, 0.1)' : '#525252'};
  color: ${({ theme }) => theme.text[1]};
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  transition: background-color 0.2s linear, color 0.2s linear;
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.primary};
  }
`;

const StyledDiv = styled.div`
  padding: 0.5rem 1rem 0.5rem 0rem;
  transition: 0.1s;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 500;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const StyledNavLink = styled(NavLink)`
  padding: 0.5rem 1rem 0.5rem 0rem;
  transition: 0.1s;
  color: ${({ theme }) => theme.text[1]};
  font-weight: 500;
  font-size: 1rem;
  ${breakpoints('font-size', 'rem', [{ 1320: 0.9 }])};
  &:hover {
    text-decoration: none !important;
    color: ${({ theme }) => theme.primary};
  }
  &.active {
    color: ${({ theme }) => theme.primary};
  }
`;

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
  isLoggedIn: boolean;
  themeToggler: () => void;
};

/**
 * Renders the navbar
 * @prop isLoggedIn - boolean | is user logged in?
 * @prop themeToggler - callback which toggles between light and dark mode
 */
function CourseTableNavbar({
  isLoggedIn,
  themeToggler,
  location,
}: RouteComponentProps & Props) {
  // Is navbar expanded in mobile view?
  const [nav_expanded, setExpand] = useState<boolean>(false);
  // Ref to detect outside clicks for profile dropdown
  const {
    ref_visible,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible<HTMLDivElement>(false);

  const { searchData, coursesLoading } = useSearch();

  // Fetch width of window
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = !isMobile && width < 1080;
  // const is_relative = width < 1230;

  const [show_search, setShowSearch] = useState(false);
  const [onCatalog, setOnCatalog] = useState(false);

  const navbar_style = () => {
    if (show_search) {
      return {
        height: width > 1320 ? '100px' : '88px',
        alignItems: 'start',
        paddingBottom: '0px',
      };
    }
    return undefined;
  };

  const NavCollapseWrapper: React.FC<{
    children: React.ReactNode;
  }> = useCallback(
    ({ children }) => {
      if (!isMobile && !isTablet && show_search) {
        return (
          <div className="ml-auto d-flex flex-column align-items-end justify-content-between h-100">
            {children}
          </div>
        );
      }
      return <>{children}</>;
    },
    [isMobile, isTablet, show_search]
  );

  // Handles onCatalog
  useEffect(() => {
    if (location && location.pathname === '/catalog') {
      setOnCatalog(true);
    } else {
      setOnCatalog(false);
    }
  }, [location]);

  // Decides whether to show search or not
  useEffect(() => {
    if (!isMobile && !isTablet && isLoggedIn && onCatalog) {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  }, [isMobile, isTablet, isLoggedIn, onCatalog]);

  return (
    <div className={styles.sticky_navbar}>
      <SurfaceComponent layer={0}>
        <Container fluid className="p-0">
          <Navbar
            expanded={nav_expanded}
            onToggle={(expanded: boolean) => setExpand(expanded)}
            // sticky="top"
            expand="md"
            className="shadow-sm px-3"
            style={navbar_style()}
          >
            {/* Logo in top left */}
            <Nav className={`${styles.nav_brand} navbar-brand py-2`}>
              <NavLink
                to="/"
                activeStyle={{
                  textDecoration: 'none',
                  display: 'table-cell',
                  verticalAlign: 'middle',
                }}
              >
                {/* Condense logo if on home page */}
                <span className={styles.nav_logo}>
                  <Logo icon={false} />
                </span>
              </NavLink>
            </Nav>

            <StyledNavToggle aria-controls="basic-navbar-nav" />

            {show_search && <NavbarSearch />}

            <NavCollapseWrapper>
              <Navbar.Collapse
                id="basic-navbar-nav"
                // Make navbar display: flex when not mobile. If mobile, normal formatting
                className={
                  !isMobile && !isTablet ? 'd-flex' : 'justify-content-end'
                }
                style={!isMobile && !isTablet ? { flexGrow: 0 } : undefined}
              >
                {/* Close navbar on click in mobile view */}
                <Nav onClick={() => setExpand(false)} style={{ width: '100%' }}>
                  {/* DarkMode Button */}
                  <div
                    className={`${styles.navbar_dark_mode_btn} d-flex ${
                      !isMobile ? 'ml-auto' : ''
                    }`}
                    onClick={themeToggler}
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
                        Worksheet
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
                      !isMobile && !isTablet ? 'align-self-end' : ''
                    }`}
                  >
                    <div className={styles.navbar_me}>
                      <StyledMeIcon
                        ref={ref_visible}
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
                  {/* Sign in/out and Facebook buttons. Show if mobile */}
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
                          posthog.capture('login');
                          window.location.href =
                            '/api/auth/cas?redirect=catalog';
                        }}
                      >
                        Sign In
                      </StyledDiv>
                    ) : (
                      <>
                        <StyledDiv>
                          <FBLoginButton />
                        </StyledDiv>
                        <StyledDiv onClick={logout}>Sign Out</StyledDiv>
                      </>
                    )}
                  </div>
                </Nav>
              </Navbar.Collapse>
              {show_search && (
                <small className="mb-2">
                  <TextComponent type={2}>
                    {coursesLoading
                      ? 'Searching ...'
                      : `Showing ${searchData.length} results`}
                  </TextComponent>
                </small>
              )}
            </NavCollapseWrapper>
          </Navbar>
        </Container>
      </SurfaceComponent>
      {/* Dropdown that has position: absolute */}
      <div>
        <MeDropdown
          profile_expanded={isComponentVisible}
          setIsComponentVisible={setIsComponentVisible}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}

export default withRouter(CourseTableNavbar);
