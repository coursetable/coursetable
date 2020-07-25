import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import styles from './RatingsGraph.module.css';

const RatingsGraph = (props) => {
  const ratings = props.ratings;
  const [show, setShow] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  let max_val = 0;
  ratings.forEach((rating) => {
    max_val = Math.max(rating, max_val);
  });

  const colors = ['#f54242', '#f5a142', '#f5f542', '#aeed1a', '#00e800'];
  if (props.reverse) colors.reverse();

  let columns = [];
  let indx = 0;
  ratings.forEach((rating) => {
    const height = 15 + (rating / max_val) * 100;
    if (indx === 1 && ratings.length === 2) indx = 4;
    columns.push(
      <div key={indx} className={styles.bar}>
        <p
          className={
            styles.value +
            ' m-0 ' +
            (!isMobile
              ? show
                ? styles.fadeIn
                : styles.fadeOut
              : styles.fadeIn)
          }
        >
          {rating}
        </p>
        <div
          className={styles.column + ' px-1 mx-3'}
          style={{
            backgroundColor: colors[indx],
            height: height.toString() + 'px',
          }}
        />
        {ratings.length === 2 && (
          <p
            className={
              styles.value +
              ' m-0 ' +
              (!isMobile
                ? show
                  ? styles.fadeIn
                  : styles.fadeOut
                : styles.fadeIn)
            }
          >
            {indx === 0 ? 'yes' : 'no'}
          </p>
        )}
      </div>
    );
    indx++;
  });

  return (
    <Row
      className={
        styles.container +
        ' mx-auto pl-3 pr-3 mb-4 justify-content-center align-items-end'
      }
      onMouseEnter={() => setShow(!show)}
      onMouseLeave={() => setShow(!show)}
    >
      {columns}
    </Row>
  );
};

export default RatingsGraph;
