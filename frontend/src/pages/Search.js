import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { Col, Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import debounce from 'lodash/debounce';
import { Handle, Range } from 'rc-slider';
import { FaSearch } from 'react-icons/fa';
import { BsX } from 'react-icons/bs';
import { Element, scroller } from 'react-scroll';
import styled from 'styled-components';
import posthog from 'posthog-js';
import Styles from './Search.module.css';

import CatalogResults from '../components/CatalogResults';
import CourseModal from '../components/CourseModal';

import {
  areas,
  skills,
  skillsAreasOptions,
  creditOptions,
  schoolOptions,
  subjectOptions,
  sortbyOptions,
} from '../queries/Constants';

import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import { useCourseData, useFerry } from '../components/FerryProvider';
import CustomSelect from '../components/CustomSelect';
import SortByReactSelect from '../components/SortByReactSelect';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import { useUser } from '../user';
import {
  SurfaceComponent,
  StyledInput,
  StyledHr,
  TextComponent,
} from '../components/StyledComponents';

import { setSSObject, useSessionStorageState } from '../browserStorage';
import { getNumFB, getOverallRatings, sortCourses } from '../courseUtilities';
import { useSearch, defaultFilters } from '../searchContext';

const StyledSearchTab = styled.div`
  background-color: ${({ theme }) =>
    theme.theme === 'light' ? 'rgb(198, 232, 255)' : theme.select_hover};
`;

/**
 * Renders search page
 * @prop location - dictionary that contains search value if search bar was used
 * @prop history - dictionary that is used to reset default search value
 */

function Search() {
  // Fetch window dimensions
  const { height, width } = useWindowDimensions();
  const isMobile = width < 768;

  // Is the search form  collapsed?
  const [collapsed_form, setCollapsedForm] = useState(true);

  // State that determines if a course modal needs to be displayed and which course to display
  const [course_modal, setCourseModal] = useState([false, '']);

  // Show the modal for the course that was clicked
  const showModal = useCallback(
    (listing) => {
      posthog.capture('course-modal-open', {
        season_code: listing.season_code,
        course_code: listing.course_code,
        crn: listing.crn,
      });

      setCourseModal([true, listing]);
    },
    [setCourseModal]
  );

  // Reset course_modal state to hide the modal
  const hideModal = () => {
    setCourseModal([false, '']);
  };

  // number of search results to return
  // const QUERY_SIZE = 30;

  // way to display results
  const [isList, setView] = useSessionStorageState('isList', !isMobile);

  // Get search context data
  const {
    seasonsOptions,
    coursesLoading,
    searchData,
    multiSeasons,
    isLoggedIn,
    num_fb,
  } = useSearch();

  const handleSetView = useCallback(
    (isList) => {
      posthog.capture('catalog-view-toggle', { isList });
      setView(isList);
    },
    [setView]
  );

  const scroll_to_results = useCallback(
    (event) => {
      if (event) event.preventDefault();

      // Scroll down to catalog when in mobile view.
      if (isMobile) {
        scroller.scrollTo('catalog', {
          smooth: true,
          duration: 500,
          offset: -56,
        });
      }
    },
    [isMobile]
  );

  // Scroll to the bottom when courses finish loading on initial load.
  const [doneInitialScroll, setDoneInitialScroll] = useState(false);
  useEffect(() => {
    if (!coursesLoading && !doneInitialScroll) {
      scroll_to_results();
      setDoneInitialScroll(true);
    }
    console.log(searchData[0]);
  }, [coursesLoading, doneInitialScroll, scroll_to_results, searchData]);

  // Switch to grid view if window width changes < 900
  useEffect(() => {
    if (width < 768 && isList === true) setView(false);
  }, [width, isList, setView]);

  // TODO: add state if courseLoadError is present
  return (
    <div className={Styles.search_base}>
      <Row
        className={`p-0 m-0 ${
          !isMobile ? 'd-flex flex-row-reverse flex-nowrap' : ''
        }`}
      >
        {/* Search Results Catalog */}

        <Col
          md={collapsed_form ? 12 : 9}
          className={`m-0 ${
            isMobile
              ? `p-3 ${Styles.results_col_mobile}`
              : `px-0 pb-3 ${Styles.results_col}`
          }`}
        >
          <Element name="catalog" className="d-flex justify-content-center">
            <CatalogResults
              data={searchData}
              isList={isList}
              setView={handleSetView}
              loading={coursesLoading}
              multiSeasons={multiSeasons}
              showModal={showModal}
              isLoggedIn={isLoggedIn}
              expanded={collapsed_form}
              num_fb={num_fb}
            />
          </Element>
        </Col>
      </Row>
      {/* Course Modal */}
      <CourseModal
        hideModal={hideModal}
        show={course_modal[0]}
        listing={course_modal[1]}
      />
    </div>
  );
}

export default Search;
