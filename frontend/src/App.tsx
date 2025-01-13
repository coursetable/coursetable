import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Helmet } from 'react-helmet';

import { useShallow } from 'zustand/react/shallow';
import CourseModal from './components/CourseModal/CourseModal';
import Footer from './components/Footer';
import Navbar from './components/Navbar/Navbar';
import Notice from './components/Notice';
import ProfModal from './components/ProfModal/ProfModal';
import Spinner from './components/Spinner';
import {
  useModalHistory,
  ModalHistoryProvider,
} from './contexts/modalHistoryContext';
import { useTutorial } from './contexts/tutorialContext';

// Popular pages are eagerly fetched
import Search from './pages/Search';
import Worksheet from './pages/Worksheet';

import { useStore, useInitStore } from './store';
import { suspended } from './utilities/display';
import styles from './App.module.css';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

const Landing = suspended(() => import('./pages/Landing'));
const About = suspended(() => import('./pages/About'));
const FAQ = suspended(() => import('./pages/FAQ'));
const Privacy = suspended(() => import('./pages/Privacy.mdx'));
const NotFound = suspended(() => import('./pages/NotFound'));
const Challenge = suspended(() => import('./pages/Challenge'));
const NeedsLogin = suspended(() => import('./pages/NeedsLogin'));
const Graphiql = suspended(() => import('./pages/Graphiql'));
const Join = suspended(() => import('./pages/Join'));
const ReleaseNotes = suspended(() => import('./pages/releases/releases'));
// TODO: use import.meta.glob instead of manual import
const Fall23Release = suspended(() => import('./pages/releases/fall23.mdx'));
const QuistRelease = suspended(() => import('./pages/releases/quist.mdx'));
const LinkPreview = suspended(
  () => import('./pages/releases/link-preview.mdx'),
);
const Spring24Release = suspended(
  () => import('./pages/releases/spring24.mdx'),
);
const Tutorial = suspended(() => import('./components/Tutorial'));

function Modal() {
  const { currentModal } = useModalHistory();
  if (!currentModal) return null;
  switch (currentModal.type) {
    case 'course':
      return <CourseModal listing={currentModal.data} />;
    case 'professor':
      return <ProfModal professorId={currentModal.data} />;
    default:
      return null;
  }
}

function AuthenticatedRoutes() {
  const { authStatus, user } = useStore(
    useShallow((state) => ({
      user: state.user,
      authStatus: state.authStatus,
    })),
  );

  const location = useLocation();

  if (authStatus === 'loading') return <Spinner message="Authenticating..." />;
  if (authStatus === 'initializing')
    return <Spinner message="Fetching user info..." />;

  switch (location.pathname) {
    case '/catalog':
    case '/worksheet':
      return <Outlet />;

    case '/login':
      if (authStatus === 'authenticated')
        return <Navigate to="/catalog" replace />;
      return <Outlet />;

    case '/graphiql':
      if (user?.hasEvals) return <Outlet />;
      return (
        <NeedsLogin
          redirect={location.pathname}
          message="the GraphQL interface"
        />
      );

    default:
      if (authStatus === 'authenticated') return <Outlet />;
      return <Navigate to="/login" replace />;
  }
}

function App() {
  const location = useLocation();
  const { isTutorialOpen } = useTutorial();
  useInitStore();

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
        // When removing a notice, just remove/comment the text content below.
        // Don't remove this wrapper.
        id={13}
      >
        {/* None */}
      </Notice>
      <Navbar />
      <SentryRoutes>
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/" element={<Navigate to="/catalog" replace />} />

          {/* Authenticated routes */}
          {/* Catalog and worksheet can be viewed by anyone; we put them under
          authenticated routes because we want loading auth to show a loading
          screen */}
          <Route path="/catalog" element={<Search />} />
          <Route path="/worksheet" element={<Worksheet />} />
          <Route path="/graphiql" element={<Graphiql />} />
          <Route path="/login" element={<Landing />} />
        </Route>

        {/* Challenge handles its own auth */}
        <Route path="/challenge" element={<Challenge />} />

        {/* Static pages that don't need login */}
        <Route path="/about" element={<About />} />
        <Route path="/joinus" element={<Join />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacypolicy" element={<Privacy />} />

        <Route path="/Table" element={<Navigate to="/catalog" />} />

        <Route path="/releases/fall23" element={<Fall23Release />} />
        <Route path="/releases/quist" element={<QuistRelease />} />
        <Route path="/releases/link-preview" element={<LinkPreview />} />
        <Route path="/releases/spring24" element={<Spring24Release />} />
        <Route path="/releases" element={<ReleaseNotes />} />
        {/* Catch-all route to NotFound page */}
        <Route path="/*" element={<NotFound />} />
      </SentryRoutes>
      <Footer />
      {/* Globally overlaid components */}
      {isTutorialOpen && <Tutorial />}
      {/* ModalProvider reads the location so it must be within the app */}
      <ModalHistoryProvider>
        <Modal />
      </ModalHistoryProvider>
    </div>
  );
}

export default App;
