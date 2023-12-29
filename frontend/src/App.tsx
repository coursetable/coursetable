import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { Row, Spinner } from 'react-bootstrap';
import * as Sentry from '@sentry/react';

// Popular pages are eagerly fetched
import Search from './pages/Search';
import Worksheet from './pages/Worksheet';

import Notice from './components/Notice';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import Tutorial from './components/Tutorial';
import CourseModal from './components/CourseModal/CourseModal';

import { useUser } from './contexts/userContext';
import { useLocalStorageState } from './utilities/browserStorage';
import { suspended } from './utilities/display';
import { useWindowDimensions } from './contexts/windowDimensionsContext';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const Landing = suspended(() => import('./pages/Landing'));
const About = suspended(() => import('./pages/About'));
const FAQ = suspended(() => import('./pages/FAQ'));
const Privacy = suspended(() => import('./pages/Privacy'));
const NotFound = suspended(() => import('./pages/NotFound'));
const Thankyou = suspended(() => import('./pages/Thankyou'));
const Challenge = suspended(() => import('./pages/Challenge'));
const WorksheetLogin = suspended(() => import('./pages/WorksheetLogin'));
const Graphiql = suspended(() => import('./pages/Graphiql'));
const GraphiqlLogin = suspended(() => import('./pages/GraphiqlLogin'));
const Join = suspended(() => import('./pages/Join'));

function App() {
  const location = useLocation();
  // Fetch current device
  const { isMobile, isTablet } = useWindowDimensions();
  // User context data
  const { loading, user } = useUser();

  // Determine if user is logged in
  const isLoggedIn = Boolean(user.worksheet);

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
      location.pathname === '/catalog'
    )
      setIsTutorialOpen(true);
  }, [
    isMobile,
    isTablet,
    isLoggedIn,
    shownTutorial,
    location,
    setIsTutorialOpen,
  ]);

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
      {/* Notice bar */}
      <Notice>
        Please{' '}
        <a
          href="https://students.yale.edu/oce-submissions/studentSubmission/index"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'white', textDecoration: 'underline' }}
          onClick={() => {
            Sentry.captureMessage('Course evals link clicked');
          }}
        >
          fill out your course evals
        </a>{' '}
        — it's what powers this site! Help your peers make informed decisions 🤗
      </Notice>
      <Navbar isLoggedIn={isLoggedIn} setIsTutorialOpen={setIsTutorialOpen} />
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
      <CourseModal />
    </>
  );
}

export default App;
