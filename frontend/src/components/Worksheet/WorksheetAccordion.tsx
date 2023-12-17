import React, { useCallback, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { Row, Col, Accordion, Card } from 'react-bootstrap';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import { ThemeContext } from 'styled-components';
import SeasonDropdown from '../Search/SeasonDropdown';
import FBDropdown from '../Navbar/FBDropdown';
import {
  TextComponent,
  StyledBanner,
  StyledCard,
  SurfaceComponent,
} from '../StyledComponents';
import SkillBadge from '../SkillBadge';
import styles from './WorksheetAccordion.module.css';
import { weekdays, type Listing } from '../../utilities/common';
import NoCourses from '../Search/NoCourses';
import { useWorksheet } from '../../contexts/worksheetContext';
import WorksheetNumDropdown from '../Navbar/WorksheetNumberDropdown';

// Component used to trim description to certain number of lines
const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

// Render custom accordion items
function ContextAwareToggle({
  eventKey,
  callback,
  course,
}: {
  eventKey: string;
  callback?: (eventKey: string) => null;
  course: Listing;
}) {
  // Get current selected item
  const currentEventKey = useContext(AccordionContext);
  const theme = useContext(ThemeContext);
  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey),
  );

  // Is this item selected?
  const isCurrentEventKey = currentEventKey === eventKey;

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
              <small>{course.locations_summary}</small>
            </TextComponent>
          </Row>
        </Col>
        {/* Course Time */}
        <Col xs="auto" className="p-0">
          <TextComponent type={1}>{course.times_summary}</TextComponent>
        </Col>
      </Row>
    </div>
  );
}

/**
 * Render worksheet list in mobile view in accordion format
 */

function WorksheetAccordion() {
  const [, setSearchParams] = useSearchParams();
  const { courses } = useWorksheet();
  const showModal = useCallback(
    (course: Listing) => () => {
      setSearchParams((prev) => {
        prev.set('course-modal', `${course.season_code}-${course.crn}`);
        return prev;
      });
    },
    [setSearchParams],
  );

  // Parse listing dictionaries and determine which courses take place on each weekday
  const parseListings = useCallback((listings: Listing[]) => {
    const parsed_courses: [
      Listing[],
      Listing[],
      Listing[],
      Listing[],
      Listing[],
    ] = [[], [], [], [], []];
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
          if (course.start_time.get('hour') < 8) course.start_time.add('h', 12);
          // Add listing to this weekday's list
          parsed_courses[indx].push(course);
        }
      }
    });
    // Sort the courses in chronological order for each day
    parsed_courses.forEach((day) => {
      day.sort(
        (a, b) =>
          (a.start_time?.valueOf() || 0) - (b.start_time?.valueOf() || 0),
      );
    });
    return parsed_courses;
  }, []);

  // Get courses by day
  const parsed_courses = useMemo(
    () => parseListings(courses),
    [courses, parseListings],
  );
  const items = useMemo(() => {
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
        </StyledBanner>,
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
                        <SkillBadge key={skill} skill={skill} />
                      ))}
                    {course.areas &&
                      course.areas.map((area) => (
                        <SkillBadge key={area} skill={area} />
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
                      course.description ? course.description : 'no description'
                    }
                    maxLine={8}
                    basedOn="words"
                  />
                </Row>
                {/* Button to trigger course modal */}
                <Row className="m-auto">
                  <StyledBanner
                    onClick={showModal(course)}
                    className={`${styles.more_info} mt-2 font-weight-bold`}
                  >
                    <TextComponent type={1}>More Info</TextComponent>
                  </StyledBanner>
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </StyledCard>,
        );
      }
      dayIndex++;
    }
    return <Accordion>{accordion_items}</Accordion>;
  }, [parsed_courses, showModal]);

  // TODO: add an empty state

  return (
    <div className={styles.container}>
      <WorksheetNumDropdown />
      <Row className={`${styles.dropdowns} mx-auto`}>
        {/* Season Dropdown */}
        <Col xs={6} className="m-0 p-0">
          <SeasonDropdown />
        </Col>
        {/* FB Dropdown */}
        <Col xs={6} className="m-0 p-0">
          <FBDropdown />
        </Col>
      </Row>
      {/* Render list of courses */}
      <SurfaceComponent layer={0} className={styles.accordion_list}>
        {items.props.children.length > 0 ? items : <NoCourses />}
      </SurfaceComponent>
    </div>
  );
}

export default React.memo(WorksheetAccordion);
