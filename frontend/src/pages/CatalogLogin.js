import React from 'react';
import Authentication from '../images/authentication.svg';

/**
 * Renders a login page if user tries to access catalog page
 */

function CatalogLogin() {
  return (
    <div className="text-center py-5">
      <h3>
        Please{' '}
        <a href="/legacy_api/index.php?forcelogin=1&successurl=catalog">
          log in
        </a>
      </h3>
      <div>A valid Yale NetID is required to access the catalog.</div>
      <img
        alt="Not logged in"
        className="py-5"
        src={Authentication}
        style={{ width: '25%' }}
      ></img>
    </div>
  );
}

export default CatalogLogin;
