import React, { useState } from 'react';

import styles from './Search.module.css';
import { Container, Row } from 'react-bootstrap';

import { Form, FormControl, InputGroup, Button } from 'react-bootstrap';
import Select from 'react-select';

function App() {
  const sorting = [
    { label: 'Course name (alphabetical)', value: 'course_name' },
    { label: 'Course subject', value: 'subject' },
    { label: 'Course number', value: 'number' },
    { label: 'Rating (same professor)', value: 'rating_same' },
    { label: 'Rating (any professor)', value: 'rating_any' },
    { label: 'Workload', value: 'workload' },
    { label: 'Enrollment', value: 'enrollment' },
  ];

  const seasons = [
    { label: 'Fall 2020', value: '202003' },
    { label: 'Summer 2020', value: '202002' },
    { label: 'Spring 2020', value: '202001' },
    { label: 'Fall 2019', value: '201903' },
  ];

  const skills_areas = [
    { label: 'Humanities', value: 'HU' },
    { label: 'Social sciences', value: 'SO' },
    { label: 'Quantitative reasoning', value: 'QR' },
    { label: 'Sciences', value: 'SC' },
    { label: 'Writing', value: 'WR' },
    { label: 'Language: any', value: 'L' },
    { label: 'Language: L1', value: 'L1' },
    { label: 'Language: L2', value: 'L2' },
    { label: 'Language: L3', value: 'L3' },
    { label: 'Language: L4', value: 'L4' },
    { label: 'Language: L5', value: 'L5' },
  ];

  const credits = [
    { label: '0.5', value: '0.5' },
    { label: '1', value: '1' },
    { label: '1.5', value: '1.5' },
    { label: '2', value: '2' },
  ];

  const sorting_selector = (
    <div className="row">
      <div className="col-md-6">
        Sort by <Select defaultValue={sorting[0]} options={sorting} />
      </div>
    </div>
  );

  const season_selector = (
    <div className="row">
      <div className="col-md-6">
        Semesters <Select isMulti defaultValue={seasons[0]} options={seasons} />
      </div>
    </div>
  );

  const skills_areas_selector = (
    <div className="row">
      <div className="col-md-6">
        Skills and areas
        <Select isMulti options={skills_areas} placeholder="Any" />
      </div>
    </div>
  );

  const credits_selector = (
    <div className="row">
      <div className="col-md-6">
        Number of credits
        <Select isMulti options={credits} placeholder="Any" />
      </div>
    </div>
  );

  return (
    <div className={'py-5 ' + styles.search_base}>
      <Container className="col-md-6">
        <Row className="row-centered">
          <Form className={styles.search_container}>
            <div className={styles.search_bar}>
              <InputGroup className={styles.search_input}>
                <FormControl
                  type="text"
                  placeholder="Find a class..."
                  size="lg"
                />
              </InputGroup>
            </div>

            <div
              className={
                'container px-4 py-4 ' + styles.search_options_container
              }
            >
              <div className="row py-2">
                <div className="col-md-4">
                  Sort by <Select defaultValue={sorting[0]} options={sorting} />
                </div>
                <div className="col-md-8">
                  Semesters{' '}
                  <Select isMulti defaultValue={seasons[0]} options={seasons} />
                </div>
              </div>
              <div className="row py-2">
                <div className="col-md-8">
                  Skills and areas
                  <Select isMulti options={skills_areas} placeholder="Any" />
                </div>
                <div className="col-md-4">
                  Number of credits
                  <Select isMulti options={credits} placeholder="Any" />
                </div>
              </div>
              <div className="row px-3 py-2">
                <Form.Check inline label="Hide graduate courses" />
                <Form.Check inline label="Hide cancelled courses" />
              </div>
              <div className="text-right">
                <Button
                  type="submit"
                  className={'pull-right ' + styles.secondary_submit}
                >
                  Search
                </Button>
              </div>
            </div>
          </Form>
        </Row>
      </Container>
    </div>
  );
}

export default App;
