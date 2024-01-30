import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tour, { type ReactourStep, type ReactourStepPosition } from 'reactour';
import { Button } from 'react-bootstrap';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useTheme } from '../contexts/themeContext';
import styles from './Tutorial.module.css';
import './reactour-override.css';

type Props = {
  readonly isTutorialOpen: boolean;
  readonly setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
  readonly shownTutorial: boolean;
  readonly setShownTutorial: React.Dispatch<React.SetStateAction<boolean>>;
};

type Step = {
  selector: string;
  header: string;
  text: string | (() => JSX.Element);
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
    text: () => (
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
    text: () => (
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
    text: () => (
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
    text: () => (
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
    text: () => (
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
    text: () => (
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

function Tutorial({
  isTutorialOpen,
  setIsTutorialOpen,
  shownTutorial,
  setShownTutorial,
}: Props) {
  // Current step state
  const [currentStep, setCurrentStep] = useState(0);

  // Whenever the tutorial is closed, reset the currentStep
  useEffect(() => {
    if (!isTutorialOpen) setCurrentStep(0);
  }, [isTutorialOpen]);

  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Change react tour helper styling based on theme
  const helperStyle: React.CSSProperties = useMemo(() => {
    let styles: React.CSSProperties = {
      maxWidth: '432px',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    };
    if (shownTutorial) {
      styles = {
        ...styles,
        alignItems: 'center',
      };
    }
    return styles;
  }, [shownTutorial]);

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
          {typeof text === 'string' ? text : text()}
        </div>
      );

      return {
        selector: selector && `[data-tutorial="${selector}"]`,
        content,
        style: helperStyle,
        ...(observe && { observe: `[data-tutorial="${selector}-observe"]` }),
        ...(position && { position }),
      };
    },
  );

  // Handle prev button styling
  const prevButton = useMemo(() => {
    if (currentStep === 0) return <div style={{ display: 'none' }} />;
    if (!shownTutorial) {
      return (
        <Button
          className={styles.prevButton}
          style={{
            marginRight: '-40px',
          }}
          disabled={location.pathname === '/worksheet' && currentStep === 7}
        >
          Back
        </Button>
      );
    }
    return <Button className={styles.prevButton}>Back</Button>;
  }, [currentStep, shownTutorial, location]);

  // Next button component
  const nextButton = useMemo(() => {
    if (location.pathname === '/catalog' && currentStep === 7) {
      return (
        <Button className={styles.nextButton} disabled>
          Next
        </Button>
      );
    }
    return (
      <Button className={styles.nextButton}>
        {currentStep === 0 ? 'Start' : 'Next'}
      </Button>
    );
  }, [currentStep, location]);

  return (
    <Tour
      steps={steps}
      isOpen={isTutorialOpen}
      onRequestClose={() => {
        if (!shownTutorial) navigate('/catalog');

        setShownTutorial(true);
        setIsTutorialOpen(false);
      }}
      startAt={0}
      accentColor="var(--color-primary-hover)"
      rounded={6}
      showCloseButton
      disableDotsNavigation
      showNavigation={shownTutorial && currentStep !== 10}
      closeWithMask={shownTutorial}
      disableFocusLock
      showNavigationNumber={false}
      showNumber={false}
      nextButton={nextButton}
      prevButton={prevButton}
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
