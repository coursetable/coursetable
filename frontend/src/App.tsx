import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Helmet } from 'react-helmet';

import CourseModal from './components/CourseModal/CourseModal';
import Footer from './components/Footer';
import Navbar from './components/Navbar/Navbar';
import Notice from './components/Notice';
import Spinner from './components/Spinner';
import { useTutorial } from './contexts/tutorialContext';
import { useUser } from './contexts/userContext';

// Popular pages are eagerly fetched
import Search from './pages/Search';
import Worksheet from './pages/Worksheet';

import { suspended } from './utilities/display';
import styles from './App.module.css';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const Landing = suspended(() => import('./pages/Landing'));
const About = suspended(() => import('./pages/About'));
const FAQ = suspended(() => import('./pages/FAQ'));
const Privacy = suspended(() => import('./pages/Privacy.mdx'));
const NotFound = suspended(() => import('./pages/NotFound'));
const Thankyou = suspended(() => import('./pages/Thankyou'));
const Challenge = suspended(() => import('./pages/Challenge'));
const NeedsLogin = suspended(() => import('./pages/NeedsLogin'));
const Graphiql = suspended(() => import('./pages/Graphiql'));
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

  if (authStatus === 'loading') return <Spinner />;

  return (
    <div
      className={
        location.pathname === '/catalog' ? styles.catalogLayout : styles.layout
      }
    >
      {/* Default metadata; can be overridden by individual pages/components
      keep this in sync with index.html, so nothing actually changes after
      hydration, and things get restored to the default state when those
      components unmount */}
      <Helmet>
        <title>CourseTable</title>
        <meta
          name="description"
          content="CourseTable offers a clean and effective way for Yale students to find the courses they want, bringing together course information, student evaluations, and course demand statistics in an intuitive interface. It's run by a small team of volunteers within the Yale Computer Society and is completely open source."
        />
      </Helmet>
      <Notice
        // Increment for each new notice (though you don't need to change it
        // when removing a notice), or users who previously dismissed the banner
        // won't see the updated content.
        id={6}
      >
        {/* CourseTable will be undergoing maintenance today from 6-7:00 PM EDT.
        During this time, the site will be unavailable. We apologize for any
        inconvenience. */}
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

        <Route path="/catalog" element={<Search />} />

        {/* Authenticated routes */}
        <Route
          path="/worksheet"
          element={
            user.hasEvals ? (
              <Worksheet />
            ) : (
              <NeedsLogin redirect="/worksheet" message="worksheets" />
            )
          }
        />
        <Route
          path="/graphiql"
          element={
            user.hasEvals ? (
              <Graphiql />
            ) : (
              <NeedsLogin
                redirect="/graphiql"
                message="the GraphQL interface"
              />
            )
          }
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
    </div>
  );
}

export default App;
