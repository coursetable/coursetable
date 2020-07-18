import React from 'react';

import { HotKeys } from 'react-hotkeys';

import styles from './Search.module.css';

import chroma from 'chroma-js';

import SearchResults from '../components/SearchResults';

import {
  Col,
  Container,
  Row,
  Form,
  FormControl,
  FormCheck,
  InputGroup,
  Button,
  Overlay,
  Tooltip,
} from 'react-bootstrap';

import {
  SEARCH_COURSES,
  SEARCH_COURSES_TEXTLESS,
} from '../queries/QueryStrings';

import {
  sortbyOptions,
  sortbyQueries,
  areas,
  skills,
  skillsAreasOptions,
  colorOptionStyles,
  selectStyles,
  creditOptions,
  schoolOptions,
} from '../queries/Constants';

import { useLazyQuery } from '@apollo/react-hooks';

import Select from 'react-select';

import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import { useSeasons } from '../components/SeasonsProvider';

import { debounce } from 'lodash';

import Sticky from 'react-sticky-el';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

// TODO:
//  - pagination/infinite scrolling

function App() {
  const { width } = useWindowDimensions();
  const seasonsData = useSeasons();

  const isMobile = width < 768;

  var searchText = React.useRef();

  var [searchType, setSearchType] = React.useState();

  var sortby = React.useRef();
  var seasons = React.useRef();
  var skillsAreas = React.useRef();
  var credits = React.useRef();
  var schools = React.useRef();

  var [hideCancelled, setHideCancelled] = React.useState(true);

  var [ratingBounds, setRatingBounds] = React.useState([1, 5]);
  var [workloadBounds, setWorkloadBounds] = React.useState([1, 5]);

  // dummy variable to make selectors update
  // parent state and avoid tooltip errors
  var [selected, setSelected] = React.useState(false);

  var seasonsOptions;

  if (seasonsData && seasonsData.seasons) {
    seasonsOptions = seasonsData.seasons.map(x => {
      return {
        value: x.season_code,
        label: x.term.charAt(0).toUpperCase() + x.term.slice(1) + ' ' + x.year,
      };
    });
  }

  var [
    executeTextlessSearch,
    { called: textlessCalled, loading: textlessLoading, data: textlessData },
  ] = useLazyQuery(SEARCH_COURSES_TEXTLESS);

  var [
    executeTextSearch,
    { called: textCalled, loading: textLoading, data: textData },
  ] = useLazyQuery(SEARCH_COURSES);

  const handleSubmit = event => {
    event.preventDefault();

    var sortParams = sortby.select.props.value.value;

    var ordering = sortbyQueries[sortParams];

    var processedSeasons = seasons.select.props.value;
    if (processedSeasons != null) {
      processedSeasons = processedSeasons.map(x => {
        return x.value;
      });
    }

    var processedSkillsAreas = skillsAreas.select.props.value;
    if (processedSkillsAreas != null) {
      processedSkillsAreas = processedSkillsAreas.map(x => {
        return x.value;
      });

      // match all languages
      if (processedSkillsAreas.includes('L')) {
        processedSkillsAreas = processedSkillsAreas.concat([
          'L1',
          'L2',
          'L3',
          'L4',
          'L5',
        ]);
      }

      var processedSkills = processedSkillsAreas.filter(x =>
        skills.includes(x)
      );
      var processedAreas = processedSkillsAreas.filter(x => areas.includes(x));

      if (processedSkills.length === 0) {
        processedSkills = null;
      }

      if (processedAreas.length === 0) {
        processedAreas = null;
      }
    }

    var processedCredits = credits.select.props.value;
    if (processedCredits != null) {
      processedCredits = processedCredits.map(x => {
        return x.value;
      });
    }

    var processedSchools = schools.select.props.value;
    if (processedSchools != null) {
      processedSchools = processedSchools.map(x => {
        return x.value;
      });
    }

    // if the bounds are unaltered, we need to set them to null
    // to include unrated courses
    var include_all_ratings = ratingBounds[0] === 1 && ratingBounds[1] === 5;

    var include_all_workloads =
      workloadBounds[0] === 1 && workloadBounds[1] === 5;

    // override when we want to sort
    if (ordering && ordering.average_rating) {
      include_all_ratings = false;
    }
    if (ordering && ordering.average_workload) {
      include_all_workloads = false;
    }

    if (searchText.value === '') {
      setSearchType('TEXTLESS');
      executeTextlessSearch({
        variables: {
          ordering: ordering,
          seasons: processedSeasons,
          areas: processedAreas,
          skills: processedSkills,
          credits: processedCredits,
          schools: processedSchools,
          min_rating: include_all_ratings ? null : ratingBounds[0],
          max_rating: include_all_ratings ? null : ratingBounds[1],
          min_workload: include_all_workloads ? null : workloadBounds[0],
          max_workload: include_all_workloads ? null : workloadBounds[1],
          extra_info: hideCancelled ? 'ACTIVE' : null,
        },
      });
    } else {
      setSearchType('TEXT');
      executeTextSearch({
        variables: {
          search_text: searchText.value,
          ordering: ordering,
          seasons: processedSeasons,
          areas: processedAreas,
          skills: processedSkills,
          credits: processedCredits,
          schools: processedSchools,
          min_rating: include_all_ratings ? null : ratingBounds[0],
          max_rating: include_all_ratings ? null : ratingBounds[1],
          min_workload: include_all_workloads ? null : workloadBounds[0],
          max_workload: include_all_workloads ? null : workloadBounds[1],
          extra_info: hideCancelled ? 'ACTIVE' : null,
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
          results = <SearchResults data={textlessData.computed_course_info} />;
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

  // ctrl/cmd-f search hotkey
  const focusSearch = e => {
    e.preventDefault();
    console.log('focus!');
    console.log(e);
    console.log(searchText);
    searchText.focus();
  };

  const keyMap = {
    FOCUS_SEARCH: ['ctrl+f', 'command+f'],
  };

  const handlers = {
    FOCUS_SEARCH: focusSearch,
  };

  const { Handle } = Slider;

  const sliderHandle = e => {
    const { value } = e;
    return (
      <Handle {...e}>
        <div className="handle_tooltip">{value}</div>
      </Handle>
    );
  };

  return (
    <div className={styles.search_base}>
      <HotKeys keyMap={keyMap} handlers={handlers} style={{outline:"none"}}>
        <Row className={styles.nopad + ' ' + styles.nomargin}>
          <Col
            md={4}
            lg={3}
            className={
              isMobile
                ? 'p-3 ' + styles.search_col_mobile
                : 'pr-2 py-3 pl-3 ' + styles.search_col
            }
          >
            <Sticky disabled={isMobile}>
              <Form
                className={'px-4 py-4 ' + styles.search_container}
                onSubmit={handleSubmit}
              >
                <div className={styles.search_bar}>
                  <InputGroup className={styles.search_input}>
                    <FormControl
                      type="text"
                      placeholder="Find a class..."
                      ref={ref => (searchText = ref)}
                    />
                  </InputGroup>
                </div>

                <div className={'container ' + styles.search_options_container}>
                  <Row className="py-2">
                    <div className={'col-xl-4 col-md-12 ' + styles.nopad}>
                      Sort by{' '}
                      <Select
                        defaultValue={sortbyOptions[0]}
                        options={sortbyOptions}
                        ref={ref => {
                          sortby = ref;
                        }}
                        // prevent overlap with tooltips
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        onChange={() => setSelected(!selected)}
                      />
                    </div>
                    <div className={'col-xl-8 col-md-12 ' + styles.nopad}>
                      Semesters{' '}
                      {seasonsOptions && (
                        <Select
                          isMulti
                          defaultValue={[seasonsOptions[0]]}
                          options={seasonsOptions}
                          ref={ref => {
                            seasons = ref;
                          }}
                          placeholder="All"
                          // prevent overlap with tooltips
                          styles={selectStyles}
                          menuPortalTarget={document.body}
                          onChange={() => setSelected(!selected)}
                        />
                      )}
                    </div>
                  </Row>
                  <Row className="py-2">
                    <div className={'col-xl-8 col-sm-12 ' + styles.nopad}>
                      Skills and areas
                      <Select
                        isMulti
                        options={skillsAreasOptions}
                        placeholder="Any"
                        ref={ref => {
                          skillsAreas = ref;
                        }}
                        // colors
                        styles={colorOptionStyles}
                        // prevent overlap with tooltips
                        menuPortalTarget={document.body}
                        onChange={() => setSelected(!selected)}
                      />
                    </div>
                    <div className={'col-xl-4 col-sm-12 ' + styles.nopad}>
                      Credits
                      <Select
                        isMulti
                        options={creditOptions}
                        placeholder="Any"
                        ref={ref => {
                          credits = ref;
                        }}
                        // prevent overlap with tooltips
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        onChange={() => setSelected(!selected)}
                      />
                    </div>
                  </Row>
                  <Row className="py-2">
                    <div className={'col-xl-12 col-sm-12 ' + styles.nopad}>
                      Schools
                      <Select
                        isMulti
                        defaultValue={[schoolOptions[0]]}
                        options={schoolOptions}
                        placeholder="Any"
                        ref={ref => {
                          schools = ref;
                        }}
                        // prevent overlap with tooltips
                        styles={selectStyles}
                        menuPortalTarget={document.body}
                        onChange={() => setSelected(!selected)}
                      />
                    </div>
                  </Row>
                  <Row className="py-2">
                    <Form.Check type="switch" className={styles.toggle_option}>
                      <Form.Check.Input checked={hideCancelled} />
                      <Form.Check.Label
                        onClick={() => setHideCancelled(!hideCancelled)}
                      >
                        Hide cancelled courses
                      </Form.Check.Label>
                    </Form.Check>
                  </Row>
                  <Row className={styles.sliders}>
                    Overall rating
                    <Container>
                      <Range
                        min={1}
                        max={5}
                        step={0.1}
                        defaultValue={ratingBounds}
                        onChange={debounce(value => {
                          setRatingBounds(value);
                        }, 250)}
                        handle={sliderHandle}
                        className={styles.slider}
                      />
                    </Container>
                    Workload
                    <Container>
                      <Range
                        min={1}
                        max={5}
                        step={0.1}
                        defaultValue={workloadBounds}
                        onChange={debounce(value => {
                          setWorkloadBounds(value);
                        }, 250)}
                        handle={sliderHandle}
                        className={styles.slider}
                      />
                    </Container>
                  </Row>
                  <Row className="pt-3 text-right flex-row-reverse">
                    <Button
                      type="submit"
                      className={'pull-right ' + styles.secondary_submit}
                    >
                      Search
                    </Button>
                  </Row>
                </div>
              </Form>
            </Sticky>
          </Col>
          <Col
            md={8}
            lg={9}
            className={
              'm-0 ' +
              (isMobile
                ? 'p-3 ' + styles.results_col_mobile
                : 'pl-2 py-3 pr-3 ' + styles.results_col)
            }
          >
            {results}
          </Col>
        </Row>
      </HotKeys>
    </div>
  );
}

export default App;
