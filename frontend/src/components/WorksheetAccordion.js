import React, { useContext } from 'react';
import moment from 'moment';
import styles from './WorksheetAccordion.module.css';
import tagStyles from './SearchResultsItem.module.css';
import { skillsAreasColors } from '../queries/Constants.js';
import chroma from 'chroma-js';
import { Badge, Row, Col, Accordion, Card } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import SeasonDropdown from './SeasonDropdown';
import FBDropdown from './FBDropdown';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';

// Component used to trim description to certain number of lines
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

// Render custom accordion items
function ContextAwareToggle({ eventKey, callback, course }) {
  // Get current selected item
  const currentEventKey = useContext(AccordionContext);

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
  };

  return (
    <div
      className={
        styles.toggle +
        ' ' +
        (!isCurrentEventKey ? '' : styles.accordion_hover_header_active)
      }
      onClick={decoratedOnClick}
    >
      <Row className={styles.header + ' p-2 mx-auto'}>
        <Col xs="auto" style={{ fontWeight: 500 }}>
          {/* Course Code */}
          <Row>{course.course_code}</Row>
          <Row>
            {/* Course Location. NOT LINKING TO YALE CAMPUS MAP RN */}
            <small className="text-muted">
              {/* <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={course['location_url']}
                        className={styles.location_url + ' text-muted'}
                      >
                        {course['course.locations_summary']}
                      </a> */}
              {course['course.locations_summary']}
            </small>
          </Row>
        </Col>
        {/* Course Time */}
        <Col xs="auto" className="p-0 text-muted">
          {trim(course['course.times_summary'])}
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
 * @prop hasSeason - function to pass to bookmark button
 * @prop showModal - function to show modal for a certain listing
 * @prop setFbPerson - function to change FB person
 * @prop cur_person - string of current person who's worksheet we are viewing
 */

export default class WorksheetAccordion extends React.Component {
  constructor(props) {
    super(props);
    // State that determines when a course modal should be shown and for which course
    this.state = {
      course_modal: [false, ''],
    };
  }

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Function to sort courses in chronological order for each day
  chronologicalOrder = (a, b) => {
    if (a['start_time'] < b['start_time']) return -1;
    if (a['start_time'] > b['start_time']) return 1;
    return 0;
  };

  // Parse listing dictionaries and determine which courses take place on each weekday
  parseListings = (listings) => {
    let parsed_courses = [[], [], [], [], []];
    // Iterate over each listing
    listings.forEach((course) => {
      // Iterate over each weekday
      for (let indx = 0; indx < 5; indx++) {
        const info = course['course.times_by_day.' + this.weekDays[indx]];
        // If this listing meets on this day
        if (info !== undefined) {
          // Get start time
          course['start_time'] = moment(info[0][0], 'HH:mm').day(1);
          // Get location url
          course['location_url'] = info[0][3];
          // Fix start time if needed
          if (course['start_time'].get('hour') < 8)
            course['start_time'].add('h', 12);
          // Add listing to this weekday's list
          parsed_courses[indx].push(course);
        }
      }
    });
    // Sort the courses in chronological order for each day
    parsed_courses.forEach((day) => {
      day.sort(this.chronologicalOrder);
    });
    return parsed_courses;
  };

  // Build HTML for each class that takes place on each day of the week
  buildHtml = (parsed_courses) => {
    // Start the list with the current day
    let today = new Date().getDay();
    // Start on monday if it is the weekend
    if (today === 0 || today === 6) today = 1;
    // Day of the week counter
    let dayIndex = 0;
    // Unique id for each array item
    let id = 0;
    // List to hold HTML
    let accordion_items = [];
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
        <h5 className={styles.day_header} key={++id}>
          {this.weekDays[i]}
        </h5>
      );
      // Iterate over each course that takes place on this day
      day.forEach((course) => {
        accordion_items.push(
          <Card key={++id} className={styles.card + ' px-0'}>
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
                    <strong>{course['course.title']}</strong>
                  </Col>
                  {/* Course Skills/Areas */}
                  <Col xs="auto" className="pr-0">
                    {!course.skills || (
                      <Badge
                        variant="secondary"
                        className={
                          tagStyles.tag + ' ' + tagStyles[course.skills]
                        }
                        style={{
                          color: skillsAreasColors[course.skills],
                          backgroundColor: chroma(
                            skillsAreasColors[course.skills]
                          )
                            .alpha(0.16)
                            .css(),
                        }}
                        key={++id}
                      >
                        {course.skills}
                      </Badge>
                    )}
                    {!course.areas || (
                      <Badge
                        variant="secondary"
                        className={
                          tagStyles.tag + ' ' + tagStyles[course.areas]
                        }
                        style={{
                          color: skillsAreasColors[course.areas],
                          backgroundColor: chroma(
                            skillsAreasColors[course.areas]
                          )
                            .alpha(0.16)
                            .css(),
                        }}
                        key={++id}
                      >
                        {course.areas}
                      </Badge>
                    )}
                  </Col>
                </Row>
                {/* Course Professors */}
                <Row
                  className="mx-auto pb-2 text-muted"
                  style={{ fontWeight: 500 }}
                >
                  {course.professors}
                </Row>
                {/* Course Description */}
                <Row className="m-auto">
                  <ResponsiveEllipsis
                    style={{ whiteSpace: 'pre-wrap' }}
                    text={course['course.description']}
                    maxLine={8}
                    basedOn="words"
                  />
                </Row>
                {/* Button to trigger course modal */}
                <Row className="m-auto">
                  <strong
                    onClick={() => this.props.showModal(course)}
                    className={styles.more_info + ' mt-2'}
                  >
                    More Info
                  </strong>
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      });
      dayIndex++;
    }
    return <Accordion>{accordion_items}</Accordion>;
  };

  render() {
    // Get courses by day
    const parsed_courses = this.parseListings(this.props.courses);
    // Get HTML
    const items = this.buildHtml(parsed_courses);
    return (
      <div className={styles.container}>
        <Row className={styles.dropdowns + ' m-0'}>
          {/* Season Dropdown */}
          <Col xs={6} className="m-0 p-0">
            <SeasonDropdown
              onSeasonChange={this.props.onSeasonChange}
              cur_season={this.props.cur_season}
              season_codes={this.props.season_codes}
            />
          </Col>
          {/* FB Dropdown */}
          <Col xs={6} className="m-0 p-0">
            <FBDropdown
              cur_season={this.props.cur_season}
              setFbPerson={this.props.setFbPerson}
              cur_person={this.props.cur_person}
            />
          </Col>
        </Row>
        {/* Render list of courses */}
        <div className={styles.accordion_list}>{items}</div>
      </div>
    );
  }
}
