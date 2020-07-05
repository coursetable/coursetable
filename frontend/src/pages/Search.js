import React from 'react';

import styles from './Search.module.css';
import './Search.css';

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
} from 'react-bootstrap';

import {
  SEARCH_COURSES,
  SEARCH_COURSES_TEXTLESS,
} from '../queries/QueryStrings';

import { useLazyQuery } from '@apollo/react-hooks';

import Select from 'react-select';

import { useWindowDimensions } from '../components/WindowDimensionsProvider';

import { debounce } from 'lodash';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

// TODO:
//  - hide cancelled
//  - pagination

function App() {
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  var searchText = React.createRef();

  var [searchType, setSearchType] = React.useState();

  var sortby = React.createRef();
  var seasons = React.createRef();
  var skillsAreas = React.createRef();
  var credits = React.createRef();

  var [HideGraduate, setHideGraduate] = React.useState(false);
  var [HideCancelled, setHideCancelled] = React.useState(true);

  var [ratingBounds, setRatingBounds] = React.useState([0, 5]);
  var [workloadBounds, setWorkloadBounds] = React.useState([0, 5]);

  // dummy variable to make selectors update
  // parent state and avoid tooltip errors
  var [selected, setSelected] = React.useState(false);

  const sortby_options = [
    { label: 'Relevance', value: 'text' },
    { label: 'Course name', value: 'course_name' },
    { label: 'Rating', value: 'rating' },
    { label: 'Workload', value: 'workload' },
    // { label: 'Enrollment', value: 'enrollment' },
  ];

  var sortbyQueries = {
    text: null,
    course_name: { title: 'asc' },
    rating: { average_rating: 'asc' },
    workload: { average_workload: 'asc' },
  };

  const seasons_options = [
    { label: 'Fall 2020', value: '202003' },
    { label: 'Summer 2020', value: '202002' },
    { label: 'Spring 2020', value: '202001' },
    { label: 'Fall 2019', value: '201903' },
  ];

  const areas = ['Hu', 'So', 'Sc'];
  const skills = ['QR', 'WR', 'L1', 'L2', 'L3', 'L4', 'L5'];

  const skills_areas_options = [
    { label: 'HU', value: 'Hu', color: '#9970AB' },
    { label: 'SO', value: 'So', color: '#4393C3' },
    { label: 'SC', value: 'Sc', color: '#5AAE61' },
    { label: 'QR', value: 'QR', color: '#CC3311' },
    { label: 'WR', value: 'WR', color: '#EC7014' },
    { label: 'L (all)', value: 'L', color: '#000000' },
    { label: 'L1', value: 'L1', color: '#A0A0A0' },
    { label: 'L2', value: 'L2', color: '#A0A0A0' },
    { label: 'L3', value: 'L3', color: '#A0A0A0' },
    { label: 'L4', value: 'L4', color: '#A0A0A0' },
    { label: 'L5', value: 'L5', color: '#A0A0A0' },
  ];

  const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor:
            !isDisabled && (isSelected ? data.color : color.alpha(0.5).css()),
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.25).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
      fontWeight: 'bold'
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: base => ({
      ...base,
      marginTop: 0,
    }),
  };

  const selectStyles = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: base => ({
      ...base,
      marginTop: 0,
    }),
  };

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

    var allowedSchools = null;

    if (HideGraduate) {
      allowedSchools = ['YC'];
    }

    // if the bounds are unaltered, we need to set them to null
    // to include unrated courses
    var include_all_ratings = ratingBounds[0] === 0 && ratingBounds[1] === 5;
    var include_all_workloads =
      workloadBounds[0] === 0 && workloadBounds[1] === 5;

    if (searchText.value === '') {
      setSearchType('TEXTLESS');
      executeTextlessSearch({
        variables: {
          ordering: ordering,
          seasons: processedSeasons,
          areas: processedAreas,
          skills: processedSkills,
          credits: processedCredits,
          schools: allowedSchools,
          min_rating: include_all_ratings ? null : ratingBounds[0],
          max_rating: include_all_ratings ? null : ratingBounds[1],
          min_workload: include_all_workloads ? null : workloadBounds[0],
          max_workload: include_all_workloads ? null : workloadBounds[1],
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
          schools: allowedSchools,
          min_rating: include_all_ratings ? null : ratingBounds[0],
          max_rating: include_all_ratings ? null : ratingBounds[1],
          min_workload: include_all_workloads ? null : workloadBounds[0],
          max_workload: include_all_workloads ? null : workloadBounds[1],
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

  return (
    <div className={styles.search_base}>
      <Row className={styles.nopad + ' ' + styles.nomargin}>
        <Col
          md={4}
          className={
            'm-0 px-4 py-4 ' +
            (isMobile ? styles.search_col_mobile : styles.search_col)
          }
        >
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

            <div className={'container ' + styles.search_options_container}>
              <Row className="py-2">
                <div className={'col-xl-4 col-md-12 ' + styles.nopad}>
                  Sort by{' '}
                  <Select
                    defaultValue={sortby_options[0]}
                    options={sortby_options}
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
                  <Select
                    isMulti
                    defaultValue={[seasons_options[0]]}
                    options={seasons_options}
                    ref={ref => {
                      seasons = ref;
                    }}
                    placeholder="All"
                    // prevent overlap with tooltips
                    styles={selectStyles}
                    menuPortalTarget={document.body}
                    onChange={() => setSelected(!selected)}
                  />
                </div>
              </Row>
              <Row className="py-2">
                <div className={'col-xl-8 col-sm-12 ' + styles.nopad}>
                  Skills and areas
                  <Select
                    isMulti
                    options={skills_areas_options}
                    placeholder="Any"
                    ref={ref => {
                      skillsAreas = ref;
                    }}
                    // colors
                    styles={colourStyles}
                    // prevent overlap with tooltips
                    menuPortalTarget={document.body}
                    onChange={() => setSelected(!selected)}
                  />
                </div>
                <div className={'col-xl-4 col-sm-12 ' + styles.nopad}>
                  Credits
                  <Select
                    isMulti
                    options={credits_options}
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
              </Row>
              <Row className={styles.sliders}>
                Overall rating
                <Container>
                  <Range
                    min={0}
                    max={5}
                    step={0.1}
                    defaultValue={ratingBounds}
                    onChange={debounce(value => {
                      setRatingBounds(value);
                    }, 250)}
                    tipProps={{
                      visible: true,
                      align: { offset: [0, 4] },
                    }}
                    className={styles.slider}
                  />
                </Container>
                Workload
                <Container>
                  <Range
                    min={0}
                    max={5}
                    step={0.1}
                    defaultValue={workloadBounds}
                    onChange={debounce(value => {
                      setWorkloadBounds(value);
                    }, 250)}
                    tipProps={{
                      visible: true,
                      align: { offset: [0, 4] },
                    }}
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
        </Col>
        <Col
          md={8}
          className={
            'm-0 p-0 ' +
            (isMobile ? styles.results_col_mobile : styles.results_col)
          }
        >
          {results}
        </Col>
      </Row>
    </div>
  );
}

export default App;
