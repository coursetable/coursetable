import React, { useEffect } from 'react';

import { Row, Col, Container } from 'react-bootstrap';

import styles from './WorksheetExpandedList.module.css';
import search_results_styles from './SearchResults.module.css';
import WorksheetExpandedListItem from './WorksheetExpandedListItem';
import Select from 'react-select';
import { toSeasonString } from '../utilities';

const WorksheetExpandedList = ({
  courses,
  showModal,
  end_fade,
  cur_season,
  season_codes,
  onSeasonChange,
  hasSeason,
}) => {
  let items = [];
  let filtered_courses = [];
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    if (course.season_code !== cur_season) continue;
    filtered_courses.push(course);
  }

  for (let i = 0; i < filtered_courses.length; i++) {
    const course = filtered_courses[i];
    items.push(
      <div key={i}>
        <WorksheetExpandedListItem
          course={course}
          showModal={showModal}
          isLast={i === filtered_courses.length - 1}
          end_fade={end_fade}
          hasSeason={hasSeason}
        />
      </div>
    );
  }

  let options = [];
  season_codes.sort();
  season_codes.reverse();
  season_codes.forEach((season_code) => {
    options.push({
      value: season_code,
      label: toSeasonString(season_code)[0],
    });
  });

  return (
    <div>
      <Container
        fluid
        id="results_container"
        className={`px-0 shadow-sm ${search_results_styles.results_container} ${styles.shadow}`}
      >
        <div className={`${search_results_styles.sticky_header}`}>
          <Row
            className={`mx-auto px-2 py-2 shadow-sm justify-content-between ${search_results_styles.results_header_row}`}
          >
            <React.Fragment>
              <Col md={3} className="d-flex">
                <strong className="my-auto">{'Description'}</strong>
              </Col>
              <Col md={2} className="d-flex">
                <strong className="my-auto">{'Professors'}</strong>
              </Col>
              <Col md={2} className="d-flex mr-2">
                <strong className="my-auto">{'Meets'}</strong>
              </Col>
              <Col md={1} className="d-flex">
                <strong className="my-auto">{'Class'}</strong>
              </Col>
              <Col md={1} className="d-flex">
                <strong className="my-auto">{'Prof'}</strong>
              </Col>
              <Col md={1} className="d-flex">
                <strong className="my-auto">{'Work'}</strong>
              </Col>
            </React.Fragment>

            <Col md={'auto'} className="d-flex p-0">
              <div className="ml-auto pr-3 my-auto">
                <Select
                  value={{
                    value: cur_season,
                    label: toSeasonString(cur_season)[0],
                  }}
                  isSearchable={false}
                  options={options}
                  onChange={(option) => {
                    onSeasonChange(option.value);
                  }}
                  minMenuHeight={'auto'}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className={styles.results_list_container}>{items}</div>
      </Container>
    </div>
  );
};

export default WorksheetExpandedList;
