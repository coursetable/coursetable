import clsx from 'clsx';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';
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
        <Tooltip id="button-tooltip" {...props}>
          <small>{buttonLabel}</small>
        </Tooltip>
      )}
    >
      <Button
        variant="toggle"
        onClick={async (e) => {
          // Prevent clicking hide button from opening course modal
          e.stopPropagation();
          await setCourseHidden({
            season: viewedSeason,
            worksheetNumber: viewedWorksheetNumber,
            crn,
            hidden: !hidden,
          });
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
