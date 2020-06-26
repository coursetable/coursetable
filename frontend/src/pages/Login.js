import React from 'react';

import styles from './Login.module.css';
import { Jumbotron, Button } from 'react-bootstrap';

function App() {
  return (
    <div className={styles.container}>
      <Jumbotron className={styles.coursetable_window}>
        <h1>
          Welcome to&nbsp;
            <span className={styles.coursetable_logo}>Course<span style={{ color: '#92bcea' }}>Table</span></span>
        </h1>
        <p>
          <b>CourseTable</b> was a course-data processor created by <b>Peter Xu (Yale MC '14) and Harry Yu (Yale SY '14)</b> and is continuing to be developed by <b>Yale Computer Society</b>. It helps you find the courses at Yale where you'll learn and enjoy the most.
        </p>
        <p>
          <Button href="/legacy_api/index.php?forcelogin=1" variant="primary">Login with Yale CAS</Button>
        </p>
      </Jumbotron >
    </div>
  );
}

export default App;
