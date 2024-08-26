import clsx from 'clsx';
import { TextComponent } from '../components/Typography';
import styles from './Join.module.css';

function Join() {
  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      <h1 className={clsx(styles.joinHeader, 'mt-5 mb-3')}>Join Us!</h1>
      <p className={clsx(styles.joinDescription, 'mb-5')}>
        <TextComponent type="secondary">
          Our application process will be opening soon for the fall! Stay tuned
          for updates.
        </TextComponent>
      </p>
      <p className={clsx(styles.joinDescription, 'mb-5')}>
        <TextComponent type="tertiary">
          CourseTable is open source, so feel free to contribute to our{' '}
          <a href="https://github.com/coursetable/coursetable">GitHub</a>! If
          you have any questions, don't hesitate to{' '}
          <a href="mailto:coursetable.at.yale@gmail.com">email us</a>.
        </TextComponent>
      </p>
    </div>
  );
}

export default Join;
