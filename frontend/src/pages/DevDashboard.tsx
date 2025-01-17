import React from 'react';
import { SurfaceComponent, TextComponent } from '../components/Typography';
import styles from './DevDashboard.module.css';

function DevDashboard() {
  return (
    <div className={styles.container}>
      <SurfaceComponent className="p-5 rounded shadow">
        <h1 className="mb-4">Developer Dashboard</h1>
        <TextComponent type="secondary">
          Welcome to the Developer Dashboard! Here you can monitor system
          metrics, manage deployments, and access development tools.
        </TextComponent>
        {/* Add more developer tools and information here */}
      </SurfaceComponent>
    </div>
  );
}

export default DevDashboard;
