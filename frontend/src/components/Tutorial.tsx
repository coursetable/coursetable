import React, { useCallback, useMemo } from 'react';
import Tour, { ReactourStep } from 'reactour';
import { useTheme } from 'styled-components';
import { Button } from 'react-bootstrap';

type Props = {
  isTutorialOpen: boolean;
  setIsTutorialOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShownTutorial: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Custom Tutorial component using react tour
 */

export const Tutorial: React.FC<Props> = ({
  isTutorialOpen,
  setIsTutorialOpen,
  setShownTutorial,
}) => {
  const globalTheme = useTheme();

  // Change react tour helper styling based on theme
  const helper_style: React.CSSProperties = useMemo(
    () => ({
      maxWidth: '380px',
      backgroundColor: globalTheme.background,
      color: globalTheme.text[0],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }),
    [globalTheme]
  );

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
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://coursetable.com/feedback"
          >
            <strong>Feedback page</strong>
          </a>{' '}
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

  return (
    <Tour
      steps={steps}
      isOpen={isTutorialOpen}
      onRequestClose={() => {
        setShownTutorial(true);
        setIsTutorialOpen(false);
      }}
      startAt={0}
      accentColor={globalTheme.primary}
      rounded={6}
      showCloseButton={false}
      closeWithMask={false}
      showNavigationNumber={false}
      lastStepNextButton={
        <Button style={{ backgroundColor: globalTheme.primary }}>
          Finish Tutorial
        </Button>
      }
    />
  );
};
