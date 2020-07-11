import React from 'react';
import moment from 'moment';
import styles from './WorksheetAccordion.module.css';
import { Row, Col, Accordion, Card } from 'react-bootstrap';
import WorksheetToggleButton from './WorksheetToggleButton';

export default class WorksheetAccordion extends React.Component {
  constructor(props) {
    super(props);
  }

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  chronologicalOrder = (a, b) => {
    if (a['start_time'] < b['start_time']) return -1;
    if (a['start_time'] > b['start_time']) return 1;
    return 0;
  };

  parseListings = listings => {
    let parsed_courses = [[], [], [], [], []];
    // const this.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    listings.forEach(course => {
      for (let indx = 0; indx < 5; indx++) {
        const info = course['course.times_by_day.' + this.weekDays[indx]];
        if (info !== undefined) {
          course['start_time'] = moment(
            course['course.times_by_day.' + this.weekDays[indx]][0][0],
            'HH:mm'
          ).day(1);
          // console.log(course.course_code + ' ' + course['start_time'].format());
          if (course['start_time'].get('hour') < 8)
            course['start_time'].add('h', 12);
          parsed_courses[indx].push(course);
        }
      }
    });
    parsed_courses.forEach(day => {
      day.sort(this.chronologicalOrder);
    });
    return parsed_courses;
  };

  trim = time_string => {
    for (let i = 0; i < time_string.length; i++) {
      if (time_string[i] >= '0' && time_string[i] <= '9')
        return time_string.substr(i, time_string.length - i);
    }
  };

  buildHtml = parsed_courses => {
    let items = [];
    // const this.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let indx = 0;
    let id = 0;
    parsed_courses.forEach(day => {
      if (day.length === 0) return;
      items.push(
        <h5 className={styles.day_header} key={id++}>
          {this.weekDays[indx]}
        </h5>
      );
      let key = 0;
      let accordion_items = [];
      day.forEach(course => {
        console.log(course);
        accordion_items.push(
          <Card variantkey={id++} className={styles.card}>
            <Accordion.Toggle
              as={Card.Header}
              className={styles.toggle}
              eventKey={key}
            >
              <Row className={styles.header}>
                <Col xs="auto">
                  <Row>
                    <strong>{course.course_code}</strong>
                  </Row>
                  <Row>
                    <small className="text-muted">
                      {course['course.locations_summary']}
                    </small>
                  </Row>
                </Col>
                <Col xs="auto">{this.trim(course['course.times_summary'])}</Col>
              </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={key}>
              <Card.Body>{course['course.description']}</Card.Body>
            </Accordion.Collapse>
          </Card>
        );
        key++;
      });
      items.push(
        <Accordion key={indx} className={styles.accordion}>
          {accordion_items}
        </Accordion>
      );
      indx++;
    });
    return items;
  };

  render() {
    const parsed_courses = this.parseListings(this.props.courses);
    const items = this.buildHtml(parsed_courses);
    return <div className={styles.container}>{items}</div>;
  }
}
