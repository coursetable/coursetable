import React from 'react';
import clsx from 'clsx';
import styles from './Join.module.css';
import { TextComponent } from '../components/StyledComponents';

function Join() {
  return (
    <div className={clsx(styles.container, 'mx-auto')}>
      <h1 className={clsx(styles.join_header, 'mt-5 mb-3')}>Join Us!</h1>
      <p className={clsx(styles.join_description, 'mb-5')}>
        <TextComponent type={1}>
          Current applications are closed :/ But we will be recruiting again in
          the spring!
        </TextComponent>
      </p>
      <p className={clsx(styles.join_description, 'mb-5')}>
        <TextComponent type={2}>
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
