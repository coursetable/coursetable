import React from 'react';
import { NavLink } from 'react-router-dom';

import UnderConstruction from '../images/infrastructure.svg';
import { useWindowDimensions } from '../components/Providers/WindowDimensionsProvider';

/**
 * Renders the beta blocked page if user is not on the beta whitelist
 */
const BetaBlocked: React.VFC = () => {
  // Fetch current device
  const { isMobile } = useWindowDimensions();

  return (
    <div className="text-center py-5 px-3">
      <img
        alt="Beta blocked."
        className="py-3"
        src={UnderConstruction}
        style={isMobile ? { width: '100%' } : { width: '35%' }}
      />
      <h3>You do not have access to the beta.</h3>
      <div>
        If you should be on the whitelist, then please{' '}
        <NavLink to="/feedback">contact us</NavLink> to gain access.
      </div>
      <a href="https://coursetable.com" className="btn btn-primary mt-5 mb-3">
        Go back to CourseTable
      </a>
    </div>
  );
};

export default BetaBlocked;
