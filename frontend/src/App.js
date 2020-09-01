import React, { useEffect, useState, useCallback } from 'react';
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

import Landing from './pages/Landing';
import Home from './pages/Home';

import Search from './pages/Search';
import About from './pages/About';
import Worksheet from './pages/Worksheet';
import FAQ from './pages/FAQ';
import Changelog from './pages/Changelog';
import Feedback from './pages/Feedback';
import Join from './pages/Join';
import NotFound from './pages/NotFound';

import { useUser } from './user';
import { Row, Spinner } from 'react-bootstrap';

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

  // Render spinner if page loading
  if (loading) {
    return (
      <Row className="m-auto" style={{ height: '100%' }}>
        <Spinner className="m-auto" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Row>
    );
  }
  return (
    <Router>
      <WindowDimensionsProvider>
        <SeasonsProvider>
          <div id="base">
            <Navbar isLoggedIn={isLoggedIn} />
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
              <MyRoute
                exact
                path="/catalog"
                render={(props) => <Search {...props} />}
              />

              {/* Auth */}
              <MyRoute exact path="/login">
                {isLoggedIn ? <Redirect to="/" /> : <Landing />}
              </MyRoute>

              {/* Worksheet */}
              <MyRoute isRoutePrivate={true} exact path="/worksheet">
                {isLoggedIn ? <Worksheet /> : <Redirect to="/login" />}
              </MyRoute>

              {/* Footer Links */}

              <MyRoute exact path="/faq">
                <FAQ />
              </MyRoute>

              <MyRoute exact path="/changelog">
                <Changelog />
              </MyRoute>

              <MyRoute exact path="/feedback">
                <Feedback />
              </MyRoute>

              <MyRoute exact path="/joinus">
                <Join />
              </MyRoute>

              {/* Catch-all Route to NotFound Page */}
              <MyRoute path="/">
                <NotFound />
              </MyRoute>
            </Switch>
            {/* Render footer if not on catalog or worksheet pages */}
            <Route
              render={({ location }) => {
                return (
                  !['/catalog', '/worksheet'].includes(location.pathname) && (
                    <Footer />
                  )
                );
              }}
            />
          </div>
        </SeasonsProvider>
      </WindowDimensionsProvider>
    </Router>
  );
}

export default App;
