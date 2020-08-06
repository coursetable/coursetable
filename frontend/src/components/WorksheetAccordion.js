import React, { useContext } from 'react';
import moment from 'moment';
import styles from './WorksheetAccordion.module.css';
import tagStyles from './SearchResultsItem.module.css';
import { Badge, Row, Col, Accordion, Card } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import SeasonDropdown from './SeasonDropdown';
import FBDropdown from './FBDropdown';
import CourseModal from '../components/CourseModal';

function ContextAwareToggle({ eventKey, callback, course }) {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = currentEventKey === eventKey;

  const trim = (time_string) => {
    for (let i = 0; i < time_string.length; i++) {
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
          <Row>{course.course_code}</Row>
          <Row>
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
        <Col xs="auto" className="p-0 text-muted">
          {trim(course['course.times_summary'])}
        </Col>
      </Row>
    </div>
  );
}

export default class WorksheetAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course_modal: [false, ''],
    };
  }

  showModal = (listing) => {
    this.setState({ course_modal: [true, listing] });
  };

  hideModal = () => {
    this.setState({ course_modal: [false, ''] });
  };

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  chronologicalOrder = (a, b) => {
    if (a['start_time'] < b['start_time']) return -1;
    if (a['start_time'] > b['start_time']) return 1;
    return 0;
  };

  parseListings = (listings) => {
    let parsed_courses = [[], [], [], [], []];
    // const this.weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    listings.forEach((course) => {
      for (let indx = 0; indx < 5; indx++) {
        const info = course['course.times_by_day.' + this.weekDays[indx]];
        if (info !== undefined) {
          course['start_time'] = moment(info[0][0], 'HH:mm').day(1);
          course['location_url'] = info[0][3];
          // console.log(course.course_code + ' ' + course['start_time'].format());
          if (course['start_time'].get('hour') < 8)
            course['start_time'].add('h', 12);
          parsed_courses[indx].push(course);
        }
      }
    });
    parsed_courses.forEach((day) => {
      day.sort(this.chronologicalOrder);
    });
    return parsed_courses;
  };

  buildHtml = (parsed_courses) => {
    let today = new Date().getDay();
    if (today === 0 || today === 6) today = 1;
    let indx = 0; // Day of the week counter
    let id = 0; // Unique id for each array item
    let accordion_items = [];
    for (let i = today - 1; indx < 5; i = (i + 1) % 5) {
      const day = parsed_courses[i];
      if (day.length === 0) {
        indx++;
        continue;
      }

      accordion_items.push(
        <h5 className={styles.day_header} key={++id}>
          {this.weekDays[i]}
        </h5>
      );
      day.forEach((course) => {
        accordion_items.push(
          <Card key={++id} className={styles.card + ' px-0'}>
            <ContextAwareToggle eventKey={++id} course={course} />
            <Accordion.Collapse eventKey={id}>
              <Card.Body className="px-2 pt-2 pb-3">
                <Row className="m-auto">
                  <Col className="p-0">
                    <strong>{course['course.title']}</strong>
                  </Col>
                  <Col xs="auto" className="pr-0">
                    {!course.skills || (
                      <Badge
                        variant="secondary"
                        className={
                          tagStyles.tag + ' ' + tagStyles[course.skills]
                        }
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
                      >
                        {course.areas}
                      </Badge>
                    )}
                  </Col>
                </Row>
                <Row
                  className="mx-auto pb-2 text-muted"
                  style={{ fontWeight: 500 }}
                >
                  {course.professors}
                </Row>
                <Row className="m-auto">{course['course.description']}</Row>
                <Row className="m-auto">
                  <strong
                    onClick={() => this.showModal(course)}
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
      indx++;
    }
    return <Accordion>{accordion_items}</Accordion>;
  };

  render() {
    const parsed_courses = this.parseListings(this.props.courses);
    const items = this.buildHtml(parsed_courses);
    return (
      <div className={styles.container}>
        <Row className={styles.dropdowns + ' m-0'}>
          <Col xs={6} className="m-0 p-0">
            <SeasonDropdown
              onSeasonChange={this.props.onSeasonChange}
              cur_season={this.props.cur_season}
              season_codes={this.props.season_codes}
            />
          </Col>
          <Col xs={6} className="m-0 p-0">
            <FBDropdown />
          </Col>
        </Row>
        <div className={styles.accordion_list}>{items}</div>
        <CourseModal
          hideModal={this.hideModal}
          show={this.state.course_modal[0]}
          listing={this.state.course_modal[1]}
          hasSeason={this.props.hasSeason}
        />
      </div>
    );
  }
}
