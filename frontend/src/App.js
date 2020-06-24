import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <p>hi this is some content</p>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
