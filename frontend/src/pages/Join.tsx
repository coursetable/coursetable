import React from 'react';
import styles from './Join.module.css';
import { TextComponent } from '../components/StyledComponents';

/**
 * Renders the Join Us page
 */

const Join: React.VFC = () => {
  return (
    <div className={`${styles.container} mx-auto`}>
      <h1 className={`${styles.join_header} mt-5 mb-3`}>Join Us!</h1>
      <p className={`${styles.join_description} mb-5`}>
        <TextComponent type={1}>
          Email us at "coursetable [dot] at [dot] yale@gmail.com"
        </TextComponent>
      </p>
    </div>
  );
};

export default Join;
