import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from './pages/Login';
import axios from 'axios';

function App() {
  const [worksheet, setWorksheet] = useState(null);

  const fetchUserInfo = async () => {
    const res = await axios.get('/legacy_api/WorksheetActions.php?action=get&season=202001');
    if (!res.data.success) {
      throw res.data;
    }

    const worksheet = res.data.data;
    console.log(worksheet);
    setWorksheet(worksheet);
  }

  useEffect(() => {
    fetchUserInfo();
  }, [])

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
          {worksheet ? <>
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
