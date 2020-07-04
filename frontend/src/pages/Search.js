import React, { useState } from 'react';

import styles from './Search.module.css';
import { Col, Container, Row } from 'react-bootstrap';

import {
  SEARCH_COURSES,
  SEARCH_COURSES_TEXTLESS,
} from '../queries/QueryStrings';

import { useLazyQuery } from '@apollo/react-hooks';

import {
  Form,
  FormControl,
  FormCheck,
  InputGroup,
  Button,
} from 'react-bootstrap';
import Select from 'react-select';

import SearchResults from '../components/SearchResults';

function App() {
  var searchText = React.createRef();

  var [searchType, setSearchType] = React.useState();

  var sortby = React.createRef();
  var seasons = React.createRef();
  var skillsAreas = React.createRef();
  var credits = React.createRef();

  var [HideGraduate, setHideGraduate] = React.useState(true);
  var [HideCancelled, setHideCancelled] = React.useState(true);

  const sortby_options = [
    { label: 'Relevance', value: 'text' },
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

  var [
    executeTextlessSearch,
    { called: textlessCalled, loading: textlessLoading, data: textlessData },
  ] = useLazyQuery(SEARCH_COURSES_TEXTLESS);

  var [
    executeTextSearch,
    { called: textCalled, loading: textLoading, data: textData },
  ] = useLazyQuery(SEARCH_COURSES);

  var search_type;

  const handleSubmit = event => {
    event.preventDefault();

    // TODO:
    //  - sorting
    //  - filter by skills and areas
    //  - filter by credit count
    //  - hide grad and cancelled

    var processed_seasons = seasons.select.props.value;
    if (processed_seasons != null) {
      processed_seasons = processed_seasons.map(x => {
        return x.value;
      });
    }

    if (searchText.value === '') {
      setSearchType('TEXTLESS');
      executeTextlessSearch({
        variables: {
          seasons: processed_seasons,
        },
      });
    } else {
      setSearchType('TEXT');
      executeTextSearch({
        variables: {
          search_text: searchText.value,
          seasons: processed_seasons,
        },
      });
    }
  };

  var results;

  if (searchType === 'TEXTLESS') {
    if (textlessCalled) {
      if (textlessLoading) {
        results = <div>Loading...</div>;
      } else {
        if (textlessData) {
          // if(search_type === 'TEXTLESS'){
          //   data = data.
          // }

          results = <SearchResults data={textlessData.courses} />;
        }
      }
    }
  } else if (searchType === 'TEXT') {
    if (textCalled) {
      if (textLoading) {
        results = <div>Loading...</div>;
      } else {
        if (textData) {
          results = <SearchResults data={textData.search_course_info} />;
        }
      }
    }
  }

  return (
    <div className={styles.search_base}>
      <Row className={styles.nopad + " " +styles.nomargin}>
        <Col md={4} className={"m-0 px-4 py-4 " + styles.search_col}>
            <Form className={styles.search_container} onSubmit={handleSubmit}>
              <div className={styles.search_bar}>
                <InputGroup className={styles.search_input}>
                  <FormControl
                    type="text"
                    placeholder="Find a class..."
                    ref={ref => {
                      searchText = ref;
                    }}
                  />
                </InputGroup>
              </div>

              <div
                className={
                  'container ' + styles.search_options_container
                }
              >
                <div className="row py-2">
                  <div className={"col-md-4 " +styles.nopad}>
                    Sort by{' '}
                    <Select
                      defaultValue={sortby_options[0]}
                      options={sortby_options}
                      ref={ref => {
                        sortby = ref;
                      }}
                    />
                  </div>
                  <div className={"col-md-8 " +styles.nopad}>
                    Semesters{' '}
                    <Select
                      isMulti
                      defaultValue={[seasons_options[0]]}
                      options={seasons_options}
                      ref={ref => {
                        seasons = ref;
                      }}
                      placeholder="All"
                    />
                  </div>
                </div>
                <div className="row py-2">
                  <div className={"col-md-8 "+ styles.nopad}>
                    Skills and areas
                    <Select
                      isMulti
                      options={skills_areas_options}
                      placeholder="Any"
                      ref={ref => {
                        skillsAreas = ref;
                      }}
                    />
                  </div>
                  <div className={"col-md-4 "+ styles.nopad}>
                    Credits
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
        </Col>
        <Col md={8} className={"m-0 p-0 "+styles.results_col}>
          {results}
        </Col>
      </Row>
    </div>
  );
}

export default App;
