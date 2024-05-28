import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Element } from 'react-scroll';
import clsx from 'clsx';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import styles from './Search.module.css';
import Results from '../components/Search/Results';
import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import './rc-slider-override.css';
import { useWishlist } from '../contexts/wishlistContext';

function Wishlist() {
  const { isMobile } = useWindowDimensions();
  const { courses, wishlistLoading, wishlistError } = useWishlist();

  // Scroll to the bottom when courses finish loading on initial load.
  const [doneInitialScroll, setDoneInitialScroll] = useState(false);
  useEffect(() => {
    if (!wishlistLoading && !wishlistError && !doneInitialScroll)
      setDoneInitialScroll(true);
  }, [wishlistLoading, wishlistError, doneInitialScroll]);

  // TODO: add state if courseLoadError is present
  return (
    <div className={styles.searchBase}>
      <Row
        className={clsx(
          'p-0 m-0',
          !isMobile && 'd-flex flex-row-reverse flex-nowrap',
        )}
      >
        {' '}
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
              wishlistData={courses}
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
