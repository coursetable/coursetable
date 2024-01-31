import React from 'react';
import { Row } from 'react-bootstrap';
import clsx from 'clsx';
import styles from './RatingsGraph.module.css';
import { barChartColors } from '../../utilities/constants';
import { TextComponent } from '../Typography';

/**
 * Displays Evaluation Graphs
 * @prop ratings - list that holds the counts for each rating 1-5
 * @prop reverse - boolean of whether or not to reverse the colors
 * @prop labels - list that holds the x-axis labels for the grpah
 */

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
  // Loop through each rating to build the bar

  // Holds the bars
  const columns = ratings.map((rating, indx) => {
    // Calculate height of the bar
    const height = rating ? MIN_HEIGHT + (rating / maxVal) * 100 : 0;
    // Skip to last color if this is the yes/no question
    if (indx === 1 && ratings.length === 2) indx = 4;
    if (reverse) indx = barChartColors.length - 1 - indx;
    // Build bar
    return (
      <div key={labels[indx]} className={styles.bar}>
        {/* Number of votes for each rating */}
        <p className={clsx(styles.value, 'm-0')}>
          <TextComponent type="secondary">{rating}</TextComponent>
        </p>
        {/* Bar */}
        <div
          className={clsx(styles.column, 'px-1 mx-auto')}
          style={{
            backgroundColor: barChartColors[indx],
            height: `${height.toString()}px`,
          }}
        />
        {/* Rating labels */}
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
