import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Element, scroller } from 'react-scroll';
import clsx from 'clsx';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import styles from './Search.module.css';
import MobileSearchForm from '../components/Search/MobileSearchForm';
import Results from '../components/Search/Results';
import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import { useSearch } from '../contexts/searchContext';
import './rc-slider-override.css';

function Search() {
  // Fetch current device
  const { isMobile } = useWindowDimensions();

  // Get search context data
  const { coursesLoading, searchData, multiSeasons } = useSearch();

  const scrollToResults = useCallback(
    (event?: React.FormEvent) => {
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
    [isMobile],
  );

  // Scroll to the bottom when courses finish loading on initial load.
  const [doneInitialScroll, setDoneInitialScroll] = useState(false);
  useEffect(() => {
    if (!coursesLoading && !doneInitialScroll) {
      scrollToResults();
      setDoneInitialScroll(true);
    }
  }, [coursesLoading, doneInitialScroll, scrollToResults]);

  // TODO: add state if courseLoadError is present
  return (
    <div className={styles.searchBase}>
      <Row
        className={clsx(
          'p-0 m-0',
          !isMobile && 'd-flex flex-row-reverse flex-nowrap',
        )}
      >
        {isMobile && <MobileSearchForm onSubmit={scrollToResults} />}

        {/* Catalog Search Search */}
        <Col
          md={12}
          className={clsx(
            'm-0',
            isMobile
              ? ['p-3', styles.resultsCol]
              : ['px-0 pb-3', styles.resultsCol],
          )}
        >
          <Element name="catalog" className="d-flex justify-content-center">
            <Results
              data={searchData}
              loading={coursesLoading}
              multiSeasons={multiSeasons}
            />
          </Element>
        </Col>
      </Row>
    </div>
  );
}

export default Search;
