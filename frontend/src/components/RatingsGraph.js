import React from 'react';
import { Row } from 'react-bootstrap';
import styles from './RatingsGraph.module.css';

const RatingsGraph = (props) => {
  const ratings = props.ratings;

  let max_val = 1;
  ratings.forEach((rating) => {
    max_val = Math.max(rating, max_val);
  });

  const colors = ['#f54242', '#f5a142', '#f5f542', '#aeed1a', '#00e800'];
  if (props.reverse) colors.reverse();

  let columns = [];
  let indx = 0;
  const MIN_HEIGHT = 15;
  ratings.forEach((rating) => {
    const height = rating ? MIN_HEIGHT + (rating / max_val) * 100 : 0;
    if (indx === 1 && ratings.length === 2) indx = 4;
    columns.push(
      <div key={indx} className={styles.bar}>
        <p className={styles.value + ' m-0 '}>{rating}</p>
        <div
          className={styles.column + ' px-1 mx-3'}
          style={{
            backgroundColor: colors[indx],
            height: height.toString() + 'px',
          }}
        />
        {ratings.length === 2 && (
          <p className={styles.value + ' m-0 ' + styles.xaxis_label}>
            {indx === 0 ? 'yes' : 'no'}
          </p>
        )}
        {ratings.length === 5 && (
          <p className={styles.value + ' m-0 ' + styles.xaxis_label}>
            {indx + 1}
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
    >
      {columns}
    </Row>
  );
};

export default RatingsGraph;
