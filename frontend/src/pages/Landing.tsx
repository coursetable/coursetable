import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  FcConferenceCall,
  FcComboChart,
  FcBookmark,
  FcSearch,
} from 'react-icons/fc';

import { API_ENDPOINT } from '../config';
import LandingImage from '../images/landing_page.svg';
import styles from './Landing.module.css';

const testimonials = [
  {
    text: "Thank you for making this website!! It's a life saver every semester.",
  },
  {
    text: 'I started off the semester with 80 courses in my course table! Thank you so much for your incredible website :)',
  },
  {
    text: 'Appreciate all that you do! Course table is a life saver',
  },
  {
    text: 'Thank you for making my life so much easier! Appreciate it immensely <3',
  },
  {
    text: 'This should not be free',
  },
  {
    text: 'CourseTable has been SOOOO helpful in helping me choose good classes over the years. I would been overwhelmed every semester without it.',
  },
  {
    text: 'Thank you for your service 🙏',
  },
  {
    text: 'U guys rock',
  },
  {
    text: 'I would pay 10 bucks a year for this service. Yale should pay you guys lol',
  },
];

function Landing() {
  return (
    <div className={styles.splashpage}>
      <div className={styles.topSection}>
        <div className={styles.content}>
          <h1 className="fw-bold text-md-left mb-4">
            The best place to shop for classes at Yale.
          </h1>
          <ul className={styles.featureList}>
            <li className={styles.featureText}>
              <FcSearch className="me-2 my-auto" size={20} />
              Browse our catalog of <span className={styles.stat}>
                80,000+
              </span>{' '}
              classes
            </li>
            <li className={styles.featureText}>
              <FcComboChart className="me-2 my-auto" size={20} />
              Read from <span className={styles.stat}>600,000+</span> student
              evaluation comments
            </li>
            <li className={styles.featureText}>
              <FcBookmark className="me-2 my-auto" size={20} />
              Save and view classes in your worksheet
            </li>
            <li className={styles.featureText}>
              <FcConferenceCall className="me-2 my-auto" size={20} />
              See what classes your friends are interested in
            </li>
          </ul>
          <div className="d-flex mx-auto mt-3 justify-content-md-start justify-content-center">
            <a
              href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`}
              className={clsx(styles.btn, styles.login, 'me-2')}
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
      <div className={styles.testimonialGrid}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.testimonialCard}>
            <p className={styles.testimonialText}>"{testimonial.text}"</p>
          </div>
        ))}
      </div>
      {/* Attribution Message */}
      <div className={styles.buyMeACoffeeAttribution}>
        <p>
          Testimonials sourced from{' '}
          <a
            href="https://www.buymeacoffee.com/coursetable"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Me A Coffee
          </a>
        </p>
      </div>
    </div>
  );
}

export default Landing;
