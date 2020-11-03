import React from 'react';
import styles from './WorksheetList.module.css';
import { Row, Col, ListGroup } from 'react-bootstrap';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';
import WorksheetRowDropdown from './WorksheetRowDropdown';

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
 */
export default class WorksheetList extends React.Component {
  // Show modal for the listing that is clicked
  showModal = (listing) => {
    this.props.showModal(listing);
  };

  // Hide/show a specific listing
  toggleCourse = (season_code, crn, hidden) => {
    this.props.toggleCourse(season_code, crn, hidden);
  };

  // Build the HTML for the list of courses of a given season
  buildHtml = (cur_season, courses) => {
    // List to hold HTML
    let items = [];
    // Variable for list keys
    let id = 0;
    // Iterate over all listings of this season
    courses.forEach((course) => {
      // Add listgroup item to items list
      items.push(
        <ListGroup.Item
          key={id++}
          className={styles.clickable + ' py-1 px-2'}
          onMouseEnter={() => this.props.setHoverCourse(course)}
          onMouseLeave={() => this.props.setHoverCourse(null)}
        >
          {/* Bookmark Button */}
          <div className={styles.bookmark}>
            <WorksheetToggleButton
              worksheetView={true}
              crn={course.crn}
              season_code={cur_season}
              modal={false}
            />
          </div>
          <Row className="align-items-center mx-auto">
            {/* Hide Button */}
            <Col xs="auto" className="pl-0 pr-2 my-auto">
              <Row className="m-auto">
                <WorksheetHideButton
                  toggleCourse={this.props.toggleCourse}
                  crn={course.crn}
                  season_code={cur_season}
                />
              </Row>
            </Col>
            {/* Course Code and Title */}
            <Col
              className={
                (course.hidden ? styles.hidden + ' ' : '') +
                styles.list_text +
                ' px-0'
              }
              onClick={() => this.showModal(course)}
            >
              <strong>{course.course_code}</strong>
              <br />
              <span className={styles.course_title}>{course.title}</span>
            </Col>
          </Row>
        </ListGroup.Item>
      );
    });

    return items;
  };

  render() {
    const items = this.buildHtml(this.props.cur_season, this.props.courses);
    return (
      <div className={styles.container}>
        {/* Season and FB friends dropdown */}
        <WorksheetRowDropdown
          cur_season={this.props.cur_season}
          season_codes={this.props.season_codes}
          onSeasonChange={this.props.onSeasonChange}
          setFbPerson={this.props.setFbPerson}
          cur_person={this.props.cur_person}
        />
        {/* List of courses for this season */}
        <div className={styles.table}>
          <ListGroup variant="flush">{items}</ListGroup>
        </div>
      </div>
    );
  }
}
