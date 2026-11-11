import clsx from 'clsx';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';
import { track } from '../../lib/track';
import { setCourseHidden } from '../../queries/api';
import type { Crn } from '../../queries/graphql-types';
import { useStore } from '../../store';
import styles from './WorksheetHideButton.module.css';

export default function WorksheetHideButton({
  hidden,
  crn,
  className,
  color,
  context = 'calendar',
}: {
  readonly hidden: boolean;
  readonly crn: Crn;
  readonly className?: string;
  readonly color?: string;
  readonly context?: 'calendar' | 'map';
}) {
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const {
    viewedSeason,
    viewedWorksheetNumber,
    viewedPerson,
    isReadonlyWorksheet,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      viewedPerson: state.viewedPerson,
      isReadonlyWorksheet: state.worksheetMemo.getIsReadonlyWorksheet(state),
    })),
  );
  if (isReadonlyWorksheet || viewedPerson !== 'me') return null;
  const buttonLabel =
    context === 'map'
      ? hidden
        ? 'Show on map'
        : 'Hide from map'
      : hidden
        ? 'Show in calendar'
        : 'Hide from calendar';
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={(props) => (
        <Tooltip id={`worksheet-hide-button-${crn}-tooltip`} {...props}>
          <small>{buttonLabel}</small>
        </Tooltip>
      )}
    >
      <Button
        variant="toggle"
        onClick={async (e) => {
          e.stopPropagation();
          const ok = await setCourseHidden({
            season: viewedSeason,
            worksheetNumber: viewedWorksheetNumber,
            crn,
            hidden: !hidden,
          });
          if (ok) {
            const { courses, worksheets } = useStore.getState();
            const courseCode =
              courses.find((c) => c.crn === crn)?.listing.course_code ??
              String(crn);
            const ws = worksheets
              ?.get(viewedSeason)
              ?.get(viewedWorksheetNumber);
            const worksheetName =
              ws?.name ??
              (viewedWorksheetNumber === 0
                ? 'Main Worksheet'
                : `Worksheet ${viewedWorksheetNumber}`);
            track('worksheet_hide', {
              course_code: courseCode,
              term: viewedSeason,
              worksheet_name: worksheetName,
              hidden: !hidden,
            });
          }
          await worksheetsRefresh();
        }}
        className={clsx(styles.toggleButton, className)}
        aria-label={buttonLabel}
      >
        {hidden ? (
          <BsEyeSlash color="var(--color-hidden)" size={18} />
        ) : (
          <BsEye color={color} size={18} />
        )}
      </Button>
    </OverlayTrigger>
  );
}
