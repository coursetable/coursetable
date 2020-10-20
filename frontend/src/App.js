import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  Suspense,
} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WindowDimensionsProvider from './components/WindowDimensionsProvider';
import SeasonsProvider from './components/SeasonsProvider';

import { useUser } from './user';
import { Row, Spinner } from 'react-bootstrap';

// Bundle these pages.
import Landing from './pages/Landing';
import Home from './pages/Home';

// Use code-splitting for the rest.
const Search = React.lazy(() => import('./pages/Search'));
const Worksheet = React.lazy(() => import('./pages/Worksheet'));
const About = React.lazy(() => import('./pages/About'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Feedback = React.lazy(() => import('./pages/Feedback'));
const Join = React.lazy(() => import('./pages/Join'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Thankyou = React.lazy(() => import('./pages/Thankyou'));
const Challenge = React.lazy(() => import('./pages/Challenge'));
const WorksheetLogin = React.lazy(() => import('./pages/WorksheetLogin'));

/**
 * Render navbar and the corresponding page component for the route the user is on
 */

function App() {
  // Page initialized as loading
  const [loading, setLoading] = useState(true);
  // User context data
  const { user, userRefresh, fbRefresh } = useUser();

  // Refresh user worksheet and FB data on page load
  useEffect(() => {
    userRefresh(true);
    // Set loading to false after FB is fetched
    fbRefresh(true).finally(() => setLoading(false));
  }, [userRefresh, fbRefresh]);

  // Determine if user is logged in
  const isLoggedIn = Boolean(user.worksheet !== null);

  // Custom route component that routes to login page if not logged in
  const MyRoute = useCallback(
    ({ children, isRoutePrivate, ...rest }) => {
      let contents;
      if (isRoutePrivate && !isLoggedIn) {
        contents = <Redirect to="/login" />;
      } else {
        contents = children;
      }

      return <Route {...rest}>{contents}</Route>;
    },
    [isLoggedIn]
  );

  const loader = useMemo(() => {
    return (
      <Row className="m-auto" style={{ height: '100%' }}>
        <Spinner className="m-auto" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Row>
    );
  }, []);

  // Render spinner if page loading
  if (loading) {
    return loader;
  }

  return (
    <Router>
      <WindowDimensionsProvider>
        <SeasonsProvider>
          <div id="base">
            <Navbar isLoggedIn={isLoggedIn} />
            <Suspense fallback={loader}>
              <Switch>
                {/* Home Page */}
                <MyRoute exact path="/">
                  {isLoggedIn ? <Home /> : <Redirect to="/login" />}
                </MyRoute>

                {/* About */}
                <MyRoute exact path="/about">
                  <About />
                </MyRoute>

                {/* Catalog */}
                <MyRoute exact path="/catalog">
                  <Search />
                </MyRoute>

                {/* Auth */}
                <MyRoute exact path="/login">
                  {isLoggedIn ? <Redirect to="/" /> : <Landing />}
                </MyRoute>

                <MyRoute exact path="/worksheetlogin">
                  {isLoggedIn ? (
                    <Redirect to="/worksheet" />
                  ) : (
                    <WorksheetLogin />
                  )}
                </MyRoute>

                {/* OCE Challenge */}
                <MyRoute exact path="/challenge">
                  <Challenge />
                </MyRoute>

                {/* Worksheet */}
                <MyRoute exact path="/worksheet">
                  {isLoggedIn ? (
                    <Worksheet />
                  ) : (
                    <Redirect to="/worksheetlogin" />
                  )}
                </MyRoute>

                {/* Thank You */}
                <MyRoute exact path="/thankyou">
                  <Thankyou />
                </MyRoute>

                {/* Footer Links */}

                <MyRoute exact path="/faq">
                  <FAQ />
                </MyRoute>

                <MyRoute exact path="/feedback">
                  <Feedback />
                </MyRoute>

                <MyRoute exact path="/joinus">
                  <Join />
                </MyRoute>

                <Route
                  path="/Blog"
                  component={() => {
                    window.location.href = 'https://coursetable.com/Blog';
                    return null;
                  }}
                />

                {/* Catch-all Route to NotFound Page */}
                <MyRoute path="/">
                  <NotFound />
                </MyRoute>
              </Switch>
            </Suspense>
            {/* Render footer if not on catalog or worksheet pages */}
            <Route
              render={({ location }) => {
                return !['/catalog'].includes(location.pathname) && <Footer />;
              }}
            />
          </div>
        </SeasonsProvider>
      </WindowDimensionsProvider>
    </Router>
  );
}

export default App;
