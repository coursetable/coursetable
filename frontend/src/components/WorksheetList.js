import React, { useCallback, useMemo } from 'react';
import styles from './WorksheetList.module.css';
import { ListGroup } from 'react-bootstrap';
import WorksheetRowDropdown from './WorksheetRowDropdown';
import { SurfaceComponent } from './StyledComponents';
import WorksheetListItem from './WorksheetListItem';

/**
 * Render worksheet list in default worksheet view
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop toggleCourse - function to hide/show course
 * @prop setHoverCourse - function to darken calendar events of this listing
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 * @prop hidden_courses - dictionary of hidden courses
 */

function WorksheetList({
  courses,
  showModal,
  cur_season,
  season_codes,
  onSeasonChange,
  toggleCourse,
  setHoverCourse,
  setFbPerson,
  cur_person,
  hidden_courses,
}) {
  // Build the HTML for the list of courses of a given season
  const buildHtml = useCallback(
    (cur_season, courses) => {
      // List to hold HTML
      let items = [];
      // Variable for list keys
      let id = 0;

      // Iterate over all listings of this season
      courses.forEach((course) => {
        // Add listgroup item to items list
        items.push(
          <WorksheetListItem
            key={id++}
            course={course}
            cur_season={cur_season}
            showModal={showModal}
            toggleCourse={toggleCourse}
            setHoverCourse={setHoverCourse}
            hidden={hidden_courses[course.crn]}
          />
        );
      });

      return items;
    },
    [setHoverCourse, toggleCourse, showModal, hidden_courses]
  );

  const items = useMemo(() => {
    return buildHtml(cur_season, courses);
  }, [buildHtml, courses, cur_season]);

  return (
    <div className={styles.container}>
      {/* Season and FB friends dropdown */}
      <WorksheetRowDropdown
        cur_season={cur_season}
        season_codes={season_codes}
        onSeasonChange={onSeasonChange}
        setFbPerson={setFbPerson}
        cur_person={cur_person}
      />
      {/* List of courses for this season */}
      <SurfaceComponent layer={0} className={styles.table}>
        <ListGroup variant="flush">{items}</ListGroup>
      </SurfaceComponent>
    </div>
  );
}

// WorksheetList.whyDidYouRender = true;
export default React.memo(WorksheetList);
