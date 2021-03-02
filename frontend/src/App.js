import React, { useEffect, useState, useMemo } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import Tour from 'reactour';
import styled, { useTheme } from 'styled-components';

import { Row, Spinner, Button } from 'react-bootstrap';
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

const TourButton = styled(Button)`
  width: auto;
`;

/**
 * Render navbar and the corresponding page component for the route the user is on
 * @prop themeToggler - Function to toggle light/dark mode. Passed on to navbar and darkmodebutton
 */
function App({ themeToggler }) {
  // Page initialized as loading
  const [loading, setLoading] = useState(true);
  // User context data
  const { user, userRefresh, fbRefresh } = useUser();

  // React tour state
  const [isTourOpen, setIsTourOpen] = useState(true);

  const globalTheme = useTheme();

  // Change react tour styling based on theme
  const step_style = useMemo(
    () => ({
      maxWidth: '356px',
      backgroundColor: globalTheme.background,
      color: globalTheme.text[0],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }),
    [globalTheme]
  );

  // React tour steps
  const steps = [
    {
      selector: '',
      content: 'Welcome to CourseTable!',
      style: step_style,
    },
    {
      selector: '[data-tour="catalog-1"]',
      content: 'You can search and filter courses in the navbar.',
      style: step_style,
    },
    {
      selector: '[data-tour="catalog-2"]',
      content:
        'Click on a filter to show a dropdown where you can select multiple options.',
      style: step_style,
      observe: '[data-tour="catalog-2-observe"]',
      action: (node) => node.focus(),
    },
    {
      selector: '[data-tour="catalog-3"]',
      content: 'Slide the range handles to filter by a range of values.',
      style: step_style,
    },
    {
      selector: '[data-tour="catalog-4"]',
      content: () => (
        <div>
          Click on <strong>Advanced</strong> to see more advanced filters.
        </div>
      ),
      style: step_style,
      observe: '[data-tour="catalog-4-observe"]',
      action: (node) => node.focus(),
    },
    {
      selector: '[data-tour="catalog-5"]',
      content:
        'Click on a column toggle to sort by that column (ascending/descending).',
      style: step_style,
    },
    {
      selector: '',
      content: () => (
        <div>
          If you have any problems, you can leave feedback on our{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://coursetable.com/feedback"
          >
            <strong>Feedback page</strong>
          </a>{' '}
          .
        </div>
      ),
      style: step_style,
    },
    {
      selector: '',
      content: () => (
        <div>
          That's it! Click <strong>Finish Tour</strong> to start using
          CourseTable!
        </div>
      ),
      style: step_style,
    },
  ];

  // Refresh user worksheet and FB data on page load
  useEffect(() => {
    const a = userRefresh(true);
    const b = fbRefresh(true);

    Promise.allSettled([a, b]).finally(() => {
      // Set loading to false after user info and fb info is fetched
      setLoading(false);
    });
  }, [userRefresh, fbRefresh]);

  // Determine if user is logged in
  const isLoggedIn = Boolean(user.worksheet != null);

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
        Interested in joining our team of developers and designers? Apply{' '}
        <a href="https://docs.google.com/forms/d/1Z48Kz_IlCyZcxYxf345RsKslQaF4G_fxs-m-r8HHlwQ/viewform?edit_requested=true">
          here
        </a>
        ! 💖 &nbsp;What about a study group tool? Fill out this{' '}
        <a href="https://forms.gle/mY2bvA8JA2d1Zsk89">survey</a>!
      </Notice>
      <Navbar isLoggedIn={isLoggedIn} themeToggler={themeToggler} />
      <Switch>
        {/* Home Page */}
        <MyRoute exact path="/">
          {isLoggedIn ? (
            /* <Home /> */ <Redirect to="/catalog" />
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
            <Redirect push to="/challenge" />
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
              <Redirect push to="/challenge" />
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
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        accentColor={globalTheme.primary}
        rounded={6}
        showCloseButton={false}
        closeWithMask={false}
        showNavigationNumber={false}
        lastStepNextButton={<TourButton>Finish Tour</TourButton>}
      />
    </>
  );
}

export default App;
