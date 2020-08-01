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
import Login from './pages/Login';
import Home from './pages/Home';

import Search from './pages/Search';
import About from './pages/About';
import Courses from './pages/Courses';
import Worksheet from './pages/Worksheet';
import FAQ from './pages/FAQ';

import { useUser } from './user';
import Spinner from 'react-bootstrap/Spinner';

function App() {
  const [loading, setLoading] = useState(true);
  const { user, userRefresh } = useUser();
  const [parent_listings, setParentListings] = useState([]);

  useEffect(() => {
    userRefresh(true).finally(() => setLoading(false));
  }, [userRefresh]);

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
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
  return (
    <Router>
      <WindowDimensionsProvider>
        <SeasonsProvider>
          <div id="base">
            <Navbar isLoggedIn={isLoggedIn} listings={parent_listings} />
            <Switch>
              {/* Public Routes */}
              <MyRoute exact path="/">
                {isLoggedIn ? <Home /> : <Redirect to="/login" />}
              </MyRoute>

              <MyRoute exact path="/about">
                <About />
              </MyRoute>

              <MyRoute exact path="/faq">
                <FAQ />
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
                {isLoggedIn ? (
                  <Worksheet
                    parent_listings={parent_listings}
                    setParentListings={setParentListings}
                  />
                ) : (
                  <Redirect to="/login" />
                )}
              </MyRoute>

              {/* Private Routes */}
              <MyRoute isRoutePrivate={true} exact path="/">
                <p>hi this is some content</p>
              </MyRoute>

              {/* Catch-all Route */}
              <MyRoute path="/">
                <p>404 page not found</p>
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
