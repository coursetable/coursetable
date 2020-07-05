import React from 'react';
import styles from './WorksheetList.module.css';
import { Row, Col, ListGroup } from 'react-bootstrap';
import WorksheetToggleButton from './WorksheetToggleButton';
import { parse } from 'graphql';

export default class WeekSchedule extends React.Component {
  constructor(props) {
    super(props);
  }

  setSeason = season_code => {
    this.props.onSeasonChange(season_code);
  };

  parseListings = (listings, season_codes) => {
    let parsed_courses = {};
    season_codes.forEach(season_code => {
      parsed_courses[season_code] = [];
    });
    listings.forEach(listing => {
      if (parsed_courses[listing['season_code']] === undefined) return;
      parsed_courses[listing['season_code']].push({
        course_code: listing['course_code'],
        course_title: listing['course.title'],
        crn: listing['crn'],
      });
    });
    return parsed_courses;
  };

  buildHtml = (season_codes, parsed_courses, cur_season) => {
    let items = [];
    season_codes.sort();
    season_codes.reverse();
    const seasons = ['', 'Spring', 'Summer', 'Fall'];
    let id = 0;
    season_codes.forEach(season => {
      items.push(
        <ListGroup.Item
          key={id++}
          active={cur_season === season}
          variant="primary"
          action
          onClick={() => this.setSeason(season)}
        >
          <h4 className="mb-0">
            <strong>
              {season.substring(0, 4) + ' - ' + seasons[parseInt(season[5])]}
            </strong>
          </h4>
        </ListGroup.Item>
      );
      parsed_courses[season].forEach(course => {
        items.push(
          <ListGroup.Item key={id++}>
            <Row>
              <Col xs="auto" className="px-0">
                <WorksheetToggleButton crn={course.crn} season_code={season} />
              </Col>
              <Col className="px-0">
                <strong>{course.course_code}</strong>
                <br />
                {course.course_title}
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
    return (
      <div className={styles.container}>
        <ListGroup className={styles.table}>{items}</ListGroup>
      </div>
    );
  }
}
