import React, { useState, useEffect, useCallback } from 'react';

import { GlobalHotKeys } from 'react-hotkeys';

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
} from 'react-bootstrap';

import { SEARCH_COURSES } from '../queries/QueryStrings';

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

import { FaSearch } from 'react-icons/fa';
import { BsX } from 'react-icons/bs';
import { flatten, preprocess_courses } from '../utilities';

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

  const [collapsed_form, setCollapsedForm] = useState(false);
  // useEffect(() => {
  //   if (width < 1200 && !collapsed_form) setCollapsedForm(true);
  //   if (width > 1200 && collapsed_form) setCollapsedForm(false);
  // }, [width]);

  // States involved in infinite scroll
  const [old_data, setOldData] = useState([]); // Holds the combined list of courses
  const [searching, setSearching] = useState(false); // True when performing query. False right when query complete. Prevents double saving
  const [fetchedAll, setFetchedAll] = useState(false); // True when we've fetched all courses
  const [refreshCache, setRefreshCache] = useState(0); // Reset row height cache on search

  // number of search results to return
  const QUERY_SIZE = 30;

  // State used to determine whether or not to show season tags
  // (if multiple seasons are queried, the season is indicated)
  const [multiSeasons, setMultiSeasons] = useState(false);

  //State used to rebuild form DOM to reset it
  const [form_key, setFormKey] = useState(0);

  // way to display results
  const [isList, setView] = useState(isMobile ? false : true);

  // react-select refs to get options later
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
    seasonsOptions = seasonsData.seasons.map(x => {
      return {
        value: x.season_code,
        // capitalize term and add year
        label: x.term.charAt(0).toUpperCase() + x.term.slice(1) + ' ' + x.year,
      };
    });
  }

  // handler for executing search with text
  var [
    executeSearch,
    { called: searchCalled, loading: searchLoading, data: searchData },
  ] = useLazyQuery(
    SEARCH_COURSES,
    { fetchPolicy: 'no-cache' } // Doesn't cache results, so always search results always rerender on new search. Comment this out if implementing fetchMore
  );

  const handleChange = () => {
    if (!props.location.state) return;
    // reset searchText
    const { history } = props;
    history.replace();
  };

  // resubmit search on view change
  const handleSetView = isList => {
    setView(isList);
    handleSubmit(null, true);
  };

  // search form submit handler
  const handleSubmit = useCallback((event, search = false) => {
    let temp_offset = -1;
    if (event && search) event.preventDefault();
    if (search) {
      //Reset states when making a new search
      setOldData([]);
      setFetchedAll(false);
      setRefreshCache(refreshCache + 1);
      // if (!defaultSearch) setCollapsedForm(true);
      temp_offset = 0; // Account for reset state lag
    } else if (fetchedAll) return;

    // sorting options
    var sortParams = sortby.select.props.value.value;
    var ordering = sortbyQueries[sortParams];

    // seasons to filter
    var processedSeasons = seasons.select.props.value;
    if (processedSeasons != null) {
      processedSeasons = processedSeasons.map(x => {
        return x.value;
      });
    }

    // whether or not multiple seasons are being returned
    const temp_multiSeasons = processedSeasons
      ? processedSeasons.length > 1
      : false;
    if (temp_multiSeasons !== multiSeasons) setMultiSeasons(temp_multiSeasons);

    // skills and areas
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

      // separate skills and areas
      var processedSkills = processedSkillsAreas.filter(x =>
        skills.includes(x)
      );
      var processedAreas = processedSkillsAreas.filter(x => areas.includes(x));

      // set null defaults
      if (processedSkills.length === 0) {
        processedSkills = null;
      }
      if (processedAreas.length === 0) {
        processedAreas = null;
      }
    }

    // credits to filter
    var processedCredits = credits.select.props.value;
    if (processedCredits != null) {
      processedCredits = processedCredits.map(x => {
        return x.value;
      });
    }

    // schools to filter
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
      search_text: searchText.value,
      ordering: ordering,
      offset: temp_offset === -1 ? old_data.length : temp_offset,
      limit: search ? 60 : QUERY_SIZE,
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
    executeSearch({
      variables: search_variables,
    });
  });

  if (searchCalled) {
    if (searchLoading) {
      if (!searching) setSearching(true); // Set searching after loading starts
    } else {
      // Keep old courses until new courses are fetched
      if (searchData && searching) {
        if (searchData.search_listing_info.length < QUERY_SIZE)
          setFetchedAll(true);
        // Combine old courses with new fetched courses
        searchData = searchData.search_listing_info.map(x => {
          return flatten(x);
        });
        searchData = searchData.map(x => {
          return preprocess_courses(x);
        });
        let new_data = [...old_data].concat(searchData);
        setOldData(new_data); // Replace old with new
        setSearching(false); // Not searching
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

  var [tooTall, setTooTall] = React.useState(true);
  var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

  // reset the search form
  const handleResetFilters = () => {
    setHideCancelled(true);
    setRatingBounds([1, 5]);
    setWorkloadBounds([1, 5]);
    setFormKey(form_key + 1);
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
      <GlobalHotKeys
        keyMap={keyMap}
        handlers={handlers}
        allowChanges={true} // required for global
        style={{ outline: 'none' }}
      />
      <Row
        className={
          'p-0 m-0 ' + (!isMobile ? 'd-flex flex-row-reverse flex-nowrap' : '')
        }
      >
        <Col
          md={4}
          lg={4}
          xl={3}
          className={
            (isMobile
              ? `p-3 ${Styles.search_col_mobile}`
              : `pr-0 py-3 pl-3 ${Styles.search_col}`) +
            (!isMobile ? ' order-2' : '')
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
              onSubmit={event => {
                handleSubmit(event, true);
              }}
              ref={ref => {
                searchCol = ref;
              }}
              key={form_key}
            >
              {!isMobile && (
                <React.Fragment>
                  <div
                    className={
                      Styles.search_tab +
                      (collapsed_form
                        ? ''
                        : ' '.concat(Styles.search_tab_hidden))
                    }
                    onClick={() => {
                      setCollapsedForm(false);
                    }}
                  >
                    <FaSearch style={{ display: 'block' }} />
                  </div>
                  <div
                    className={Styles.collapse_form_btn}
                    onClick={() => {
                      setCollapsedForm(true);
                    }}
                  >
                    <BsX style={{ display: 'block' }} size={20} />
                  </div>
                </React.Fragment>
              )}
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
                      ref={ref => (searchText = ref)}
                    />
                  </InputGroup>
                </div>
              </Row>
              <Row className={`py-0 px-4 ${Styles.sort_container}`}>
                <div className={`col-md-12 p-0 ${Styles.selector_container}`}>
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
                  <div className={Styles.filter_title}>Semesters</div>
                  {seasonsOptions && (
                    <Select
                      isMulti
                      // defaultValue={[seasonsOptions[0]]}
                      defaultValue={[{ value: '202003', label: 'Fall 2020' }]}
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
                <div className={`col-md-12 p-0  ${Styles.selector_container}`}>
                  <div className={Styles.filter_title}>Skills and areas</div>
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
                  <div className={Styles.filter_title}>Credits</div>
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
                  <div className={Styles.filter_title}>Schools</div>
                  <Select
                    isMulti
                    defaultValue={[
                      { value: 'YC', label: 'Yale College' },
                      { value: 'GS', label: 'Graduate' },
                    ]}
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
              <Row className={`pt-0 pb-2 px-2 ${Styles.sliders}`}>
                <Col>
                  <Container style={{ paddingTop: '1px' }}>
                    <Range
                      min={1}
                      max={5}
                      step={0.1}
                      defaultValue={ratingBounds}
                      // debounce the slider state update
                      // to make it smoother
                      onChange={debounce(value => {
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
                      // debounce the slider state update
                      // to make it smoother
                      onChange={debounce(value => {
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
                    onChange={e => {}} // dummy handler to remove warning
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
          md={collapsed_form ? 12 : 8}
          lg={collapsed_form ? 12 : 8}
          xl={collapsed_form ? 12 : 9}
          className={
            'm-0 ' +
            (isMobile
              ? 'p-3 ' + Styles.results_col_mobile
              : (collapsed_form ? 'px-5 pt-3 ' : 'p-3 ') + Styles.results_col)
          }
        >
          <SearchResults
            data={old_data}
            isList={isList}
            setView={handleSetView}
            loading={searchLoading}
            loadMore={handleSubmit}
            multiSeasons={multiSeasons}
            refreshCache={refreshCache}
            fetchedAll={fetchedAll}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Search;
