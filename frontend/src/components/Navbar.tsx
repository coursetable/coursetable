import React, { useCallback, useRef, useState } from 'react';
import { Nav, Navbar, Container, Form, Row, InputGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill } from 'react-icons/bs';
import styled from 'styled-components';
import posthog from 'posthog-js';
import Logo from './Logo';
import DarkModeButton from './DarkModeButton';
import MeDropdown from './MeDropdown';
import { useWindowDimensions } from './WindowDimensionsProvider';
import { logout, scrollToTop, useComponentVisible } from '../utilities';
import FBLoginButton from './FBLoginButton';
import styles from './Navbar.module.css';
import { StyledInput, SurfaceComponent } from './StyledComponents';
import { scroller } from 'react-scroll';
import { useSessionStorageState } from '../browserStorage';
import { GlobalHotKeys } from 'react-hotkeys';

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

const StyledNavbar = styled(Navbar)`
  height: 100px;
  align-items: start;
`;

const NavbarStyledSearchBar = styled(StyledInput)`
  border-radius: 4px;
  height: 100%;
  font-size: 14px;

  background-color: ${({ theme }) => theme.select};
  color: ${({ theme }) => theme.text[0]};
  transition: 0.2s linear !important;
  border: solid 2px rgba(0, 0, 0, 0.1);

  &:hover {
    border: 2px solid hsl(0, 0%, 70%);
  }

  &:focus {
    background-color: ${({ theme }) => theme.select};
  }

  &.form-control:focus {
    color: ${({ theme }) => theme.text[0]};
  }
`;

/**
 * Renders the navbar
 * @prop isLoggedIn - boolean | is user logged in?
 * @prop themeToggler - callback which toggles between light and dark mode
 */
function CourseTableNavbar({
  isLoggedIn,
  themeToggler,
}: {
  isLoggedIn: boolean;
  themeToggler: () => void;
}) {
  // Is navbar expanded in mobile view?
  const [nav_expanded, setExpand] = useState<boolean>(false);
  // Ref to detect outside clicks for profile dropdown
  const {
    ref_visible,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible<HTMLDivElement>(false);

  // Fetch width of window
  const { width } = useWindowDimensions();
  const is_mobile = width < 768;
  // const is_relative = width < 1230;

  // Search text for the default search if search bar was used
  const searchTextInput = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useSessionStorageState('searchText', '');

  const scroll_to_results = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault();

      // Scroll down to catalog when in mobile view.
      if (is_mobile) {
        scroller.scrollTo('catalog', {
          smooth: true,
          duration: 500,
          offset: -56,
        });
      }
    },
    [is_mobile]
  );

  // ctrl/cmd-f search hotkey
  const focusSearch = (e: KeyboardEvent | undefined) => {
    if (e && searchTextInput.current) {
      e.preventDefault();
      searchTextInput.current.focus();
    }
  };
  const keyMap = {
    FOCUS_SEARCH: ['ctrl+f', 'command+f'],
  };
  const handlers = {
    FOCUS_SEARCH: focusSearch,
  };

  return (
    <div className={styles.sticky_navbar}>
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={handlers}
        allowChanges // required for global
        style={{ outline: 'none' }}
      />
      <SurfaceComponent layer={0}>
        <Container fluid className="p-0">
          <StyledNavbar
            expanded={nav_expanded}
            onToggle={(expanded: boolean) => setExpand(expanded)}
            // sticky="top"
            expand="md"
            className="shadow-sm px-3"
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

            {/* Search Form */}
            <Form
              className={`px-0 ${styles.full_height}`}
              onSubmit={scroll_to_results}
            >
              <Row className={`${styles.half_height} mx-auto`}>
                <div className={styles.search_bar}>
                  {/* Search Bar */}
                  <InputGroup className={styles.full_height}>
                    <NavbarStyledSearchBar
                      type="text"
                      value={searchText}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchText(event.target.value)
                      }
                      placeholder="Search by course code, title, prof, or whatever we don't really care"
                      ref={searchTextInput}
                    />
                  </InputGroup>
                </div>
              </Row>
            </Form>

            <Navbar.Collapse
              id="basic-navbar-nav"
              // Make navbar display: flex when not mobile. If mobile, normal formatting
              className={!is_mobile ? 'd-flex' : 'justify-content-end'}
            >
              {/* Close navbar on click in mobile view */}
              <Nav onClick={() => setExpand(false)} style={{ width: '100%' }}>
                {/* DarkMode Button */}
                <div
                  className={`${styles.navbar_dark_mode_btn} d-flex ml-auto`}
                  onClick={themeToggler}
                >
                  <DarkModeButton />
                </div>

                {/* Catalog Page */}
                <StyledNavLink
                  to="/catalog"
                  // Right align catalog link if not mobile
                  className={!is_mobile ? ' align-self-end' : ''}
                  onClick={scrollToTop}
                >
                  Catalog
                </StyledNavLink>
                {/* Worksheet Page */}
                <StyledNavLink
                  to="/worksheet"
                  // Right align worksheet link if not mobile
                  className={!is_mobile ? ' align-self-end' : ''}
                  onClick={scrollToTop}
                >
                  Worksheet
                </StyledNavLink>

                {/* Profile Icon. Show if not mobile */}
                <div
                  // Right align profile icon if not mobile
                  className={`d-none d-md-block ${
                    !is_mobile ? 'align-self-end' : ''
                  }`}
                >
                  <div className={styles.navbar_me}>
                    <StyledMeIcon
                      ref={ref_visible}
                      className={`${styles.icon_circle} m-auto`}
                      onClick={() => setIsComponentVisible(!isComponentVisible)}
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

                        window.location.href = '/api/auth/cas?redirect=catalog';
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
          </StyledNavbar>
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

export default CourseTableNavbar;
