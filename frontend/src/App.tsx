import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';

import { Row, Spinner } from 'react-bootstrap';
import * as Sentry from '@sentry/react';

// Popular pages are eagerly fetched
import Search from './pages/Search';
import Worksheet from './pages/Worksheet';

import Notice from './components/Notice';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import CourseModal from './components/CourseModal/CourseModal';

import { useUser } from './contexts/userContext';
import { useLocalStorageState } from './utilities/browserStorage';
import { suspended } from './utilities/display';
import { useWindowDimensions } from './contexts/windowDimensionsContext';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

function showIfAuthorized(
  hasEvals: boolean | undefined,
  element: JSX.Element,
  loginElem?: JSX.Element,
) {
  if (hasEvals === undefined) return loginElem ?? <Navigate to="/login" />;
  if (!hasEvals) return <Navigate to="/challenge" />;
  return element;
}

const Landing = suspended(() => import('./pages/Landing'));
const About = suspended(() => import('./pages/About'));
const FAQ = suspended(() => import('./pages/FAQ'));
const Privacy = suspended(() => import('./pages/Privacy.mdx'));
const NotFound = suspended(() => import('./pages/NotFound'));
const Thankyou = suspended(() => import('./pages/Thankyou'));
const Challenge = suspended(() => import('./pages/Challenge'));
const WorksheetLogin = suspended(() => import('./pages/WorksheetLogin'));
const Graphiql = suspended(() => import('./pages/Graphiql'));
const GraphiqlLogin = suspended(() => import('./pages/GraphiqlLogin'));
const Join = suspended(() => import('./pages/Join'));
const Fall23Release = suspended(() => import('./pages/releases/fall23.mdx'));
const Tutorial = suspended(() => import('./components/Tutorial'));

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
    if (!isMobile && !isTablet && isLoggedIn && !shownTutorial) {
      if (location.pathname === '/catalog') {
        setIsTutorialOpen(true);
      } else if (location.pathname !== '/worksheet') {
        // This can happen if the user got redirected to /challenge
        setIsTutorialOpen(false);
      }
    } else {
      setIsTutorialOpen(false);
    }
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
      <Notice
        // Increment for each new notice (though you don't need to change it
        // when removing a notice), or users who previously dismissed the banner
        // won't see the updated content.
        id={2}
      >
        Read about{' '}
        <Link
          to="/releases/fall23"
          style={{
            color: 'white',
            fontWeight: 'bold',
            textDecoration: 'underline',
          }}
        >
          what we've done in Fall/Winter 2023
        </Link>
        !
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

        {/* Authenticated routes */}
        {/* Catalog */}
        <Route
          path="/catalog"
          element={showIfAuthorized(user.hasEvals, <Search />)}
        />

        {/* Worksheet */}
        <Route
          path="/worksheet"
          element={showIfAuthorized(
            user.hasEvals,
            <Worksheet />,
            <WorksheetLogin />,
          )}
        />

        {/* Graphiql explorer */}
        <Route
          path="/graphiql"
          element={showIfAuthorized(
            user.hasEvals,
            <Graphiql />,
            <GraphiqlLogin />,
          )}
        />

        {/* Auth */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Landing />}
        />

        {/* OCE Challenge */}
        {/* Challenge handles its own auth */}
        <Route path="/challenge" element={<Challenge />} />

        {/* Static pages that don't need login */}
        {/* About */}
        <Route path="/about" element={<About />} />

        {/* Thank You */}
        <Route path="/thankyou" element={<Thankyou />} />

        {/* Join Us */}
        <Route path="/joinus" element={<Join />} />

        {/* Footer Links */}
        <Route path="/faq" element={<FAQ />} />

        {/* Privacy */}
        <Route path="/privacypolicy" element={<Privacy />} />

        <Route path="/Table" element={<Navigate to="/catalog" />} />

        <Route path="/releases/fall23" element={<Fall23Release />} />

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
