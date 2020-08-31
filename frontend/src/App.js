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
import Courses from './pages/Courses';
import Worksheet from './pages/Worksheet';
import FAQ from './pages/FAQ';
import Changelog from './pages/Changelog';
import Feedback from './pages/Feedback';
import Join from './pages/Join';
import NotFound from './pages/NotFound';

import { useUser } from './user';
import { Row, Spinner } from 'react-bootstrap';

function App() {
  const [loading, setLoading] = useState(true);
  const { user, userRefresh, fbRefresh } = useUser();

  useEffect(() => {
    userRefresh(true);
    fbRefresh(true).finally(() => setLoading(false));
  }, [userRefresh, fbRefresh]);

  const isLoggedIn = Boolean(user.worksheet !== null);

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
              {/* Public Routes */}
              <MyRoute exact path="/">
                {isLoggedIn ? <Home /> : <Redirect to="/login" />}
              </MyRoute>

              <MyRoute exact path="/about">
                <About />
              </MyRoute>

              <MyRoute
                exact
                path="/catalog"
                render={(props) => <Search {...props} />}
              />

              <MyRoute exact path="/courses">
                <Courses />
              </MyRoute>

              {/* Auth */}
              <MyRoute exact path="/login">
                {isLoggedIn ? (
                  <Redirect to="/" />
                ) : (
                  <Landing isLoggedIn={isLoggedIn} />
                )}
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

              {/* Catch-all Route */}
              <MyRoute path="/">
                <NotFound />
              </MyRoute>
            </Switch>
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
