import React, { useState } from 'react';

import styles from './Search.module.css';
import { Container, Row } from 'react-bootstrap';

import {SEARCH_COURSES} from '../queries/QueryStrings';
import SearchResults from '../components/SearchResults';

import { useLazyQuery } from '@apollo/react-hooks';

import {
  Form,
  FormControl,
  FormCheck,
  InputGroup,
  Button,
} from 'react-bootstrap';
import Select from 'react-select';

function App() {
  var search_text = React.createRef();

  var sortby = React.createRef();
  var seasons = React.useState();
  var skills_areas = React.useState();
  var credits = React.useState();

  var [HideGraduate, setHideGraduate] = React.useState(true);
  var [HideCancelled, setHideCancelled] = React.useState(true);

  var [submitted, setSubmitted] = React.useState(false);

  const sortby_options = [
    { label: 'Course name', value: 'course_name' },
    { label: 'Course subject', value: 'subject' },
    { label: 'Course number', value: 'number' },
    { label: 'Rating (same professor)', value: 'rating_same' },
    { label: 'Rating (any professor)', value: 'rating_any' },
    { label: 'Workload', value: 'workload' },
    { label: 'Enrollment', value: 'enrollment' },
  ];

  const seasons_options = [
    { label: 'Fall 2020', value: '202003' },
    { label: 'Summer 2020', value: '202002' },
    { label: 'Spring 2020', value: '202001' },
    { label: 'Fall 2019', value: '201903' },
  ];

  const skills_areas_options = [
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

  const credits_options = [
    { label: '0.5', value: '0.5' },
    { label: '1', value: '1' },
    { label: '1.5', value: '1.5' },
    { label: '2', value: '2' },
  ];

  var [executeSearch, { called, loading, data }] = useLazyQuery(SEARCH_COURSES);

  const handleSubmit = event => {
    event.preventDefault();

    console.log(search_text.value);
    console.log(sortby.select.props.value);
    console.log(seasons.select.props.value);
    console.log(skills_areas.select.props.value);
    console.log(credits.select.props.value);
    console.log(HideGraduate);
    console.log(HideCancelled);

    executeSearch({ variables: { search_text: 'PLSC', seasons: '201903'} });
  };

  if (data) {
    console.log('Data:');
    console.log(data);
  }

  return (
    <div className={'py-5 ' + styles.search_base}>
      <Container className="col-md-6">
        <Row className="row-centered">
          <Form className={styles.search_container} onSubmit={handleSubmit}>
            <div className={styles.search_bar}>
              <InputGroup className={styles.search_input}>
                <FormControl
                  type="text"
                  placeholder="Find a class..."
                  size="lg"
                  ref={ref => {
                    search_text = ref;
                  }}
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
                  Sort by{' '}
                  <Select
                    defaultValue={sortby_options[0]}
                    options={sortby_options}
                    ref={ref => {
                      sortby = ref;
                    }}
                  />
                </div>
                <div className="col-md-8">
                  Semesters{' '}
                  <Select
                    isMulti
                    defaultValue={[seasons_options[0]]}
                    options={seasons_options}
                    ref={ref => {
                      seasons = ref;
                    }}
                  />
                </div>
              </div>
              <div className="row py-2">
                <div className="col-md-8">
                  Skills and areas
                  <Select
                    isMulti
                    options={skills_areas_options}
                    placeholder="Any"
                    ref={ref => {
                      skills_areas = ref;
                    }}
                  />
                </div>
                <div className="col-md-4">
                  Number of credits
                  <Select
                    isMulti
                    options={credits_options}
                    placeholder="Any"
                    ref={ref => {
                      credits = ref;
                    }}
                  />
                </div>
              </div>
              <div className="row px-3 py-2">
                <FormCheck type="switch" className={styles.toggle_option}>
                  <FormCheck.Input checked={HideGraduate} />
                  <FormCheck.Label
                    onClick={() => setHideGraduate(!HideGraduate)}
                  >
                    Hide graduate courses
                  </FormCheck.Label>
                </FormCheck>
                <Form.Check type="switch" className={styles.toggle_option}>
                  <Form.Check.Input checked={HideCancelled} />
                  <Form.Check.Label
                    onClick={() => setHideCancelled(!HideCancelled)}
                  >
                    Hide cancelled courses
                  </Form.Check.Label>
                </Form.Check>
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
