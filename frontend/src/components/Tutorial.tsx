import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Tour, { type ReactourStep, type ReactourStepPosition } from 'reactour';
import { Button } from 'react-bootstrap';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useTheme } from '../contexts/themeContext';
import { useTutorial } from '../contexts/tutorialContext';
import styles from './Tutorial.module.css';
import './reactour-override.css';

type Step = {
  selector: string;
  header: string;
  text: React.ReactNode;
  observe?: boolean;
  video?: boolean;
  image?: string;
  position?: ReactourStepPosition;
};

// Steps content
const stepsContent: Step[] = [
  {
    selector: '',
    header: '📘 Welcome to CourseTable! 📘',
    text: 'This tutorial will teach you the basics of using the new catalog.',
    image: 'enter',
  },
  {
    selector: 'catalog-1',
    header: '🗺️ Explore all the courses offered at Yale',
    text: 'Search and filter courses in the navbar at the top.',
    video: true,
  },
  {
    selector: 'catalog-2',
    header: '🎯 Filter for exactly what you want',
    text: 'Click on a filter to pop out a dropdown where you can select multiple options.',
    observe: true,
    video: true,
  },
  {
    selector: 'catalog-3',
    header: '💪 Don’t work hard to find good courses',
    text: 'Slide the range handles to filter by a range of values.',
    video: true,
  },
  {
    selector: 'catalog-4',
    header: '🌠 Take it to the next level',
    text: (
      <>
        Click on <strong>Advanced</strong> to see more advanced filters.
      </>
    ),
    observe: true,
    video: true,
    position: 'bottom',
  },
  {
    selector: 'catalog-5',
    header: '🔍 Control how you see the possibilities',
    text: 'Click on a column toggle to sort by that column (ascending/descending).',
    video: true,
  },
  {
    selector: 'catalog-6',
    header: '💾 Save courses you’re interested in',
    text: (
      <>
        Click on the <strong>+</strong> button next to a course to add it to
        your Worksheet.
      </>
    ),
    video: true,
  },
  {
    selector: 'worksheet-1',
    header: '👀 View your saved courses',
    text: (
      <>
        Click on <strong>Worksheet</strong> to see all the courses you’ve saved.
        <br />
        (Click <strong>Worksheet</strong> above to go to the next step.)
      </>
    ),
    video: true,
    position: 'bottom',
  },
  {
    selector: 'worksheet-2',
    header: '📅 Change how you see your Worksheet',
    text: (
      <>
        Click on <strong>Calendar</strong> to see your courses on a calendar and{' '}
        <strong>List</strong> to see your courses in a list.
      </>
    ),
    video: true,
    position: 'bottom',
  },
  {
    selector: 'feedback',
    header: '📢 We gotchu fam',
    text: (
      <>
        If you have any problems or new ideas, you can leave feedback on our{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://feedback.coursetable.com/"
        >
          <strong>Feedback page</strong>
        </a>
        .
      </>
    ),
    video: true,
  },
  {
    selector: '',
    header: "🎉 That's it! 🎉",
    text: (
      <>
        That's it! Click <strong>Finish Tutorial</strong> to start using
        CourseTable!
      </>
    ),
    image: 'finish',
  },
];

/**
 * Custom Tutorial component using react tour
 */

function Tutorial() {
  const { isTutorialOpen, toggleTutorial } = useTutorial();
  // Current step state
  const [currentStep, setCurrentStep] = useState(0);

  // Whenever the tutorial is closed, reset the currentStep
  useEffect(() => {
    if (!isTutorialOpen) setCurrentStep(0);
  }, [isTutorialOpen]);

  const { theme } = useTheme();
  const location = useLocation();

  // Generate react tour steps
  const steps = stepsContent.map(
    ({
      selector,
      header,
      text,
      observe,
      video,
      image,
      position,
    }): ReactourStep => {
      // Create step content
      const content = () => (
        <div className={styles.stepContent}>
          {image && (
            <img
              className={styles.stepImage}
              src={`./images/${image}-${theme}.png`}
              alt={image}
              height="362"
            />
          )}
          {video && (
            // TODO
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              className={styles.stepVideo}
              autoPlay
              loop
              key={selector}
              width="116%"
              height="270"
            >
              <source src={`./videos/${selector}.mp4`} type="video/mp4" />
            </video>
          )}
          <h6 className="mt-2">{header}</h6>
          {text}
        </div>
      );

      return {
        selector: selector && `[data-tutorial="${selector}"]`,
        content,
        style: {
          maxWidth: '432px',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        },
        ...(observe && { observe: `[data-tutorial="${selector}-observe"]` }),
        ...(position && { position }),
      };
    },
  );

  return (
    <Tour
      steps={steps}
      isOpen={isTutorialOpen}
      onRequestClose={() => {
        toggleTutorial(false);
      }}
      startAt={0}
      accentColor="var(--color-primary-hover)"
      rounded={6}
      showCloseButton
      disableDotsNavigation
      showNavigation={false}
      closeWithMask={false}
      disableFocusLock
      showNavigationNumber={false}
      showNumber={false}
      nextButton={
        <Button
          className={styles.nextButton}
          disabled={location.pathname === '/catalog' && currentStep === 7}
        >
          {currentStep === 0 ? 'Start' : 'Next'}
        </Button>
      }
      prevButton={
        currentStep === 0 ? null : (
          <Button
            className={styles.prevButton}
            style={{
              marginRight: '-40px',
            }}
            disabled={location.pathname === '/worksheet' && currentStep === 7}
          >
            Back
          </Button>
        )
      }
      lastStepNextButton={
        <Button className={styles.nextButton}>Finish Tutorial</Button>
      }
      getCurrentStep={(curr) => setCurrentStep(curr)}
      disableKeyboardNavigation={['esc']}
      onAfterOpen={disableBodyScroll}
      onBeforeClose={enableBodyScroll}
    />
  );
}

export default Tutorial;
