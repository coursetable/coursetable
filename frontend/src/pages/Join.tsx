import clsx from 'clsx';
import { TextComponent } from '../components/Typography';
import styles from './Join.module.css';

function Join() {
  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      <h1 className={clsx(styles.joinHeader, 'mt-5 mb-3')}>Join Us!</h1>
      <p className={clsx(styles.joinDescription, 'mb-5')}>
        <TextComponent type="secondary">
          Current applications are closed :/ But we will be recruiting again in
          the spring!
        </TextComponent>
      </p>
      <p className={clsx(styles.joinDescription, 'mb-5')}>
        <TextComponent type="tertiary">
          CourseTable is open source, so feel free to contribute to our{' '}
          <a href="https://github.com/coursetable/coursetable">GitHub</a>! And{' '}
          <a href="mailto:coursetable.at.yale@gmail.com"> email us</a> if you
          have any questions.
        </TextComponent>
      </p>
    </div>
  );
}

export default Join;
