import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from './pages/Login';
import { useUser } from './user';

function App() {
  const { user, userRefresh } = useUser();

  useEffect(() => {
    userRefresh();
  }, []);

  const isLoggedIn = Boolean(user.worksheet !== null);

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/Table">
            {/*
              This route exists for compatability with the old authentication system.
              The PHP code will redirect to /Table upon a successful login.
              Once the PHP-based auth system is removed, this route can also be removed.
            */}
            <Redirect to="/" />
          </Route>
          {isLoggedIn ? <>
            <Route exact path="/">
              <p>hi this is some content</p>
            </Route>
            <Route path="/">
              <p>404 page not found</p>
            </Route>
          </> : <>
              {/* Redirect to login page if not currently logged in */}
              < Route path="/"><Redirect to="/login" /></Route>
            </>}
        </Switch>
      </div>
    </Router >
  );
}

export default App;
