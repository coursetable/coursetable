import React from 'react';
import styles from './WorksheetList.module.css';
import { Row, Col, ListGroup } from 'react-bootstrap';
import WorksheetToggleButton from './WorksheetToggleButton';
import WorksheetHideButton from './WorksheetHideButton';

export default class WorksheetList extends React.Component {
  constructor(props) {
    super(props);
  }

  setSeason = (season_code) => {
    this.props.onSeasonChange(season_code);
  };

  showModal = (listing) => {
    this.props.showModal(listing);
  };

  toggleCourse = (season_code, crn, hidden) => {
    this.props.toggleCourse(season_code, crn, hidden);
  };

  parseListings = (listings, season_codes) => {
    let parsed_courses = {};
    season_codes.forEach((season_code) => {
      parsed_courses[season_code] = [];
    });
    listings.forEach((listing) => {
      if (parsed_courses[listing['season_code']] === undefined) return;
      parsed_courses[listing['season_code']].push(listing);
    });
    return parsed_courses;
  };

  isHidden = (season_code, crn) => {
    for (let i = 0; i < this.props.hidden_courses.length; i++) {
      let course = this.props.hidden_courses[i];
      if (course[0] === season_code && course[1] === crn) return true;
    }
    return false;
  };

  buildHtml = (season_codes, parsed_courses, cur_season) => {
    let items = [];
    season_codes.sort();
    season_codes.reverse();
    const seasons = ['', 'Spring', 'Summer', 'Fall'];
    let id = 0;
    season_codes.forEach((season) => {
      items.push(
        <ListGroup.Item
          key={id++}
          // active={cur_season === season}
          variant={cur_season === season ? 'primary' : 'secondary'}
          action
          onClick={() => this.setSeason(season)}
          className={styles.seasonHeader}
        >
          <h4 className="mb-0">
            <strong>
              {season.substring(0, 4) + ' - ' + seasons[parseInt(season[5])]}
            </strong>
          </h4>
        </ListGroup.Item>
      );
      parsed_courses[season].forEach((course) => {
        items.push(
          <ListGroup.Item key={id++}>
            <Row className="align-items-center">
              <Col xs="auto" className="px-0 my-auto">
                <Row className="m-auto">
                  <WorksheetToggleButton
                    alwaysRed={true}
                    crn={course.crn}
                    season_code={season}
                    bookmark={false}
                    hasSeason={this.props.hasSeason}
                  />
                </Row>
                <Row className="m-auto">
                  <WorksheetHideButton
                    toggleCourse={this.props.toggleCourse}
                    crn={course.crn}
                    season_code={season}
                  />
                </Row>
              </Col>
              <Col
                className={
                  (this.isHidden(season, course.crn)
                    ? styles.hidden + ' '
                    : '') +
                  styles.clickable +
                  ' pr-3 pl-0'
                }
                onClick={() => this.showModal(course)}
              >
                <strong>{course['course_code']}</strong>
                <br />
                {course['course.title']}
              </Col>
            </Row>
          </ListGroup.Item>
        );
      });
    });
    return items;
  };

  render() {
    const parsed_courses = this.parseListings(
      this.props.courses,
      this.props.season_codes
    );
    const items = this.buildHtml(
      this.props.season_codes,
      parsed_courses,
      this.props.cur_season
    );
    // console.log(this.state.course_info);
    return (
      <div className={styles.container}>
        <ListGroup variant="flush" className={styles.table}>
          {items}
        </ListGroup>
      </div>
    );
  }
}
