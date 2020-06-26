import React, { useEffect, useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar'
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

  return (
    <Router>
      <div>
        {isLoggedIn ? <Navbar /> : <Login />}
        <Switch>
          {/* Public Routes */}
          <MyRoute exact path="/about">
            <p>this is an about page</p>
          </MyRoute>

          {/* Auth */}
          <MyRoute exact path="/login">
            {isLoggedIn ? <Redirect to="/" /> : <Login />}
          </MyRoute>
          <MyRoute exact path="/Table">
            {/*
              This route exists for compatability with the old authentication system.
              The PHP code will redirect to /Table upon a successful login.
              Once the PHP-based auth system is removed, this route can also be removed.
            */}
            <Redirect to="/" />
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
      </div>
    </Router>
  );
}

export default App;
