import React from 'react';
import { Link } from 'react-router-dom';
import {
  FcConferenceCall,
  FcComboChart,
  FcBookmark,
  FcSearch,
} from 'react-icons/fc';
import clsx from 'clsx';

import { API_ENDPOINT } from '../config';
import styles from './Landing.module.css';
import LandingImage from '../images/landing_page.svg';

function Landing() {
  return (
    <div className={styles.splashpage}>
      <div className={styles.content}>
        <h1 className="font-weight-bold text-md-left mb-4">
          The best place to shop for classes at Yale.
        </h1>
        <ul className={styles.featureList}>
          <li className={styles.featureText}>
            <FcSearch className="mr-2 my-auto" size={20} />
            Browse our catalog of <span className={styles.stat}>
              80,000+
            </span>{' '}
            classes
          </li>
          <li className={styles.featureText}>
            <FcComboChart className="mr-2 my-auto" size={20} />
            Read from <span className={styles.stat}>600,000+</span> student
            evaluation comments
          </li>
          <li className={styles.featureText}>
            <FcBookmark className="mr-2 my-auto" size={20} />
            Save and view classes in your worksheet
          </li>
          <li className={styles.featureText}>
            <FcConferenceCall className="mr-2 my-auto" size={20} />
            See what classes your friends are interested in
          </li>
        </ul>
        <div className="d-flex mx-auto mt-3 justify-content-md-start justify-content-center">
          <a
            href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`}
            className={clsx(styles.btn, styles.login, 'mr-2')}
          >
            Login with CAS
          </a>
          <Link to="/about" className={clsx(styles.btn, styles.about)}>
            About Us
          </Link>
          <Link to="/catalog" className={clsx(styles.btn, styles.guest)}>
            Guest
          </Link>
        </div>
      </div>
      <img
        alt="Landing page"
        src={LandingImage}
        width={450}
        className={styles.thumbnail}
      />
    </div>
  );
}

export default Landing;
