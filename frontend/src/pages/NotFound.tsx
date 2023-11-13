import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundImage from '../images/not_found.svg';

/**
 * Renders the NotFound page when a user enters an invalid url
 */
function NotFound() {
  return (
    <div className="text-center py-5">
      <img
        alt="No courses found."
        className="py-5"
        src={NotFoundImage}
        style={{ width: '25%' }}
      />
      <h3>Page not found</h3>
      <div>
        If you think this is an error, please{' '}
        <Link to="/feedback">let us know</Link> and we will take a look.
      </div>
    </div>
  );
}

export default NotFound;
