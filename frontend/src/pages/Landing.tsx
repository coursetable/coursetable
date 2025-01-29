import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  FcConferenceCall,
  FcComboChart,
  FcBookmark,
  FcSearch,
  FcIdea,
} from 'react-icons/fc';

import PWAPrompt from 'react-ios-pwa-prompt';
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
  const [shouldShowPWAPrompt, setShouldShowPWAPrompt] = useState(false);
  const [isIOSNotInstalled, setIsIOSNotInstalled] = useState(false);

  const isIOS = () => /iphone|ipad|ipod/iu.test(navigator.userAgent);

  const isPWAInstalled = () =>
    // Window.navigator.standalone ||
    window.matchMedia('(display-mode: standalone)').matches;

  useEffect(() => {
    if (isIOS() && !isPWAInstalled()) setIsIOSNotInstalled(true);
  }, []);

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
          {isIOSNotInstalled && (
            <div>
              <p>
                <FcIdea className="me-2 my-auto" /> Tip: see how to add
                CourseTable to your home screen as an app by{' '}
                <button
                  type="button"
                  onClick={() => setShouldShowPWAPrompt(true)}
                >
                  tapping here
                </button>
              </p>
              <PWAPrompt
                isShown={shouldShowPWAPrompt}
                appIconPath="/icon200x200.png"
                onClose={() => setShouldShowPWAPrompt(false)}
              />
            </div>
          )}
          <div className="d-flex mx-auto mt-3 justify-content-md-start justify-content-center">
            <a
              href={`${API_ENDPOINT}/api/auth/cas?redirect=${window.location.origin}/catalog`}
              className={clsx(styles.btn, styles.login, 'me-2')}
            >
              Login with CAS
            </a>
            <Link to="/about" className={clsx(styles.btn, styles.about)}>
              About us
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
