import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Row, Spinner } from 'react-bootstrap';
import * as Sentry from '@sentry/react';
//import Notice from './components/Notice';
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

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

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
  const { user, userRefresh, friendRefresh, friendReqRefresh, getAllNames } =
    useUser();

  // Refresh user worksheet and FB data on page load
  useEffect(() => {
    const a = userRefresh(true);
    const b = friendRefresh(true);
    const c = friendReqRefresh(true);
    const d = getAllNames(true);

    Promise.allSettled([a, b, c, d]).finally(() => {
      // Set loading to false after user info is fetched
      setLoading(false);
    });
  }, [userRefresh, friendRefresh, friendReqRefresh, getAllNames]);

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
      {/* notice bar*/}
      {/*<Notice >
    </Notice>*/}
      <Navbar
        isLoggedIn={isLoggedIn}
        themeToggler={themeToggler}
        setIsTutorialOpen={setIsTutorialOpen}
      />
      <SentryRoutes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              /* <Home /> */ <Navigate to="/catalog" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* About */}
        <Route path="/about" element={<About />} />

        {/* Catalog */}
        <Route
          path="/catalog"
          element={
            !isLoggedIn ? (
              <Navigate to="/login" />
            ) : !user.hasEvals ? (
              <Navigate to="/challenge" />
            ) : (
              <Search />
            )
          }
        />

        {/* Auth */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Landing />}
        />

        <Route
          path="/worksheetlogin"
          element={
            isLoggedIn ? <Navigate to="/worksheet" /> : <WorksheetLogin />
          }
        />

        {/* OCE Challenge */}
        <Route path="/challenge" element={<Challenge />} />

        {/* Worksheet */}
        <Route
          path="/worksheet"
          element={
            isLoggedIn && user.hasEvals ? (
              <Worksheet />
            ) : (
              <Navigate to="/worksheetlogin" />
            )
          }
        />

        {/* Graphiql explorer */}
        <Route
          path="/graphiql"
          element={isLoggedIn ? <Graphiql /> : <GraphiqlLogin />}
        />

        {/* Thank You */}
        <Route path="/thankyou" element={<Thankyou />} />

        {/* Join Us */}
        <Route path="/joinus" element={<Join />} />

        {/* Footer Links */}
        <Route path="/faq" element={<FAQ />} />

        {/* Privacy */}
        <Route path="/privacypolicy" element={<Privacy />} />

        <Route path="/Table" element={<Navigate to="/catalog" />} />

        {/* Catch-all Route to NotFound Page */}
        <Route path="/*" element={<NotFound />} />
        {/* Render footer if not on catalog */}
      </SentryRoutes>
      {!['/catalog'].includes(location.pathname) && <Footer />}
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
