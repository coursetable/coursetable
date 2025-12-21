import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { useShallow } from 'zustand/react/shallow';
import { useWorksheetCalendarListContext } from './WorksheetCalendarListContext';
import WorksheetHideButton from './WorksheetHideButton';
import WorksheetToggleButton from './WorksheetToggleButton';
import type { CatalogListing } from '../../queries/api';
import { useStore } from '../../store';
import { toLocationsSummary } from '../../utilities/course';
import { useCourseModalLink } from '../../utilities/display';
import styles from './WorksheetCalendarListItem.module.css';

type WorksheetCalendarListItemProps = {
  readonly listing: CatalogListing;
  readonly hidden: boolean;
};

export default function WorksheetCalendarListItem({
  listing,
  hidden,
}: WorksheetCalendarListItemProps) {
  const {
    showLocation,
    showMissingLocationIcon,
    highlightBuilding,
    missingBuildingCodes,
    hideTooltipContext,
  } = useWorksheetCalendarListContext();
  const target = useCourseModalLink(listing);
  const setHoverCourse = useStore((state) => state.setHoverCourse);
  const locationSummary = toLocationsSummary(listing.course);
  const locationDisplay =
    locationSummary === 'TBA' ? 'Location: TBA' : locationSummary;
  const missingCoordinate =
    showMissingLocationIcon &&
    listing.course.course_meetings.some((meeting) => {
      const code = meeting.location?.building.code;
      return Boolean(code && missingBuildingCodes.has(code));
    });
  const isHighlighted =
    Boolean(highlightBuilding) &&
    listing.course.course_meetings.some(
      (meeting) => meeting.location?.building.code === highlightBuilding,
    );
  const missingLocation =
    !locationSummary ||
    locationSummary.toUpperCase() === 'TBA' ||
    missingCoordinate;

  const { viewedPerson } = useStore(
    useShallow((state) => ({
      viewedPerson: state.viewedPerson,
    })),
  );

  return (
    <ListGroup.Item
      className={clsx(
        styles.listItem,
        isHighlighted && styles.listItemHighlighted,
        'py-1',
        'px-2',
      )}
      onMouseEnter={() => setHoverCourse(listing.crn)}
      onMouseLeave={() => setHoverCourse(null)}
    >
      <Link
        to={target}
        className={clsx(
          styles.courseCode,
          hidden && styles.courseCodeHidden,
          'ps-1 pe-2',
        )}
      >
        <strong>{listing.course_code}</strong>
        <br />
        <span className={styles.courseTitle}>{listing.course.title}</span>
        {showLocation && (
          <span className={styles.courseLocation}>
            {locationDisplay}
            {showMissingLocationIcon && missingLocation && (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`location-warning-${listing.crn}`}>
                    {missingCoordinate
                      ? "We don't have map coordinates for this building yet."
                      : 'Location not yet available.'}
                  </Tooltip>
                }
              >
                <span className={styles.tbaIconWrapper}>
                  <BsExclamationTriangleFill
                    className={styles.tbaIcon}
                    size={13}
                  />
                </span>
              </OverlayTrigger>
            )}
          </span>
        )}
      </Link>
      <div className="d-flex align-items-center gap-1">
        {viewedPerson === 'me' && (
          <WorksheetHideButton
            crn={listing.crn}
            hidden={hidden}
            className={clsx(
              styles.hideButton,
              !hidden && styles.hideButtonHidden,
            )}
            context={hideTooltipContext}
          />
        )}
        <WorksheetToggleButton listing={listing} modal={false} />
      </div>
    </ListGroup.Item>
  );
}
