import React, { useMemo } from 'react';
import { ListGroup } from 'react-bootstrap';
import styles from './WorksheetList.module.css';
import WorksheetRowDropdown from './WorksheetRowDropdown';
import { SurfaceComponent } from './StyledComponents';
import WorksheetListItem from './WorksheetListItem';
import NoCourses from './NoCourses';
import { useWorksheet } from '../worksheetContext';

/**
 * Render worksheet list in default worksheet view
 */

function WorksheetList() {
  const { courses, cur_season, hidden_courses } = useWorksheet();

  // Build the HTML for the list of courses of a given season
  const items = useMemo(() => {
    // List to hold HTML
    const items = [];

    // Iterate over all listings of this season
    courses.forEach((course, id) => {
      // Add listgroup item to items list
      items.push(
        <WorksheetListItem
          key={id}
          course={course}
          hidden={hidden_courses[course.crn]}
        />
      );
    });

    return items;
  }, [courses, hidden_courses]);

  return (
    <div className={styles.container}>
      {/* Season and FB friends dropdown */}
      <WorksheetRowDropdown
        areHidden={Object.keys(hidden_courses).length === courses.length}
      />
      {/* List of courses for this season */}
      <SurfaceComponent layer={0} className={`${styles.table} mx-1`}>
        {items.length > 0 ? (
          // There are courses for this season
          <ListGroup variant="flush">{items}</ListGroup>
        ) : (
          // There aren't courses for this season
          <NoCourses cur_season={cur_season} />
        )}
      </SurfaceComponent>
    </div>
  );
}

// WorksheetList.whyDidYouRender = true;
export default React.memo(WorksheetList);
