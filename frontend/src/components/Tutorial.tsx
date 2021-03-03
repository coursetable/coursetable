import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Tour, { ReactourStep } from 'reactour';
import styled, { useTheme } from 'styled-components';
import { Button } from 'react-bootstrap';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

// Next button for tutorial
const NextButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary_hover};
  border-color: transparent !important;
  box-shadow: none !important;
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

type Props = {
  isTutorialOpen: boolean;
  setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
  shownTutorial: boolean;
  setShownTutorial: React.Dispatch<React.SetStateAction<boolean>>;
};

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
        paddingRight: '40px',
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

  // React tour steps
  const steps: ReactourStep[] = [
    {
      selector: '',
      content:
        'Welcome to CourseTable! This tutorial will teach you the basics of using the new catalog.',
      style: helper_style,
    },
    {
      selector: '[data-tutorial="catalog-1"]',
      content: 'You can search and filter courses in the navbar.',
      style: helper_style,
    },
    {
      selector: '[data-tutorial="catalog-2"]',
      content:
        'Click on a filter to show a dropdown where you can select multiple options.',
      style: helper_style,
      observe: '[data-tutorial="catalog-2-observe"]',
      action: focusElement,
    },
    {
      selector: '[data-tutorial="catalog-3"]',
      content: 'Slide the range handles to filter by a range of values.',
      style: helper_style,
    },
    {
      selector: '[data-tutorial="catalog-4"]',
      content: () => (
        <div>
          Click on <strong>Advanced</strong> to see more advanced filters.
        </div>
      ),
      style: helper_style,
      observe: '[data-tutorial="catalog-4-observe"]',
      action: focusElement,
    },
    {
      selector: '[data-tutorial="catalog-5"]',
      content:
        'Click on a column toggle to sort by that column (ascending/descending).',
      style: helper_style,
    },
    {
      selector: '',
      content: () => (
        <div>
          If you have any problems, you can leave feedback on our{' '}
          <Link target="_blank" rel="noopener noreferrer" to="/feedback">
            <strong>Feedback page</strong>
          </Link>
          .
        </div>
      ),
      style: helper_style,
    },
    {
      selector: '',
      content: () => (
        <div>
          That's it! Click <strong>Finish Tutorial</strong> to start using
          CourseTable!
        </div>
      ),
      style: helper_style,
    },
  ];

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
      showCloseButton={shownTutorial}
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
