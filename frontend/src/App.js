import React, { useEffect, useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WindowDimensionsProvider from './components/WindowDimensionsProvider';
import SeasonsProvider from './components/SeasonsProvider';

import Search from './pages/Search';
import Login from './pages/Login';
import About from './pages/About';
import Courses from './pages/Courses';
import Worksheet from './pages/Worksheet';

import { useUser } from './user';
import Spinner from 'react-bootstrap/Spinner';

function App() {
  const [loading, setLoading] = useState(true);
  const { user, userRefresh } = useUser();

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
  console.log(isLoggedIn);
  return (
    <Router>
      <WindowDimensionsProvider>
        <SeasonsProvider>
          <div id="base">
            <Navbar />
            <Switch>
              {/* Public Routes */}
              <MyRoute exact path="/about">
                <About />
              </MyRoute>

              <MyRoute exact path="/search">
                <Search />
              </MyRoute>

              <MyRoute exact path="/courses">
                <Courses />
              </MyRoute>

              {/* Auth */}
              <MyRoute exact path="/login">
                {isLoggedIn ? <Redirect to="/" /> : <Login />}
              </MyRoute>

              {/* Worksheet */}
              <MyRoute exact path="/worksheet">
                {isLoggedIn ? <Worksheet /> : <Redirect to="/login" />}
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
            {window.location.pathname !== '/search' && <Footer />}
          </div>
        </SeasonsProvider>
      </WindowDimensionsProvider>
    </Router>
  );
}

export default App;
