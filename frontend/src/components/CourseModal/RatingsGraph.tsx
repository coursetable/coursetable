import React from 'react';
import { Row } from 'react-bootstrap';
import clsx from 'clsx';
import styles from './RatingsGraph.module.css';
import { barChartColors } from '../../utilities/constants';
import { TextComponent } from '../Typography';

function RatingsGraph({
  ratings,
  reverse,
  labels,
}: {
  readonly ratings: number[];
  readonly reverse: boolean;
  readonly labels: string[];
}) {
  const maxVal = Math.max(...ratings);

  // Set minimum bar height
  const MIN_HEIGHT = 15;

  // Holds the bars
  const columns = ratings.map((rating, indx) => {
    // Calculate height of the bar
    const height = rating ? MIN_HEIGHT + (rating / maxVal) * 100 : 0;
    // Skip to last color if this is the yes/no question
    if (indx === 1 && ratings.length === 2) indx = 4;
    // Build bar
    return (
      <div key={labels[indx]} className={styles.bar}>
        <p className={clsx(styles.value, 'm-0')}>
          <TextComponent type="secondary">{rating}</TextComponent>
        </p>
        <div
          className={clsx(styles.column, 'px-1 mx-auto')}
          style={{
            backgroundColor:
              barChartColors[reverse ? barChartColors.length - 1 - indx : indx],
            height: `${height.toString()}px`,
          }}
        />
        {ratings.length === 2 && (
          <p className={clsx(styles.label, styles.value, 'm-0')}>
            {indx === 0 ? 'yes' : 'no'}
          </p>
        )}
        {ratings.length === 5 && (
          <p className={clsx(styles.label, styles.value, 'm-0')}>
            <span className="d-none d-sm-block">{labels[indx]}</span>
            <span className="d-sm-none">{indx + 1}</span>
          </p>
        )}
      </div>
    );
  });

  return (
    <Row
      className={clsx(
        styles.container,
        'mx-auto px-3 mb-5 justify-content-center align-items-end',
      )}
    >
      {columns}
    </Row>
  );
}

export default RatingsGraph;
