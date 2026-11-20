import React, {
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import chroma from 'chroma-js';
import { useStore } from '../../store';
import type { CourseRBCEvent } from '../../utilities/calendar';
import { formatSectionSuffix } from '../../utilities/course';
import styles from './CalendarOverlapStack.module.css';

const ROW_GAP_PX = 2;

function heightThroughRow(
  measuredRows: HTMLElement[],
  rowCount: number,
): number {
  if (rowCount <= 0) return 0;
  const last = measuredRows[rowCount - 1];
  if (!last) return Number.POSITIVE_INFINITY;
  return last.offsetTop + last.offsetHeight;
}

function visibleRowCountThatFits(
  slotHeightPx: number,
  measuredRows: HTMLElement[],
  moreButtonHeightPx: number,
  peerCount: number,
): number {
  for (let shown = peerCount; shown >= 1; shown -= 1) {
    const rowsHeight = heightThroughRow(measuredRows, shown);
    const extraForMoreLink =
      shown < peerCount ? ROW_GAP_PX + moreButtonHeightPx : 0;
    const totalHeight = rowsHeight + extraForMoreLink;
    if (totalHeight <= slotHeightPx) return shown;
  }
  return 1;
}

function RowButton({
  peer,
  isMobile,
  onPick,
  measure,
}: {
  readonly peer: CourseRBCEvent;
  readonly isMobile: boolean;
  readonly onPick: (picked: CourseRBCEvent, e: SyntheticEvent) => void;
  readonly measure?: boolean;
}) {
  const rowBg = chroma(peer.color).alpha(0.22).css();
  const textColor =
    chroma.contrast(peer.color, 'white') > 2 ? '#fff' : 'rgb(20 24 35)';
  return (
    <button
      type="button"
      className={styles.overlapRow}
      style={
        {
          '--overlap-row-bg': rowBg,
          '--overlap-accent': peer.color,
          '--overlap-row-fg': textColor,
        } as React.CSSProperties
      }
      tabIndex={measure ? -1 : undefined}
      aria-hidden={measure ? true : undefined}
      {...(measure ? { 'data-overlap-row': '' } : {})}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        if (measure) return;
        e.stopPropagation();
        e.preventDefault();
        onPick(peer, e);
      }}
    >
      <span className={styles.overlapRowMain}>
        <strong className={styles.overlapCode}>
          {peer.title}
          {formatSectionSuffix(peer.listing.course)}
        </strong>
        {!isMobile && (
          <span className={styles.overlapTitle}>{peer.description}</span>
        )}
      </span>
      {!isMobile && peer.location && (
        <span className={styles.overlapLocation}>{peer.location}</span>
      )}
    </button>
  );
}

export function OverlapStackRows({
  peers,
  onPickStackCourse,
}: {
  readonly peers: CourseRBCEvent[];
  readonly onPickStackCourse: (
    picked: CourseRBCEvent,
    e: SyntheticEvent,
  ) => void;
}) {
  const isMobile = useStore((state) => state.isMobile);
  const stackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const moreMeasureRef = useRef<HTMLButtonElement>(null);
  const [visibleCount, setVisibleCount] = useState(() => peers.length);

  useLayoutEffect(() => {
    let rafId: number | null = null;

    const updateVisibleCountFromMeasure = () => {
      const stackEl = stackRef.current;
      const measureEl = measureRef.current;
      const peerCount = peers.length;

      if (!stackEl || !measureEl) return;
      if (peerCount <= 1) {
        setVisibleCount(Math.max(1, peerCount));
        return;
      }

      const slotHeightPx = stackEl.clientHeight;
      if (slotHeightPx <= 0) return;

      const measuredRows = [
        ...measureEl.querySelectorAll<HTMLElement>('[data-overlap-row]'),
      ];
      const moreBtn = moreMeasureRef.current;
      const moreButtonHeightPx = moreBtn?.offsetHeight ?? 22;

      const next = visibleRowCountThatFits(
        slotHeightPx,
        measuredRows,
        moreButtonHeightPx,
        peerCount,
      );
      setVisibleCount((prev) => (prev === next ? prev : next));
    };

    const scheduleMeasureUpdate = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateVisibleCountFromMeasure();
      });
    };

    updateVisibleCountFromMeasure();

    const stackForResize = stackRef.current;
    if (!stackForResize || typeof ResizeObserver === 'undefined') {
      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }

    const observer = new ResizeObserver(() => scheduleMeasureUpdate());
    observer.observe(stackForResize);
    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [peers, isMobile]);

  const preview = peers.slice(0, visibleCount);
  const moreCount = peers.length - preview.length;

  return (
    <div ref={stackRef} className={styles.overlapStack}>
      <div ref={measureRef} className={styles.overlapMeasure} aria-hidden>
        {peers.map((peer) => (
          <RowButton
            key={`m-${peer.listing.crn}-${peer.start.getTime()}`}
            peer={peer}
            isMobile={isMobile}
            onPick={onPickStackCourse}
            measure
          />
        ))}
        <button
          ref={moreMeasureRef}
          type="button"
          className={styles.overlapMore}
          tabIndex={-1}
        >
          +{peers.length} more
        </button>
      </div>
      {preview.map((peer) => (
        <RowButton
          key={`${peer.listing.crn}-${peer.start.getTime()}`}
          peer={peer}
          isMobile={isMobile}
          onPick={onPickStackCourse}
        />
      ))}
      {moreCount > 0 && (
        <OverlayTrigger
          trigger="click"
          rootClose
          placement="auto"
          overlay={
            <Popover
              id="worksheet-overlap-cluster-popover"
              className={styles.overlapPopover}
            >
              <Popover.Header as="div" className={styles.overlapPopoverHeader}>
                Classes at this time ({peers.length})
              </Popover.Header>
              <Popover.Body className={styles.overlapPopoverBody}>
                {peers.map((peer) => {
                  const textColor =
                    chroma.contrast(peer.color, 'white') > 2 ? '#fff' : '#111';
                  return (
                    <button
                      key={`pop-${peer.listing.crn}-${peer.start.getTime()}`}
                      type="button"
                      className={styles.overlapPopoverRow}
                      style={
                        {
                          '--pop-accent': peer.color,
                          '--pop-row-fg': textColor,
                        } as React.CSSProperties
                      }
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onPickStackCourse(peer, e);
                      }}
                    >
                      <span className={styles.overlapPopoverCode}>
                        {peer.title}
                        {formatSectionSuffix(peer.listing.course)}
                      </span>
                      <span className={styles.overlapPopoverTitle}>
                        {peer.description}
                      </span>
                      {peer.location && (
                        <span className={styles.overlapPopoverMeta}>
                          {peer.location}
                        </span>
                      )}
                    </button>
                  );
                })}
              </Popover.Body>
            </Popover>
          }
        >
          <button
            type="button"
            className={styles.overlapMore}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            +{moreCount} more
          </button>
        </OverlayTrigger>
      )}
    </div>
  );
}
