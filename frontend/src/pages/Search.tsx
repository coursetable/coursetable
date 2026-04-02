import { Element } from 'react-scroll';
import 'rc-slider/assets/index.css';

import MobileSearchForm from '../components/Search/MobileSearchForm';
import Results from '../components/Search/Results';
import { useSearch } from '../contexts/searchContext';
import { useStore } from '../store';
import styles from './Search.module.css';
import './rc-slider-override.css';

function Search() {
  const isMobile = useStore((state) => state.isMobile);
  const { coursesLoading, searchData, multiSeasons } = useSearch();

  // TODO: add state if courseLoadError is present
  return (
    <div className={styles.searchBase}>
      {isMobile && <MobileSearchForm />}
      <Element name="catalog" className="d-flex justify-content-center">
        <Results
          data={searchData}
          loading={coursesLoading}
          multiSeasons={multiSeasons}
        />
      </Element>
    </div>
  );
}

export default Search;
