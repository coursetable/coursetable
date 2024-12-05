import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';
import styles from './ProfessorControlsRow.module.css';

type Tab = {
  readonly label: string;
  readonly value: 'overview' | 'evals';
  readonly disabled?: boolean;
};

function ViewTabs({
  currentTab,
  tabs,
  onSelectTab,
}: {
  readonly currentTab: Tab['value'];
  readonly tabs: Tab[];
  readonly onSelectTab: (value: Tab['value']) => void;
}) {
  return (
    <div className={styles.tabs}>
      {tabs.map(({ label, value, disabled }) => {
        if (disabled) {
          return (
            <OverlayTrigger
              key={value}
              placement="top"
              overlay={(props) => (
                <Tooltip {...props} id="popover-disabled-tab">
                  This course has no evaluations to show.
                </Tooltip>
              )}
            >
              <span className={clsx(styles.tabButton, styles.tabDisabled)}>
                {label}
              </span>
            </OverlayTrigger>
          );
        }
        return (
          <button
            key={value}
            aria-current={currentTab === value}
            type="button"
            onClick={() => onSelectTab(value)}
            className={clsx(
              styles.tabButton,
              currentTab === value && styles.tabSelected,
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function ProfessorModalHeaderControls({
  listing,
  view,
  setView,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
  readonly view: 'overview' | 'evals';
  readonly setView: (value: 'overview' | 'evals') => void;
  readonly hide: () => void;
}) {
  return (
    <div className={styles.modalControls}>
      <ViewTabs
        tabs={[
          { label: 'Overview', value: 'overview' },
          {
            label: 'Evaluations',
            value: 'evals',
            // Don't show eval tab if there are no responses to show
            disabled: !listing.course.evaluation_statistic,
          },
        ]}
        onSelectTab={setView}
        currentTab={view}
      />
      <div className={styles.toolBar}>
        {/* <WorksheetToggleButton listing={listing} modal />
        <ShareButton listing={listing} />
        <MoreButton listing={listing} hide={hide} /> */}
      </div>
    </div>
  );
}
