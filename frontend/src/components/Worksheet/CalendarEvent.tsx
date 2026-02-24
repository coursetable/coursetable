import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { Modal } from 'react-bootstrap';
import { BsExclamationTriangleFill } from 'react-icons/bs';
import { FaWalking } from 'react-icons/fa';
import chroma from 'chroma-js';
import LinesEllipsis from 'react-lines-ellipsis';
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC';
import WorksheetHideButton from './WorksheetHideButton';
import WorksheetItemActionsButton from './WorksheetItemActionsButton';
import { useStore } from '../../store';
import type { CourseRBCEvent, WalkBefore } from '../../utilities/calendar';
import styles from './CalendarEvent.module.css';

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
});
const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
});
export type WalkModalInteraction = 'press' | 'open' | 'close';

function formatMeetingTime(start: Date, end: Date) {
  return `${weekdayFormatter.format(start)}, ${timeFormatter.format(start)}-${timeFormatter.format(end)}`;
}

function formatMinutes(minutes: number) {
  const rounded = Math.max(0, Math.round(minutes));
  return `${rounded} minute${rounded === 1 ? '' : 's'}`;
}

export function CalendarEventBody({
  event,
  onWalkModalInteraction,
}: {
  readonly event: CourseRBCEvent;
  readonly onWalkModalInteraction?: (interaction: WalkModalInteraction) => void;
}) {
  const { walkBefore } = event;
  const walkBaseColor = chroma(event.color);
  const textColor =
    chroma.contrast(event.color, 'white') > 2 ? 'white' : 'black';
  const walkColor = walkBaseColor.css();
  const connectorOffset = 4;
  const eventRef = useRef<HTMLDivElement | null>(null);
  const walkBadgeRef = useRef<HTMLButtonElement | null>(null);
  const [connectorHeight, setConnectorHeight] = useState<number | null>(null);
  const [walkBadgeTop, setWalkBadgeTop] = useState(0);
  const [isWalkModalOpen, setIsWalkModalOpen] = useState(false);

  const isMobile = useStore((state) => state.isMobile);
  const hoverCourse = useStore((state) => state.hoverCourse);
  const isCalendarViewLocked = useStore((state) => state.isCalendarViewLocked);
  const calendarLockStart = useStore((state) => state.calendarLockStart);
  const calendarLockEnd = useStore((state) => state.calendarLockEnd);

  // This splits the title into separate lines for mobile!
  const formattedTitle = isMobile
    ? event.title.split(' ').map((word, index) => (
        <React.Fragment key={index}>
          {word}
          {index < event.title.split(' ').length - 1 && <br />}
        </React.Fragment>
      ))
    : event.title;

  const lastMod = event.listing.course.last_updated as string | undefined;

  useLayoutEffect(() => {
    if (!walkBefore) {
      setConnectorHeight(null);
      setWalkBadgeTop(0);
      return undefined;
    }
    const node = eventRef.current;
    if (!node) return undefined;
    const durationMinutes = Math.max(
      1,
      (event.end.getTime() - event.start.getTime()) / 60000,
    );
    const { gapMinutes } = walkBefore;
    const updateConnector = () => {
      let gapPx = 0;
      const eventNode = node.closest('.rbc-event');
      const daySlotNode = node.closest('.rbc-day-slot');
      const eventHeightPercent =
        eventNode instanceof HTMLElement
          ? Number.parseFloat(eventNode.style.height)
          : Number.NaN;
      const eventTopPercent =
        eventNode instanceof HTMLElement
          ? Number.parseFloat(eventNode.style.top)
          : Number.NaN;
      if (
        daySlotNode instanceof HTMLElement &&
        Number.isFinite(eventHeightPercent) &&
        eventHeightPercent > 0
      ) {
        const daySlotHeight = daySlotNode.getBoundingClientRect().height;
        const gapPercent = (gapMinutes / durationMinutes) * eventHeightPercent;
        if (Number.isFinite(daySlotHeight) && daySlotHeight > 0) {
          gapPx = (daySlotHeight * gapPercent) / 100;
          if (Number.isFinite(eventTopPercent)) {
            // Never draw above the visible top of the current event slot.
            const maxGapPx = Math.max(
              0,
              (daySlotHeight * eventTopPercent) / 100 - connectorOffset,
            );
            gapPx = Math.min(gapPx, maxGapPx);
          }
        }
      }

      if (gapPx <= 0) {
        const { height } = node.getBoundingClientRect();
        if (Number.isFinite(height) && height > 0) {
          const pxPerMinute = height / durationMinutes;
          gapPx = Math.max(0, gapMinutes * pxPerMinute);
        }
      }
      const badgeHeight =
        walkBadgeRef.current?.getBoundingClientRect().height ?? 0;
      const badgeTopNudge = 2;
      const nextWalkBadgeTop =
        badgeHeight > 0 && gapPx < badgeHeight ? (badgeHeight - gapPx) / 2 : 0;
      setWalkBadgeTop(nextWalkBadgeTop - badgeTopNudge);

      const nextHeight = Math.max(0, gapPx - connectorOffset);
      setConnectorHeight(nextHeight);
    };
    updateConnector();
    // Recompute after layout settles; RBC adjusts inline styles during render.
    const frame = window.requestAnimationFrame(updateConnector);
    if (typeof ResizeObserver === 'undefined')
      return () => window.cancelAnimationFrame(frame);
    const observer = new ResizeObserver(() => updateConnector());
    observer.observe(node);
    if (walkBadgeRef.current) observer.observe(walkBadgeRef.current);
    const observedEventNode = node.closest('.rbc-event');
    const observedDaySlotNode = node.closest('.rbc-day-slot');
    if (observedEventNode instanceof HTMLElement)
      observer.observe(observedEventNode);
    if (observedDaySlotNode instanceof HTMLElement)
      observer.observe(observedDaySlotNode);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [
    event.end,
    event.start,
    walkBefore,
    isCalendarViewLocked,
    calendarLockStart,
    calendarLockEnd,
  ]);

  const walkChipOpacity =
    !isMobile && hoverCourse && hoverCourse !== event.listing.crn ? 0.3 : 1;
  const suppressClassModalOpen = useCallback(() => {
    onWalkModalInteraction?.('press');
  }, [onWalkModalInteraction]);
  const openWalkModal = useCallback(() => {
    onWalkModalInteraction?.('open');
    setIsWalkModalOpen(true);
  }, [onWalkModalInteraction]);
  const hideWalkModal = useCallback(() => {
    onWalkModalInteraction?.('close');
    setIsWalkModalOpen(false);
  }, [onWalkModalInteraction]);

  useEffect(() => {
    if (!walkBefore && isWalkModalOpen) {
      setIsWalkModalOpen(false);
      onWalkModalInteraction?.('close');
    }
  }, [walkBefore, isWalkModalOpen, onWalkModalInteraction]);

  return (
    <div
      ref={eventRef}
      className={styles.event}
      style={
        {
          color: textColor,
          '--walk-chip-opacity': walkChipOpacity,
        } as React.CSSProperties
      }
    >
      {walkBefore && (
        <>
          <span
            className={styles.walkBadgeDots}
            style={
              {
                '--walk-connector': walkColor,
                '--walk-connector-height':
                  connectorHeight !== null ? `${connectorHeight}px` : undefined,
                '--walk-connector-offset': `${connectorOffset}px`,
              } as React.CSSProperties
            }
            aria-hidden
          />
          <WalkBadge
            walk={walkBefore}
            accentColor={walkColor}
            badgeTop={walkBadgeTop}
            badgeRef={walkBadgeRef}
            onPressStart={suppressClassModalOpen}
            onClick={openWalkModal}
          />
          <WalkDetailsModal
            walk={walkBefore}
            show={isWalkModalOpen}
            onHide={hideWalkModal}
          />
        </>
      )}
      <strong className={styles.courseCodeText}>{formattedTitle}</strong>
      <br />
      <ResponsiveEllipsis
        className={styles.courseNameText}
        text={event.description}
        maxLine="1"
        basedOn="words"
      />
      <small className={styles.locationText}>{event.location}</small>
      <br />
      {lastMod && (
        <ResponsiveEllipsis
          className={styles.lastUpdatedText}
          text={`Last updated: ${new Date(lastMod).toLocaleDateString()}`}
        />
      )}
    </div>
  );
}

function WalkBadge({
  walk,
  accentColor,
  badgeTop,
  badgeRef,
  onPressStart,
  onClick,
}: {
  readonly walk: WalkBefore;
  readonly accentColor: string;
  readonly badgeTop: number;
  readonly badgeRef: React.Ref<HTMLButtonElement>;
  readonly onPressStart: () => void;
  readonly onClick: () => void;
}) {
  const availableMinutes = Math.max(0, walk.gapMinutes);
  const hasEnoughTime = walk.minutes <= availableMinutes;

  return (
    <button
      type="button"
      ref={badgeRef}
      className={clsx(
        styles.walkBadge,
        !hasEnoughTime && styles.walkBadgeWarning,
      )}
      data-walk-modal-trigger="true"
      style={
        {
          '--walk-accent': accentColor,
          '--walk-badge-top': `${badgeTop}px`,
        } as React.CSSProperties
      }
      onPointerDown={(e) => {
        e.stopPropagation();
        onPressStart();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onPressStart();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        onPressStart();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      aria-label={`Open walking details for ${walk.minutes} minute walk${
        hasEnoughTime ? '' : ', not enough time between classes'
      }`}
    >
      {hasEnoughTime && (
        <span className={styles.walkBadgeIconWrap} aria-hidden>
          <FaWalking className={styles.walkBadgeIcon} />
        </span>
      )}
      <span className={styles.walkBadgeEta}>
        {!hasEnoughTime && (
          <BsExclamationTriangleFill
            className={styles.walkWarningIconChip}
            size={12}
            aria-hidden
          />
        )}
        {walk.minutes} min walk
      </span>
      <span className={styles.walkBadgeOpen} aria-hidden>
        Open
      </span>
    </button>
  );
}

function WalkDetailsModal({
  walk,
  show,
  onHide,
}: {
  readonly walk: WalkBefore;
  readonly show: boolean;
  readonly onHide: () => void;
}) {
  const availableMinutes = Math.max(0, walk.gapMinutes);
  const hasEnoughTime = walk.minutes <= availableMinutes;
  const routeColor = chroma(walk.toClass.color).css();
  const isMobile = useStore((state) => state.isMobile);
  const howItWorksContentId = React.useId();
  const [isHowItWorksExpanded, setIsHowItWorksExpanded] = useState(!isMobile);
  const isHowItWorksCollapsible = isMobile;
  const showHowItWorksContent =
    !isHowItWorksCollapsible || isHowItWorksExpanded;

  useEffect(() => {
    if (!show) return;
    setIsHowItWorksExpanded(!isMobile);
  }, [isMobile, show]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName={styles.walkModalDialog}
      contentClassName={styles.walkModalContent}
    >
      <Modal.Header closeButton className={styles.walkModalHeader}>
        <Modal.Title className={styles.walkModalTitle}>
          Walking time
          <span className={styles.walkModalBetaPill}>Beta</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.walkModalBody}>
        <div className={styles.walkModalLayout}>
          <WalkClassDetails
            className={styles.walkModalFromClass}
            accentColor={walk.fromClass.color}
            courseCode={walk.fromClass.courseCode}
            courseTitle={walk.fromClass.courseTitle}
            location={walk.fromClass.location}
            time={formatMeetingTime(walk.fromClass.start, walk.fromClass.end)}
          />
          <div className={styles.walkModalHowItWorks}>
            <h3 className={styles.walkModalHowItWorksHeading}>
              {isHowItWorksCollapsible ? (
                <button
                  type="button"
                  className={styles.walkModalHowItWorksToggle}
                  onClick={() =>
                    setIsHowItWorksExpanded((prevExpanded) => !prevExpanded)
                  }
                  aria-expanded={showHowItWorksContent}
                  aria-controls={howItWorksContentId}
                >
                  <span>How it works</span>
                  <span
                    className={clsx(
                      styles.walkModalHowItWorksChevron,
                      showHowItWorksContent &&
                        styles.walkModalHowItWorksChevronExpanded,
                    )}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>
              ) : (
                'How it works'
              )}
            </h3>
            <div id={howItWorksContentId} hidden={!showHowItWorksContent}>
              <p className={styles.walkModalDisclaimer}>
                CourseTable uses Google Maps to predict walking times between
                your classes. Estimates are pre-calculated and not definitive.
              </p>
              <p className={styles.walkModalDisclaimer}>
                When multiple classes share the same gap, CourseTable shows the
                combination with the longest estimated walk. You can hide or
                remove classes to change which are used for walking-time
                estimates. To hide walking times entirely, visit Worksheet
                Settings.
              </p>
              <p className={styles.walkModalDisclaimer}>
                Actual walking times may vary depending on route choice,
                in-building travel, individual walk speed, traffic, weather,
                construction, and other factors. Check important information.
              </p>
            </div>
          </div>
          <div className={styles.walkModalMiddle}>
            <span
              className={styles.walkModalRouteLine}
              style={
                {
                  '--walk-route-color': routeColor,
                } as React.CSSProperties
              }
              aria-hidden
            />
            <div className={styles.walkModalEta}>
              <span className={styles.walkModalEtaLabel}>
                Estimated walking time
              </span>
              <strong className={styles.walkModalMinutes}>
                {!hasEnoughTime && (
                  <BsExclamationTriangleFill
                    className={styles.walkWarningIconModal}
                    aria-hidden
                  />
                )}
                {walk.minutes} minutes
              </strong>
              <p className={styles.walkModalTimingMessage}>
                {hasEnoughTime
                  ? `You have ${formatMinutes(
                      availableMinutes,
                    )} between these classes, so you probably have enough time for this walk.`
                  : `You only have ${formatMinutes(
                      availableMinutes,
                    )} between these classes, so you probably don't have enough time for this walk.`}
              </p>
            </div>
          </div>
          <WalkClassDetails
            className={styles.walkModalToClass}
            accentColor={walk.toClass.color}
            courseCode={walk.toClass.courseCode}
            courseTitle={walk.toClass.courseTitle}
            location={walk.toClass.location}
            time={formatMeetingTime(walk.toClass.start, walk.toClass.end)}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}

function WalkClassDetails({
  accentColor,
  courseCode,
  courseTitle,
  location,
  time,
  className,
}: {
  readonly accentColor: string;
  readonly courseCode: string;
  readonly courseTitle: string;
  readonly location: string;
  readonly time: string;
  readonly className?: string;
}) {
  const blockColor = chroma(accentColor);
  const textColor =
    chroma.contrast(accentColor, 'white') > 2 ? 'white' : 'black';
  return (
    <div
      className={clsx(styles.walkModalClassBlock, className)}
      style={
        {
          '--walk-class-bg-color': blockColor.alpha(0.85).css(),
          '--walk-class-border-color': blockColor.css(),
          '--walk-class-text-color': textColor,
        } as React.CSSProperties
      }
    >
      <p className={styles.walkModalClassHeading}>
        <strong className={styles.walkModalCourseCode}>{courseCode}</strong>
      </p>
      <span className={styles.walkModalCourseTitle}>{courseTitle}</span>
      <span className={styles.walkModalClassMeta}>{location}</span>
      <span className={styles.walkModalClassMeta}>{time}</span>
    </div>
  );
}

function CalendarEvent({
  event,
  onWalkModalInteraction,
}: {
  readonly event: CourseRBCEvent;
  readonly onWalkModalInteraction?: (interaction: WalkModalInteraction) => void;
}) {
  const { listing } = event;
  const isReadonlyWorksheet = useStore((state) =>
    state.worksheetMemo.getIsReadonlyWorksheet(state),
  );

  return (
    <>
      <CalendarEventBody
        event={event}
        onWalkModalInteraction={onWalkModalInteraction}
      />
      {!isReadonlyWorksheet && (
        <div className={styles.eventButtons}>
          <WorksheetHideButton
            crn={listing.crn}
            // Course in calendar is never hidden
            hidden={false}
            className={styles.worksheetHideButton}
            color="var(--color-text-dark)"
          />
          <WorksheetItemActionsButton
            event={event}
            className={styles.worksheetHideButton}
          />
        </div>
      )}
    </>
  );
}

export function useEventStyle() {
  const hoverCourse = useStore((state) => state.hoverCourse);
  const isMobile = useStore((state) => state.isMobile);
  // Custom styling for the calendar events
  const eventStyleGetter = useCallback(
    (event: CourseRBCEvent) => {
      const color = chroma(event.color);
      let backgroundColor = color.alpha(0.85).css();
      let borderColor = color.css();

      if (!isMobile && hoverCourse) {
        if (hoverCourse === event.listing.crn) {
          const emphasized = color.saturate(1);
          backgroundColor = emphasized.alpha(0.9).css();
          borderColor = emphasized.css();
        } else {
          backgroundColor = color.alpha(0.3).css();
          borderColor = color.alpha(0.3).css();
        }
      }

      const style: React.CSSProperties = {
        backgroundColor,
        borderColor,
        borderWidth: '2px',
      };
      // Hover management is too hard on mobile and not very useful
      if (isMobile) return { style };
      if (hoverCourse && hoverCourse === event.listing.crn) style.zIndex = 2;
      return {
        style,
      };
    },
    [isMobile, hoverCourse],
  );
  return eventStyleGetter;
}

export default CalendarEvent;
