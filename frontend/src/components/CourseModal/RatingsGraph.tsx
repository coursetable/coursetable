import clsx from 'clsx';
import { barChartColors } from '../../utilities/constants';
import { TextComponent } from '../Typography';
import styles from './RatingsGraph.module.css';

function RatingsGraph({
  ratings,
  reverse,
  labels,
  enrolled,
}: {
  readonly ratings: number[];
  readonly reverse: boolean;
  readonly labels: string[];
  readonly enrolled: number;
}) {
  const maxVal = Math.max(...ratings);

  // Set minimum bar height
  const MIN_HEIGHT = 15;
  // Loop through each rating to build the bar

  const totalRatings = ratings.reduce((acc, cur) => acc + cur, 0);
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
    <div className={styles.container}>
      <div className={styles.graph}>{columns}</div>
      <p>
        <TextComponent type="secondary">
          {totalRatings}/{enrolled} (
          {((totalRatings / enrolled) * 100).toFixed(1)}%) responses
        </TextComponent>
      </p>
    </div>
  );
}

export default RatingsGraph;
