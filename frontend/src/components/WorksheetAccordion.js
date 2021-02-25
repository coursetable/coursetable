import React, { useCallback, useContext, useMemo } from 'react';
import moment from 'moment';
import chroma from 'chroma-js';
import { Badge, Row, Col, Accordion, Card } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { ThemeContext } from 'styled-components';
import SeasonDropdown from './SeasonDropdown';
import FBDropdown from './FBDropdown';
import {
  TextComponent,
  StyledBanner,
  StyledCard,
  SurfaceComponent,
} from './StyledComponents';
import { skillsAreasColors } from '../queries/Constants';
import tagStyles from './SearchResultsItem.module.css';
import styles from './WorksheetAccordion.module.css';
import { weekdays } from '../common';
import NoCourses from './NoCourses';

// Component used to trim description to certain number of lines
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

// Render custom accordion items
function ContextAwareToggle({ eventKey, callback, course }) {
  // Get current selected item
  const currentEventKey = useContext(AccordionContext);
  const theme = useContext(ThemeContext);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  // Is this item selected?
  const isCurrentEventKey = currentEventKey === eventKey;

  // Remove weekday from course times
  const trim = (time_string) => {
    // Iterate over each char in the time string
    for (let i = 0; i < time_string.length; i++) {
      // If we see a number, then we have passed the weekdays and can return the rest of the string
      if (time_string[i] >= '0' && time_string[i] <= '9')
        return time_string.substr(i, time_string.length - i);
    }
    return null;
  };

  const style_color = {
    backgroundColor: theme.select_hover,
  };

  return (
    <div
      style={isCurrentEventKey ? style_color : {}}
      onClick={decoratedOnClick}
    >
      <Row className={`${styles.header} p-2 mx-auto`}>
        <Col xs="auto" style={{ fontWeight: 500 }}>
          {/* Course Code */}
          <Row>{course.course_code}</Row>
          <Row>
            {/* Course Location. NOT LINKING TO YALE CAMPUS MAP RN */}
            <TextComponent type={1}>
              <small>
                {/* <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={course['location_url']}
                        className={styles.location_url + ' text-muted'}
                      >
                        {course.locations_summary}
                      </a> */}
                {course.locations_summary}
              </small>
            </TextComponent>
          </Row>
        </Col>
        {/* Course Time */}
        <Col xs="auto" className="p-0">
          <TextComponent type={1}>{trim(course.times_summary)}</TextComponent>
        </Col>
      </Row>
    </div>
  );
}

/**
 * Render worksheet list in mobile view in accordion format
 * @prop onSeasonChange - function to change season
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 */

function WorksheetAccordion({
  onSeasonChange,
  cur_season,
  season_codes,
  courses,
  showModal,
  setFbPerson,
  cur_person,
}) {
  // Function to sort courses in chronological order for each day
  const chronologicalOrder = useCallback((a, b) => {
    if (a.start_time < b.start_time) return -1;
    if (a.start_time > b.start_time) return 1;
    return 0;
  }, []);

  // Parse listing dictionaries and determine which courses take place on each weekday
  const parseListings = useCallback(
    (listings) => {
      const parsed_courses = [[], [], [], [], []];
      // Iterate over each listing
      listings.forEach((course) => {
        // Iterate over each weekday
        for (let indx = 0; indx < 5; indx++) {
          const info = course.times_by_day[weekdays[indx]];
          // If this listing meets on this day
          if (info !== undefined) {
            // Get start time
            course.start_time = moment(info[0][0], 'HH:mm').day(1);
            // Get location url
            course.location_url = info[0][3];
            // Fix start time if needed
            if (course.start_time.get('hour') < 8)
              course.start_time.add('h', 12);
            // Add listing to this weekday's list
            parsed_courses[indx].push(course);
          }
        }
      });
      // Sort the courses in chronological order for each day
      parsed_courses.forEach((day) => {
        day.sort(chronologicalOrder);
      });
      return parsed_courses;
    },
    [chronologicalOrder]
  );

  // Build HTML for each class that takes place on each day of the week
  const buildHtml = useCallback(
    (parsed_courses) => {
      // Start the list with the current day
      let today = new Date().getDay();
      // Start on monday if it is the weekend
      if (today === 0 || today === 6) today = 1;
      // Day of the week counter
      let dayIndex = 0;
      // Unique id for each array item
      let id = 0;
      // List to hold HTML
      const accordion_items = [];
      // Iterate over each day starting with the current day
      for (let i = today - 1; dayIndex < 5; i = (i + 1) % 5) {
        // List of courses for this day
        const day = parsed_courses[i];
        // Skip if no courses on this day
        if (day.length === 0) {
          dayIndex++;
          continue;
        }

        // Add header for this weekday
        accordion_items.push(
          <StyledBanner key={++id}>
            <h5 className={styles.day_header}>{weekdays[i]}</h5>
          </StyledBanner>
        );
        // Iterate over each course that takes place on this day
        for (let j = 0; j < day.length; j++) {
          const course = day[j];
          accordion_items.push(
            <StyledCard key={++id} className={`${styles.card} px-0`}>
              {/* Custom Accordion Item Header */}
              <ContextAwareToggle
                eventKey={`${i}_${course.crn}_${course.season_code}`}
                course={course}
              />
              {/* Accordion Collapsed component */}
              <Accordion.Collapse
                eventKey={`${i}_${course.crn}_${course.season_code}`}
              >
                <Card.Body className="px-2 pt-2 pb-3">
                  <Row className="m-auto">
                    {/* Course Title */}
                    <Col className="p-0">
                      <strong>{course.title}</strong>
                    </Col>
                    <Col xs="auto" className="pr-0">
                      {/* Course Skills and Areas */}
                      {course.skills &&
                        course.skills.map((skill) => (
                          <Badge
                            variant="secondary"
                            className={tagStyles.tag}
                            style={{
                              color: skillsAreasColors[skill],
                              backgroundColor: chroma(skillsAreasColors[skill])
                                .alpha(0.16)
                                .css(),
                            }}
                            key={skill}
                          >
                            {skill}
                          </Badge>
                        ))}
                      {course.areas &&
                        course.areas.map((area) => (
                          <Badge
                            variant="secondary"
                            className={tagStyles.tag}
                            style={{
                              color: skillsAreasColors[area],
                              backgroundColor: chroma(skillsAreasColors[area])
                                .alpha(0.16)
                                .css(),
                            }}
                            key={area}
                          >
                            {area}
                          </Badge>
                        ))}
                    </Col>
                  </Row>
                  {/* Course Professors */}
                  <Row className="mx-auto pb-2" style={{ fontWeight: 500 }}>
                    <TextComponent type={1}>{course.professors}</TextComponent>
                  </Row>
                  {/* Course Description */}
                  <Row className="m-auto">
                    <ResponsiveEllipsis
                      style={{ whiteSpace: 'pre-wrap' }}
                      text={
                        course.description
                          ? course.description
                          : 'no description'
                      }
                      maxLine={8}
                      basedOn="words"
                    />
                  </Row>
                  {/* Button to trigger course modal */}
                  <Row className="m-auto">
                    <StyledBanner
                      onClick={() => showModal(course)}
                      className={`${styles.more_info} mt-2 font-weight-bold`}
                    >
                      <TextComponent type={1}>More Info</TextComponent>
                    </StyledBanner>
                  </Row>
                </Card.Body>
              </Accordion.Collapse>
            </StyledCard>
          );
        }
        dayIndex++;
      }
      return <Accordion>{accordion_items}</Accordion>;
    },
    [showModal]
  );
  // Get courses by day
  const parsed_courses = useMemo(() => {
    return parseListings(courses);
  }, [courses, parseListings]);
  // Get HTML
  const items = useMemo(() => {
    return buildHtml(parsed_courses);
  }, [buildHtml, parsed_courses]);

  // TODO: add an empty state

  return (
    <div className={styles.container}>
      <Row className={`${styles.dropdowns} mx-auto`}>
        {/* Season Dropdown */}
        <Col xs={6} className="m-0 p-0">
          <SeasonDropdown
            onSeasonChange={onSeasonChange}
            cur_season={cur_season}
            season_codes={season_codes}
          />
        </Col>
        {/* FB Dropdown */}
        <Col xs={6} className="m-0 p-0">
          <FBDropdown
            cur_season={cur_season}
            setFbPerson={setFbPerson}
            cur_person={cur_person}
          />
        </Col>
      </Row>
      {/* Render list of courses */}
      <SurfaceComponent layer={0} className={styles.accordion_list}>
        {items.props.children.length > 0 ? (
          items
        ) : (
          <NoCourses cur_season={cur_season} />
        )}
      </SurfaceComponent>
    </div>
  );
}

export default React.memo(WorksheetAccordion);
