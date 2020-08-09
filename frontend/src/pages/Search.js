import React, { useState, useEffect } from 'react';

import { HotKeys } from 'react-hotkeys';

import Styles from './Search.module.css';

import SearchResults from '../components/SearchResults';

import {
  Col,
  Container,
  Row,
  Form,
  FormControl,
  InputGroup,
  Button,
  Fade,
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

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import { FaArrowCircleUp } from 'react-icons/fa';

// Multi-Select Animations
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();

function Search(props) {
  const { height, width } = useWindowDimensions();
  const seasonsData = useSeasons();

  const isMobile = width < 768;
  const [default_search, setDefaultSearch] = useState(true);
  var searchText = React.useRef(
    props.location && props.location.state
      ? props.location.state.search_val
      : null
  );

  // States involved in infinite scroll
  const [fetch_more, setFetchMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [old_data, setOldData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [end, setEnd] = useState(false);
  const [scroll_pos, setScroll] = useState(0); // Scroll pos

  // Size of Query constant
  const query_size = 20;

  // State used to determine whether or not to show season tags
  const [multi_seasons, setMultiSeasons] = useState(false);

  //State used to rebuild form DOM to reset it
  const [form_key, setFormKey] = useState(0);

  var [searchType, setSearchType] = React.useState();
  const [isList, setView] = useState(true);

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
  ] = useLazyQuery(SEARCH_COURSES_TEXTLESS, { fetchPolicy: 'no-cache' });

  var [
    executeTextSearch,
    { called: textCalled, loading: textLoading, data: textData },
  ] = useLazyQuery(SEARCH_COURSES, { fetchPolicy: 'no-cache' });

  const handleChange = () => {
    if (!props.location.state) return;
    //Reset searchText
    const { location, history } = props;
    history.replace();
  };

  useEffect(() => {
    if (default_search) {
      handleSubmit();
      setDefaultSearch(false);
    }
  }, []);

  useEffect(() => {
    // Fetch more courses if scroll to bottom and there are still courses
    if (fetch_more && !end) {
      handleSubmit(); // Perform query
    }
  }, [fetch_more]);

  const handleSubmit = event => {
    let offset2 = -1;
    if (event) {
      event.preventDefault();
      window.scrollTo({ top: scroll_pos < 78 ? scroll_pos : 78, left: 0 });
      //Reset states when making a new search
      setOffset(0);
      setEnd(false);
      setOldData([]);
      setFetchMore(false);
      offset2 = 0; // Account for reset state lag
    }

    var sortParams = sortby.select.props.value.value;

    var ordering = sortbyQueries[sortParams];

    var processedSeasons =
      seasons.select && seasons.select.props.value.length > 0
        ? seasons.select.props.value
        : seasonsOptions
        ? seasonsOptions
        : [{ value: '202003' }];

    if (processedSeasons != null) {
      processedSeasons = processedSeasons.map(x => {
        return x.value;
      });
    }
    const temp_multi_seasons = processedSeasons
      ? processedSeasons.length > 1
      : false;
    if (temp_multi_seasons !== multi_seasons)
      setMultiSeasons(temp_multi_seasons);

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
    const search_variables = {
      ordering: ordering,
      offset: offset2 === -1 ? offset : offset2,
      limit: query_size,
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
    };

    if (searchText.value === '') {
      setSearchType('TEXTLESS');
      executeTextlessSearch({
        variables: search_variables,
      });
    } else {
      setSearchType('TEXT');
      executeTextSearch({
        variables: Object.assign(search_variables, {
          search_text: searchText.value,
        }),
      });
    }
  };

  var results;

  if (searchType === 'TEXTLESS') {
    if (textlessCalled) {
      if (textlessLoading) {
        if (!searching) setSearching(true); // Set searching after loading starts
        if (!offset) results = <div>Loading...</div>;
        // Keep old courses until new courses are fetched
      } else {
        if (textlessData && searching) {
          // Combine old courses with new fetched courses
          let new_data = [...old_data].concat(
            textlessData.computed_course_info
          );
          setOldData(new_data); // Replace old with new
          setSearching(false); // Not searching
          setFetchMore(false); // Don't fetch more until new courses are loaded
        }
      }
    }
  } else if (searchType === 'TEXT') {
    if (textCalled) {
      if (textLoading) {
        if (!searching) setSearching(true); // Set searching after loading starts
        if (!offset) results = <div>Loading...</div>;
      } else {
        if (textData && searching) {
          // Combine old courses with new fetched courses
          let new_data = [...old_data].concat(textData.search_course_info);
          setOldData(new_data); // Replace old with new
          setSearching(false); // Not searching
          setFetchMore(false); // Don't fetch more until new courses are loaded
        }
      }
    }
  }

  // ctrl/cmd-f search hotkey
  const focusSearch = e => {
    if (e && searchText) {
      e.preventDefault();
      searchText.focus();
    }
  };

  const keyMap = {
    FOCUS_SEARCH: ['ctrl+f', 'command+f'],
  };

  const handlers = {
    FOCUS_SEARCH: focusSearch,
  };

  const { Handle } = Slider;

  const ratingSliderHandle = e => {
    const { value, className } = e;
    return (
      <Handle {...e} key={className}>
        <div className={`shadow ${Styles.rating_tooltip}`}>{value}</div>
      </Handle>
    );
  };

  const workloadSliderHandle = e => {
    const { value, className } = e;
    return (
      <Handle {...e} key={className}>
        <div className={`shadow ${Styles.workload_tooltip}`}>{value}</div>
      </Handle>
    );
  };

  var searchCol = React.useRef();
  var searchColHeight;
  var [tooTall, setTooTall] = React.useState(true);

  useEffect(() => {
    searchColHeight = searchCol.clientHeight;
    setTooTall(searchColHeight > height);
  });

  const handleResetFilters = () => {
    setHideCancelled(true);
    setRatingBounds([1, 5]);
    setWorkloadBounds([1, 5]);
    setFormKey(form_key + 1);
  };

  // Scroll to top button
  const scroll_top = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div className={Styles.search_base}>
      <HotKeys keyMap={keyMap} handlers={handlers} style={{ outline: 'none' }}>
        <Row className="p-0 m-0">
          <Col
            md={4}
            lg={4}
            xl={3}
            className={
              isMobile
                ? `p-3 ${Styles.search_col_mobile}`
                : `pr-2 py-3 pl-3 ${Styles.search_col}`
            }
          >
            <div className={!isMobile && !tooTall ? Styles.sticky : ''}>
              <Form
                className={`shadow-sm px-3 ${Styles.search_container}`}
                onSubmit={handleSubmit}
                ref={ref => {
                  searchCol = ref;
                }}
                key={form_key}
              >
                <Row className="pt-3 px-4">
                  <small
                    className={Styles.reset_filters_btn + ' pl-1'}
                    onClick={handleResetFilters}
                    style={{color: '#e23e57'}}
                  >
                    Reset Filters
                  </small>
                </Row>
                <Row className="pt-2 px-4 pb-2">
                  <div className={Styles.search_bar}>
                    <InputGroup className={Styles.search_input}>
                      <FormControl
                        type="text"
                        defaultValue={
                          searchText.current !== ''
                            ? searchText.current
                            : undefined
                        }
                        onChange={handleChange}
                        placeholder="Find a class..."
                        ref={ref => (searchText = ref)}
                      />
                    </InputGroup>
                  </div>
                </Row>
                <Row className={`py-0 px-4 ${Styles.sort_container}`}>
                  <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
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
                </Row>
                <hr />
                <Row className={`py-0 px-4 ${Styles.multi_selects}`}>
                  <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
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
                        components={animatedComponents}
                      />
                    )}
                  </div>
                  <div
                    className={`col-md-12 p-0  ${Styles.selector_container}`}
                  >
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
                      components={animatedComponents}
                    />
                  </div>
                  <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
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
                      components={animatedComponents}
                    />
                  </div>
                  <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
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
                      components={animatedComponents}
                    />
                  </div>
                </Row>
                <hr />
                <Row className={`pt-0 pb-3 px-4 ${Styles.sliders}`}>
                  <div>Overall rating</div>
                  <Container>
                    <Range
                      min={1}
                      max={5}
                      step={0.1}
                      defaultValue={ratingBounds}
                      onChange={debounce(value => {
                        setRatingBounds(value);
                      }, 250)}
                      handle={ratingSliderHandle}
                      className={Styles.slider}
                    />
                  </Container>
                  <div>Workload</div>
                  <Container>
                    <Range
                      min={1}
                      max={5}
                      step={0.1}
                      defaultValue={workloadBounds}
                      onChange={debounce(value => {
                        setWorkloadBounds(value);
                      }, 250)}
                      handle={workloadSliderHandle}
                      className={Styles.slider}
                    />
                  </Container>
                </Row>
                <Row
                  className={`pt-3 pb-3 px-5 ${Styles.light_bg} ${Styles.toggle_row}`}
                >
                  <Form.Check type="switch" className={Styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideCancelled}
                      onChange={e => {}} // dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => setHideCancelled(!hideCancelled)}
                    >
                      Hide cancelled courses
                    </Form.Check.Label>
                  </Form.Check>
                </Row>
                <Row className="flex-row-reverse">
                  <Button
                    type="submit"
                    className={'pull-right ' + Styles.secondary_submit}
                  >
                    Search courses
                  </Button>
                </Row>
              </Form>
            </div>
          </Col>
          <Col
            md={8}
            lg={8}
            xl={9}
            className={
              'm-0 ' +
              (isMobile
                ? 'p-3 ' + Styles.results_col_mobile
                : 'pl-2 py-3 pr-3 ' + Styles.results_col)
            }
          >
            {results ? (
              results
            ) : (
              <SearchResults
                data={old_data}
                isList={isList}
                setView={setView}
                fetch_more={fetch_more}
                setFetchMore={setFetchMore}
                offset={offset}
                setOffset={setOffset}
                setEnd={setEnd}
                setScroll={setScroll}
                multi_seasons={multi_seasons}
                query_size={query_size}
              />
            )}
          </Col>
        </Row>
      </HotKeys>
      <Fade in={scroll_pos > 3 * height}>
        <div className={Styles.up_btn}>
          <FaArrowCircleUp timeout={1000} onClick={scroll_top} size={30} />
        </div>
      </Fade>
    </div>
  );
}

export default Search;