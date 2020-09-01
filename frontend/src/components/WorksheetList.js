import React from 'react';
import styles from './WorksheetList.module.css';
import { Row, Col, ListGroup } from 'react-bootstrap';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';
import WorksheetRowDropdown from './WorksheetRowDropdown';

export default class WorksheetList extends React.Component {
  showModal = (listing) => {
    this.props.showModal(listing);
  };

  toggleCourse = (season_code, crn, hidden) => {
    this.props.toggleCourse(season_code, crn, hidden);
  };

  isHidden = (season_code, crn) => {
    for (let i = 0; i < this.props.hidden_courses.length; i++) {
      let course = this.props.hidden_courses[i];
      if (course[0] === season_code && course[1] === crn) return true;
    }
    return false;
  };

  buildHtml = (cur_season, courses) => {
    let items = [];
    let id = 0;
    courses.forEach((course) => {
      items.push(
        <ListGroup.Item
          key={id++}
          className={styles.clickable + ' py-1 px-2'}
          onMouseEnter={() => this.props.setHoverCourse(course)}
          onMouseLeave={() => this.props.setHoverCourse(null)}
        >
          <div className={styles.bookmark}>
            <WorksheetToggleButton
              alwaysRed={true}
              crn={course.crn}
              season_code={cur_season}
              modal={false}
              hasSeason={this.props.hasSeason}
            />
          </div>
          <Row className="align-items-center mx-auto">
            <Col xs="auto" className="pl-0 pr-2 my-auto">
              <Row className="m-auto">
                <WorksheetHideButton
                  toggleCourse={this.props.toggleCourse}
                  crn={course.crn}
                  season_code={cur_season}
                />
              </Row>
            </Col>
            <Col
              className={
                (this.isHidden(cur_season, course.crn)
                  ? styles.hidden + ' '
                  : '') +
                styles.list_text +
                ' px-0'
              }
              onClick={() => this.showModal(course)}
            >
              <strong>{course['course_code']}</strong>
              <br />
              <span className={styles.course_title}>
                {course['course.title']}
              </span>
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
        <WorksheetRowDropdown
          cur_season={this.props.cur_season}
          season_codes={this.props.season_codes}
          onSeasonChange={this.props.onSeasonChange}
          setFbPerson={this.props.setFbPerson}
          cur_person={this.props.cur_person}
        />
        <div className={styles.table}>
          <ListGroup variant="flush">{items}</ListGroup>
        </div>
      </div>
    );
  }
}
