import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

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
import { useTutorial } from './contexts/tutorialContext';
import { suspended } from './utilities/display';

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
const ReleaseNotes = suspended(() => import('./pages/releases/releases'));
// TODO: use import.meta.glob instead of manual import
const Fall23Release = suspended(() => import('./pages/releases/fall23.mdx'));
const QuistRelease = suspended(() => import('./pages/releases/quist.mdx'));
const Tutorial = suspended(() => import('./components/Tutorial'));

function App() {
  const location = useLocation();
  const { authStatus, user } = useUser();
  const { isTutorialOpen } = useTutorial();

  if (authStatus === 'loading') {
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
      <Notice
        // Increment for each new notice (though you don't need to change it
        // when removing a notice), or users who previously dismissed the banner
        // won't see the updated content.
        id={4}
      >
        Basic course information is now publicly available without login! Share
        courses with your family and friends with ease ;)
      </Notice>
      <Navbar />
      <SentryRoutes>
        <Route
          path="/"
          element={
            authStatus === 'authenticated' ? (
              <Navigate to="/catalog" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Authenticated routes */}
        <Route path="/catalog" element={<Search />} />
        <Route
          path="/worksheet"
          element={showIfAuthorized(
            user.hasEvals,
            <Worksheet />,
            <WorksheetLogin />,
          )}
        />
        <Route
          path="/graphiql"
          element={showIfAuthorized(
            user.hasEvals,
            <Graphiql />,
            <GraphiqlLogin />,
          )}
        />
        <Route
          path="/login"
          element={
            authStatus === 'authenticated' ? <Navigate to="/" /> : <Landing />
          }
        />

        {/* Challenge handles its own auth */}
        <Route path="/challenge" element={<Challenge />} />

        {/* Static pages that don't need login */}
        <Route path="/about" element={<About />} />
        <Route path="/thankyou" element={<Thankyou />} />
        <Route path="/joinus" element={<Join />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacypolicy" element={<Privacy />} />

        <Route path="/Table" element={<Navigate to="/catalog" />} />

        <Route path="/releases/fall23" element={<Fall23Release />} />
        <Route path="/releases/quist" element={<QuistRelease />} />
        <Route path="/releases" element={<ReleaseNotes />} />
        {/* Catch-all Route to NotFound Page */}
        <Route path="/*" element={<NotFound />} />
      </SentryRoutes>
      {/* Render footer if not on catalog */}
      {!['/catalog'].includes(location.pathname) && <Footer />}
      {/* Globally overlaid components */}
      {isTutorialOpen && <Tutorial />}
      <CourseModal />
    </>
  );
}

export default App;
