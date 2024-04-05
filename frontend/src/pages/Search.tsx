import React from 'react';
import { Element } from 'react-scroll';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

import styles from './Search.module.css';
import MobileSearchForm from '../components/Search/MobileSearchForm';
import Results from '../components/Search/Results';
import { useWindowDimensions } from '../contexts/windowDimensionsContext';
import { useSearch } from '../contexts/searchContext';
import './rc-slider-override.css';

function Search() {
  const { isMobile } = useWindowDimensions();
  const { coursesLoading, searchData, multiSeasons } = useSearch();

  // TODO: add state if courseLoadError is present
  return (
    <div className={styles.searchBase}>
      {isMobile && <MobileSearchForm />}
      <div className={styles.resultsCol}>
        <Element name="catalog" className="d-flex justify-content-center">
          <Results
            data={searchData}
            loading={coursesLoading}
            multiSeasons={multiSeasons}
          />
        </Element>
      </div>
    </div>
  );
}

export default Search;
