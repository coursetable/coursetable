import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Tour, { ReactourStep, ReactourStepPosition } from 'reactour';
import styled, { useTheme } from 'styled-components';
import { Button } from 'react-bootstrap';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

// Next button for tutorial
const NextButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary_hover};
  border-color: transparent !important;
  box-shadow: none !important;
  font-size: 14px;

  &:focus {
    background-color: ${({ theme }) => theme.primary_hover};
  }
`;

// Back button for tutorial
const PrevButton = styled(Button)`
  background-color: transparent;
  border-color: transparent !important;
  color: ${({ theme }) => theme.text[2]} !important;
  box-shadow: none !important;
  font-size: 14px;

  &:hover {
    background-color: ${({ theme }) => theme.button_active};
  }
  &:active {
    background-color: ${({ theme }) => theme.button_active} !important;
  }
  &:focus {
    background-color: transparent;
  }
`;

// Step content in helper
const StepContent = styled.div`
  font-size: 14px;
  margin-bottom: 1rem;
`;

// Step video
const StepVideo = styled.video`
  width: 116% !important;
  margin-left: -30px;
  margin-top: -24px;
  margin-bottom: 20px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

// Step image
const StepImage = styled.img`
  width: 100% !important;
  margin-bottom: 20px;
`;

type Props = {
  isTutorialOpen: boolean;
  setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shownTutorial: boolean;
  setShownTutorial: React.Dispatch<React.SetStateAction<boolean>>;
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
    text:
      'Click on a filter to pop out a dropdown where you can select multiple options.',
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
    header: '🔍 Control how you see possibilities',
    text:
      'Click on a column toggle to sort by that column (ascending/descending).',
    video: true,
  },
  {
    selector: '',
    header: '📢 We gotchu fam',
    text: () => (
      <>
        If you have any problems, you can leave feedback on our{' '}
        <Link target="_blank" rel="noopener noreferrer" to="/feedback">
          <strong>Feedback page</strong>
        </Link>
        .
      </>
    ),
    image: 'feedback',
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

export const Tutorial: React.FC<Props> = ({
  isTutorialOpen,
  setIsTutorialOpen,
  shownTutorial,
  setShownTutorial,
}) => {
  // Current step state
  const [currentStep, setCurrentStep] = useState(0);

  // Whenever the tutorial is closed, reset the currentStep
  useEffect(() => {
    if (!isTutorialOpen) {
      setCurrentStep(0);
    }
  }, [isTutorialOpen]);

  const globalTheme = useTheme();

  // Change react tour helper styling based on theme
  const helper_style: React.CSSProperties = useMemo(() => {
    let styles: React.CSSProperties = {
      maxWidth: '380px',
      backgroundColor: globalTheme.background,
      color: globalTheme.text[0],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    };
    if (shownTutorial) {
      styles = {
        ...styles,
        maxWidth: '432px',
        alignItems: 'center',
      };
    }
    return styles;
  }, [globalTheme, shownTutorial]);

  // Focus element callback
  const focusElement = useCallback((node) => {
    node.focus();
  }, []);

  // Generate react tour steps
  const steps: ReactourStep[] = stepsContent.map(
    ({ selector, header, text, observe, video, image, position }) => {
      // Create step content
      const content = () => (
        <StepContent>
          {image && (
            <StepImage
              src={`./images/${image}-${globalTheme.theme}.png`}
              alt={image}
              height="362"
            />
          )}
          {video && (
            <StepVideo autoPlay loop key={selector}>
              <source src={`./videos/${selector}.mp4`} type="video/mp4" />
            </StepVideo>
          )}
          <h6 className="mt-2">{header}</h6>
          {typeof text === 'string' ? text : text()}
        </StepContent>
      );

      // Create step object
      let step: ReactourStep = {
        selector: selector && `[data-tutorial="${selector}"]`,
        content,
        style: helper_style,
      };

      // Add observe selector and action if observing
      if (observe) {
        const observe_selector = `[data-tutorial="${selector}-observe"]`;
        step = { ...step, observe: observe_selector, action: focusElement };
      }

      if (position) {
        step = { ...step, position };
      }

      return step;
    }
  );

  // Handle prev button styling
  const prevButton = useMemo(() => {
    if (currentStep === 0) {
      return <div style={{ display: 'none' }} />;
    }
    if (!shownTutorial) {
      return (
        <PrevButton
          style={{
            marginRight: '-40px',
          }}
        >
          Back
        </PrevButton>
      );
    }
    return <PrevButton>Back</PrevButton>;
  }, [currentStep, shownTutorial]);

  // Disable/enable body scroll callbacks
  const disableBody = useCallback((target) => disableBodyScroll(target), []);
  const enableBody = useCallback((target) => enableBodyScroll(target), []);

  return (
    <Tour
      steps={steps}
      isOpen={isTutorialOpen}
      onRequestClose={() => {
        setShownTutorial(true);
        setIsTutorialOpen(false);
      }}
      startAt={0}
      accentColor={globalTheme.primary_hover}
      rounded={6}
      showCloseButton={false}
      disableDotsNavigation={!shownTutorial}
      showNavigation={shownTutorial}
      closeWithMask={shownTutorial}
      disableFocusLock
      showNavigationNumber={false}
      showNumber={false}
      nextButton={
        <NextButton>{currentStep === 0 ? 'Start' : 'Next'}</NextButton>
      }
      prevButton={prevButton}
      lastStepNextButton={<NextButton>Finish Tutorial</NextButton>}
      getCurrentStep={(curr) => setCurrentStep(curr)}
      disableKeyboardNavigation={['esc']}
      onAfterOpen={disableBody}
      onBeforeClose={enableBody}
    />
  );
};
