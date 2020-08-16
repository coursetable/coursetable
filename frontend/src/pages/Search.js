import React, { useState, useEffect, useCallback } from 'react';

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

  const isMobile = width < 768;
  const [defaultSearch, setDefaultSearch] = useState(true);
  var searchText = React.useRef(
    props.location && props.location.state
      ? props.location.state.search_val
      : null
  );

  // States involved in infinite scroll
  const [offset, setOffset] = useState(0); // How many courses to skip in query
  const [old_data, setOldData] = useState([]); // Holds the combined list of courses
  const [searching, setSearching] = useState(false); // True when performing query. False right when query complete. Prevents double saving
  const [scroll_pos, setScroll] = useState(0); // Scroll pos
  const [end, setEnd] = useState(false); // True when we've fetched all courses
  const [refresh_cache, setRefreshCache] = useState(0); // Reset row height cache on search
  // const [search_query, setSearchQuery] = useState({}); // Stores the search query

  // Size of Query constant
  const QUERY_SIZE = 100;

  // State used to determine whether or not to show season tags
  const [multi_seasons, setMultiSeasons] = useState(false);

  //State used to rebuild form DOM to reset it
  const [form_key, setFormKey] = useState(0);

  var [searchType, setSearchType] = React.useState();
  const [isList, setView] = useState(isMobile ? false : true);

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

  // populate seasons from database
  var seasonsOptions;

  const seasonsData = useSeasons();
  if (seasonsData && seasonsData.seasons) {
    seasonsOptions = seasonsData.seasons.map((x) => {
      return {
        value: x.season_code,
        label: x.term.charAt(0).toUpperCase() + x.term.slice(1) + ' ' + x.year,
      };
    });
  }

  // handler for executing search with no text query
  var [
    executeTextlessSearch,
    { called: textlessCalled, loading: textlessLoading, data: textlessData },
  ] = useLazyQuery(
    SEARCH_COURSES_TEXTLESS,
    { fetchPolicy: 'no-cache' } // Doesn't cache results, so always search results always rerender on new search. Comment this out if implementing fetchMore
  );

  // handler for executing search with text
  var [
    executeTextSearch,
    { called: textCalled, loading: textLoading, data: textData },
  ] = useLazyQuery(
    SEARCH_COURSES,
    { fetchPolicy: 'no-cache' } // Doesn't cache results, so always search results always rerender on new search. Comment this out if implementing fetchMore
  );

  const handleChange = () => {
    if (!props.location.state) return;
    //Reset searchText
    const { history } = props;
    history.replace();
  };

  // resubmit search on view change
  const handleSetView = (isList) => {
    setView(isList);
    handleSubmit(null, true);
  };

  // search form submit handler
  const handleSubmit = useCallback((event, search = false) => {
    let offset2 = -1;
    if (event && search) event.preventDefault();
    if (search) {
      window.scrollTo({ top: scroll_pos < 78 ? scroll_pos : 78, left: 0 });
      //Reset states when making a new search
      setOffset(0);
      setOldData([]);
      setEnd(false);
      setRefreshCache(refresh_cache + 1);
      offset2 = 0; // Account for reset state lag
    } else if (end) return;

    // sorting options
    var sortParams = sortby.select.props.value.value;
    var ordering = sortbyQueries[sortParams];

    // seasons to filter
    var processedSeasons = seasons.select.props.value;
    if (processedSeasons != null) {
      processedSeasons = processedSeasons.map((x) => {
        return x.value;
      });
    }

    // whether or not multiple seasons are being returned
    const temp_multi_seasons = processedSeasons
      ? processedSeasons.length > 1
      : false;
    if (temp_multi_seasons !== multi_seasons)
      setMultiSeasons(temp_multi_seasons);

    // skills and areas
    var processedSkillsAreas = skillsAreas.select.props.value;
    if (processedSkillsAreas != null) {
      processedSkillsAreas = processedSkillsAreas.map((x) => {
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

      // separate skills and areas
      var processedSkills = processedSkillsAreas.filter((x) =>
        skills.includes(x)
      );
      var processedAreas = processedSkillsAreas.filter((x) =>
        areas.includes(x)
      );

      // set null defaults
      if (processedSkills.length === 0) {
        processedSkills = null;
      }
      if (processedAreas.length === 0) {
        processedAreas = null;
      }
    }

    // credits to filter`
    var processedCredits = credits.select.props.value;
    if (processedCredits != null) {
      processedCredits = processedCredits.map((x) => {
        return x.value;
      });
    }

    // schools to filter
    var processedSchools = schools.select.props.value;
    if (processedSchools != null) {
      processedSchools = processedSchools.map((x) => {
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
      offset: offset2 === -1 ? old_data.length : offset2,
      limit: QUERY_SIZE,
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
  });

  var results;

  if (searchType === 'TEXTLESS') {
    if (textlessCalled) {
      if (textlessLoading) {
        if (!searching) setSearching(true); // Set searching after loading starts
        if (!offset) results = <div>Loading...</div>;
      } else {
        // Keep old courses until new courses are fetched
        if (textlessData && searching) {
          if (textlessData.computed_course_info.length < QUERY_SIZE)
            setEnd(true);
          // Combine old courses with new fetched courses
          let new_data = [...old_data].concat(
            textlessData.computed_course_info
          );
          setOldData(new_data); // Replace old with new
          setSearching(false); // Not searching
        }
      }
    }
  } else if (searchType === 'TEXT') {
    if (textCalled) {
      if (textLoading) {
        if (!searching) setSearching(true); // Set searching after loading starts
        if (!offset) results = <div>Loading...</div>;
      } else {
        // Keep old courses until new courses are fetched
        if (textData && searching) {
          if (textData.search_course_info.length < QUERY_SIZE) setEnd(true);
          // Combine old courses with new fetched courses
          let new_data = [...old_data].concat(textData.search_course_info);
          setOldData(new_data); // Replace old with new
          setSearching(false); // Not searching
        }
      }
    }
  }

  // ctrl/cmd-f search hotkey
  const focusSearch = (e) => {
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

  const ratingSliderHandle = (e) => {
    const { value, className } = e;
    return (
      <Handle {...e} key={className}>
        <div className={`shadow ${Styles.rating_tooltip}`}>{value}</div>
      </Handle>
    );
  };

  const workloadSliderHandle = (e) => {
    const { value, className } = e;
    return (
      <Handle {...e} key={className}>
        <div className={`shadow ${Styles.workload_tooltip}`}>{value}</div>
      </Handle>
    );
  };

  var [tooTall, setTooTall] = React.useState(true);
  var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

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

  // check if the search form is too tall
  // to be sticky

  var searchCol = React.useRef();

  useEffect(() => {
    var searchColHeight = searchCol.clientHeight;
    setTooTall(searchColHeight > height);
  }, [setTooTall, height]);

  // perform default search on load
  useEffect(() => {
    // only execute after seasons have been loaded
    if (defaultSearch && seasonsOptions) {
      handleSubmit(null, true);
      setDefaultSearch(false);
    }
  }, [seasonsOptions, defaultSearch, handleSubmit]);

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
            <div
              className={
                // only make the filters sticky if not on mobile and
                // tall enough
                !isTouch && !tooTall ? Styles.sticky : ''
              }
            >
              <Form
                className={`shadow-sm px-3 ${Styles.search_container}`}
                onSubmit={(event) => {
                  handleSubmit(event, true);
                }}
                ref={(ref) => {
                  searchCol = ref;
                }}
                key={form_key}
              >
                <Row className="pt-3 px-4">
                  <small
                    className={Styles.reset_filters_btn + ' pl-1'}
                    onClick={handleResetFilters}
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
                        ref={(ref) => (searchText = ref)}
                      />
                    </InputGroup>
                  </div>
                </Row>
                <Row className={`py-0 px-4 ${Styles.sort_container}`}>
                  <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
                    <Select
                      defaultValue={sortbyOptions[0]}
                      options={sortbyOptions}
                      ref={(ref) => {
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
                    <div className={Styles.filter_title}>Semesters</div>
                    {seasonsOptions && (
                      <Select
                        isMulti
                        defaultValue={[seasonsOptions[0]]}
                        options={seasonsOptions}
                        ref={(ref) => {
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
                    <div className={Styles.filter_title}>Skills and areas</div>
                    <Select
                      isMulti
                      options={skillsAreasOptions}
                      placeholder="Any"
                      ref={(ref) => {
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
                    <div className={Styles.filter_title}>Credits</div>
                    <Select
                      isMulti
                      options={creditOptions}
                      placeholder="Any"
                      ref={(ref) => {
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
                    <div className={Styles.filter_title}>Schools</div>
                    <Select
                      isMulti
                      defaultValue={[schoolOptions[0]]}
                      options={schoolOptions}
                      placeholder="Any"
                      ref={(ref) => {
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
                <Row className={`pt-0 pb-2 px-2 ${Styles.sliders}`}>
                  <Col>
                    <Container style={{ paddingTop: '1px' }}>
                      <Range
                        min={1}
                        max={5}
                        step={0.1}
                        defaultValue={ratingBounds}
                        onChange={debounce((value) => {
                          setRatingBounds(value);
                        }, 250)}
                        handle={ratingSliderHandle}
                        className={Styles.slider}
                      />
                    </Container>
                    <div className={`text-center ${Styles.filter_title}`}>
                      Overall rating
                    </div>
                  </Col>
                  <Col>
                    <Container>
                      <Range
                        min={1}
                        max={5}
                        step={0.1}
                        defaultValue={workloadBounds}
                        onChange={debounce((value) => {
                          setWorkloadBounds(value);
                        }, 250)}
                        handle={workloadSliderHandle}
                        className={Styles.slider}
                      />
                    </Container>
                    <div className={`text-center ${Styles.filter_title}`}>
                      Workload
                    </div>
                  </Col>
                </Row>
                <Row
                  className={`pt-2 pb-2 px-5 justify-content-center ${Styles.light_bg} ${Styles.toggle_row}`}
                >
                  <Form.Check type="switch" className={Styles.toggle_option}>
                    <Form.Check.Input
                      checked={hideCancelled}
                      onChange={(e) => {}} // dummy handler to remove warning
                    />
                    <Form.Check.Label
                      onClick={() => setHideCancelled(!hideCancelled)}
                    >
                      Hide cancelled
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
                setView={handleSetView}
                offset={offset}
                setOffset={setOffset}
                loading={searchType === 'TEXT' ? textLoading : textlessLoading}
                loadMore={handleSubmit}
                setScroll={setScroll}
                multi_seasons={multi_seasons}
                QUERY_SIZE={QUERY_SIZE}
                refresh_cache={refresh_cache}
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
