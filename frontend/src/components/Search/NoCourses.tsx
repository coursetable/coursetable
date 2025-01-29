import { Link } from 'react-router-dom';

import NoCoursesFound from '../../images/no_courses_found.svg';
import { useStore } from '../../store';
import { toSeasonString } from '../../utilities/course';

function NoCourses() {
  const viewedSeason = useStore((state) => state.viewedSeason);

  return (
    <div style={{ width: '100%' }} className="d-flex mb-5">
      <div className="text-center m-auto">
        <img
          alt="No courses found."
          className="py-5"
          src={NoCoursesFound}
          style={{ width: '50%' }}
        />
        <h3>No courses found for {toSeasonString(viewedSeason)}</h3>
        <div>
          Add some courses on the <Link to="/catalog">Catalog</Link>.
        </div>
      </div>
    </div>
  );
}

export default NoCourses;
