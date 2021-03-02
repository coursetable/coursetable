import React, { useCallback, useMemo } from 'react';
import Tour, { ReactourStep } from 'reactour';
import { useTheme } from 'styled-components';
import { Button } from 'react-bootstrap';

type Props = {
  isTourOpen: boolean;
  setIsTourOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Custom React Tour component
 */

export const CustomTour: React.FC<Props> = ({ isTourOpen, setIsTourOpen }) => {
  const globalTheme = useTheme();

  // Change react tour helper styling based on theme
  const helper_style: React.CSSProperties = useMemo(
    () => ({
      maxWidth: '356px',
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
      content: 'Welcome to CourseTable!',
      style: helper_style,
    },
    {
      selector: '[data-tour="catalog-1"]',
      content: 'You can search and filter courses in the navbar.',
      style: helper_style,
    },
    {
      selector: '[data-tour="catalog-2"]',
      content:
        'Click on a filter to show a dropdown where you can select multiple options.',
      style: helper_style,
      observe: '[data-tour="catalog-2-observe"]',
      action: focusElement,
    },
    {
      selector: '[data-tour="catalog-3"]',
      content: 'Slide the range handles to filter by a range of values.',
      style: helper_style,
    },
    {
      selector: '[data-tour="catalog-4"]',
      content: () => (
        <div>
          Click on <strong>Advanced</strong> to see more advanced filters.
        </div>
      ),
      style: helper_style,
      observe: '[data-tour="catalog-4-observe"]',
      action: focusElement,
    },
    {
      selector: '[data-tour="catalog-5"]',
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
          That's it! Click <strong>Finish Tour</strong> to start using
          CourseTable!
        </div>
      ),
      style: helper_style,
    },
  ];

  return (
    <Tour
      steps={steps}
      isOpen={isTourOpen}
      onRequestClose={() => setIsTourOpen(false)}
      accentColor={globalTheme.primary}
      rounded={6}
      showCloseButton={false}
      closeWithMask={false}
      showNavigationNumber={false}
      lastStepNextButton={<Button>Finish Tour</Button>}
    />
  );
};
