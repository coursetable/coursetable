import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearch } from '../../contexts/searchContext';
import { createCourseModalLink } from '../../utilities/display';
import styles from './RandomButton.module.css';

export default function RandomButton() {
  const [searchParams] = useSearchParams();
  const { searchData } = useSearch();
  const navigate = useNavigate();
  const fetchRandomCourse = () => {
    if (searchData && searchData.length > 0) {
      const randomCourse =
        searchData[Math.floor(Math.random() * searchData.length)];
      const courseModalLink = createCourseModalLink(randomCourse, searchParams);
      navigate(courseModalLink);
    }
  };

  return (
    <button
      type="button"
      className={styles.randomButton}
      onClick={fetchRandomCourse}
      disabled={!searchData || searchData.length === 0}
    >
      I'm feeling lucky
    </button>
  );
}
