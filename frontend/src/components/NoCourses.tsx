import React from 'react';
import NoCoursesFound from '../images/no_courses_found.svg';
import { toSeasonString } from '../courseUtilities';

type Props = {
  /** Message to display in the error page */
  cur_season: string;
};

const NoCourses: React.VFC<Props> = ({ cur_season }) => {
  return (
    <div style={{ width: '100%' }} className="d-flex">
      <div className="text-center m-auto">
        <img
          alt="No courses found."
          className="py-5"
          src={NoCoursesFound}
          style={{ width: '50%' }}
        />
        <h3>No courses found for</h3>
        <h3 className="mb-5">
          {toSeasonString(cur_season).slice(1, 3).reverse().join(' ')}
        </h3>
      </div>
    </div>
  );
};

export default NoCourses;
