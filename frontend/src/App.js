import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';

import Notice from './components/Notice';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Landing from './pages/Landing';
// import Home from './pages/Home';

import Search from './pages/Search';
import About from './pages/About';
import Worksheet from './pages/Worksheet';
import FAQ from './pages/FAQ';
import Feedback from './pages/Feedback';
import Join from './pages/Join';
import NotFound from './pages/NotFound';
import Thankyou from './pages/Thankyou';
import Challenge from './pages/Challenge';
import WorksheetLogin from './pages/WorksheetLogin';

import { useUser } from './user';
import { Row, Spinner } from 'react-bootstrap';

/**
 * Render navbar and the corresponding page component for the route the user is on
 * @prop themeToggler - Function to toggle light/dark mode. Passed on to navbar and darkmodebutton
 */
function App({ themeToggler }) {
  // Page initialized as loading
  const [loading, setLoading] = useState(true);
  // User context data
  const { user, userRefresh, fbRefresh } = useUser();

  // Refresh user worksheet and FB data on page load
  useEffect(() => {
    // Set loading to false after user info and fb info is fetched
    Promise.all([userRefresh(true), fbRefresh(true)]).finally(() =>
      setLoading(false)
    );
  }, [userRefresh, fbRefresh]);

  // Determine if user is logged in
  const isLoggedIn = Boolean(user.worksheet !== null);

  const MyRoute = Route;

  // Render spinner if page loading
  if (loading) {
    return (
      <Row className="m-auto" style={{ height: '100vh' }}>
        <Spinner className="m-auto" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Row>
    );
  }
  return (
    <>
      <Notice>
        CourseTable v2.0 is under construction, but{' '}
        <Link to="/feedback">feedback</Link> is welcome. The{' '}
        <a href="https://old.coursetable.com">old site</a> is also still
        available.
      </Notice>
      <Navbar isLoggedIn={isLoggedIn} themeToggler={themeToggler} />
      <Switch>
        {/* Home Page */}
        <MyRoute exact path="/">
          {isLoggedIn ? (
            /*<Home />*/ <Redirect to="/catalog" />
          ) : (
            <Redirect to="/login" />
          )}
        </MyRoute>

        {/* About */}
        <MyRoute exact path="/about">
          <About />
        </MyRoute>

        {/* Catalog */}
        <MyRoute exact path="/catalog">
          {isLoggedIn && !user.hasEvals ? (
            <Redirect push={true} to="/challenge" />
          ) : (
            <Search />
          )}
        </MyRoute>

        {/* Auth */}
        <MyRoute exact path="/login">
          {isLoggedIn ? <Redirect to="/" /> : <Landing />}
        </MyRoute>

        <MyRoute exact path="/worksheetlogin">
          {isLoggedIn ? <Redirect to="/worksheet" /> : <WorksheetLogin />}
        </MyRoute>

        {/* OCE Challenge */}
        <MyRoute exact path="/challenge">
          <Challenge />
        </MyRoute>

        {/* Worksheet */}
        <MyRoute exact path="/worksheet">
          {isLoggedIn ? (
            user.hasEvals ? (
              <Worksheet />
            ) : (
              <Redirect push={true} to="/challenge" />
            )
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

        <MyRoute path="/Table">
          <Redirect to="/catalog" />
        </MyRoute>

        {/* Catch-all Route to NotFound Page */}
        <MyRoute path="/">
          <NotFound />
        </MyRoute>
      </Switch>
      {/* Render footer if not on catalog or worksheet pages */}
      <Route
        render={({ location }) => {
          return !['/catalog'].includes(location.pathname) && <Footer />;
        }}
      />
    </>
  );
}

export default App;
