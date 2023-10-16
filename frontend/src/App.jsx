import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';

import { Row, Spinner } from 'react-bootstrap';
import Notice from './components/Notice';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import Tutorial from './components/Tutorial';

import Landing from './pages/Landing';

import Search from './pages/Search';
import About from './pages/About';
import Worksheet from './pages/Worksheet';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import Thankyou from './pages/Thankyou';
import Challenge from './pages/Challenge';
import WorksheetLogin from './pages/WorksheetLogin';
import Graphiql from './pages/Graphiql';
import GraphiqlLogin from './pages/GraphiqlLogin';
import Join from './pages/Join';

import { useUser } from './contexts/userContext';
import { useLocalStorageState } from './browserStorage';
import { useWindowDimensions } from './components/Providers/WindowDimensionsProvider';
import { lightTheme } from './components/Themes';

/**
 * Render navbar and the corresponding page component for the route the user is on
 * @prop themeToggler - function | to toggle light/dark mode. Passed on to navbar and darkmodebutton
 */
function App({ themeToggler }) {
  const location = useLocation();
  // Fetch current device
  const { isMobile, isTablet } = useWindowDimensions();
  // Page initialized as loading
  const [loading, setLoading] = useState(true);
  // User context data
  const { user, userRefresh, fbRefresh } = useUser();

  // Refresh user worksheet and FB data on page load
  useEffect(() => {
    const a = userRefresh(true);
    const b = fbRefresh(true);

    Promise.allSettled([a, b]).finally(() => {
      // Set loading to false after user info and fb info is fetched
      setLoading(false);
    });
  }, [userRefresh, fbRefresh]);

  // Determine if user is logged in
  const isLoggedIn = Boolean(user.worksheet != null);

  // Tutorial state
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // First tutorial state
  const [shownTutorial, setShownTutorial] = useLocalStorageState(
    'shownTutorial',
    false,
  );

  // Handle whether or not to open tutorial
  useEffect(() => {
    if (
      !isMobile &&
      !isTablet &&
      isLoggedIn &&
      !shownTutorial &&
      location &&
      location.pathname === '/catalog'
    ) {
      setIsTutorialOpen(true);
    }
  }, [
    isMobile,
    isTablet,
    isLoggedIn,
    shownTutorial,
    location,
    setIsTutorialOpen,
  ]);

  useEffect(() => {
    document.body.style.transition = `background-color ${lightTheme.trans_dur}`;
  }, []);

  // Render spinner if page loading
  if (loading) {
    return (
      <Row className="m-auto" style={{ height: '100vh' }}>
        <Spinner className="m-auto" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Row>
    );
  }

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        themeToggler={themeToggler}
        setIsTutorialOpen={setIsTutorialOpen}
      />
      <Switch>
        {/* Home Page */}
        <Route exact path="/">
          {isLoggedIn ? (
            /* <Home /> */ <Redirect to="/catalog" />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        {/* About */}
        <Route exact path="/about">
          <About />
        </Route>

        {/* Catalog */}
        <Route exact path="/catalog">
          {!isLoggedIn ? (
            <Redirect push to="/login" />
          ) : !user.hasEvals ? (
            <Redirect push to="/challenge" />
          ) : (
            <Search />
          )}
        </Route>

        {/* Auth */}
        <Route exact path="/login">
          {isLoggedIn ? <Redirect to="/" /> : <Landing />}
        </Route>

        <Route exact path="/worksheetlogin">
          {isLoggedIn ? <Redirect to="/worksheet" /> : <WorksheetLogin />}
        </Route>

        {/* OCE Challenge */}
        <Route exact path="/challenge">
          <Challenge />
        </Route>

        {/* Worksheet */}
        <Route exact path="/worksheet">
          {isLoggedIn && user.hasEvals ? (
            <Worksheet />
          ) : (
            <Redirect to="/worksheetlogin" />
          )}
        </Route>

        {/* Graphiql explorer */}
        <Route exact path="/graphiql">
          {isLoggedIn ? <Graphiql /> : <GraphiqlLogin />}
        </Route>

        {/* Thank You */}
        <Route exact path="/thankyou">
          <Thankyou />
        </Route>

        {/* Join Us */}
        <Route exact path="/joinus">
          <Join />
        </Route>

        {/* Footer Links */}

        <Route exact path="/faq">
          <FAQ />
        </Route>

        {/* Privacy */}
        <Route exact path="/privacypolicy">
          <Privacy />
        </Route>

        <Route path="/Table">
          <Redirect to="/catalog" />
        </Route>

        {/* Catch-all Route to NotFound Page */}
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
      {/* Render footer if not on catalog */}
      <Route
        render={({ location: routeLocation }) => {
          return !['/catalog'].includes(routeLocation.pathname) && <Footer />;
        }}
      />
      {/* Tutorial for first-time users */}
      <Tutorial
        isTutorialOpen={isTutorialOpen}
        setIsTutorialOpen={setIsTutorialOpen}
        shownTutorial={shownTutorial}
        setShownTutorial={setShownTutorial}
      />
    </>
  );
}

export default App;
