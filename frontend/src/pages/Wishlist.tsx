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
import './rc-slider-override.css';
import { useWishlist } from '../contexts/wishlistContext';

function Wishlist() {
  const { isMobile } = useWindowDimensions();
  const { courses, wishlistLoading, wishlistError } = useWishlist();

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
    if (!wishlistLoading && !wishlistError && !doneInitialScroll) {
      scrollToResults();
      setDoneInitialScroll(true);
    }
  }, [wishlistLoading, wishlistError, doneInitialScroll, scrollToResults]);

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
        <Col
          md={12}
          className={clsx(
            'm-0',
            styles.resultsCol,
            isMobile ? 'p-3' : 'px-0 pb-3',
          )}
        >
          <Element name="catalog" className="d-flex justify-content-center">
            <Results
              data={courses.flatMap((course) => course.upcomingListings.flat())}
              loading={wishlistLoading}
              multiSeasons
              page="wishlist"
            />
          </Element>
        </Col>
      </Row>
    </div>
  );
}

export default Wishlist;
