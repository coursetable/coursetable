import type { CSSProperties } from 'react';
import type { DayLayoutFunction } from 'react-big-calendar';

// @ts-expect-error -- RBC has no types for lib/utils/layout-algorithms/overlap.js
import overlapLayoutRaw from 'react-big-calendar/lib/utils/layout-algorithms/overlap.js';
import type { CourseRBCEvent } from './calendar';

type NumericLayoutStyle = {
  top: number;
  height: number;
  width: number;
  xOffset: number;
};

type StyledRow = { event: CourseRBCEvent; style: NumericLayoutStyle };

export function attachOverlapClusters(
  events: CourseRBCEvent[],
): CourseRBCEvent[] {
  const copies = events.map((e) => ({ ...e }));
  const bySlot = new Map<string, CourseRBCEvent[]>();
  for (const e of copies) {
    const slotKey = `${e.start.getTime()}_${e.end.getTime()}`;
    const group = bySlot.get(slotKey);
    if (group) group.push(e);
    else bySlot.set(slotKey, [e]);
  }
  for (const group of bySlot.values()) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((a, b) =>
      String(a.listing.crn).localeCompare(String(b.listing.crn), undefined, {
        numeric: true,
      }),
    );
    const clusterId = `${sorted[0]!.start.getTime()}_${sorted[0]!.end.getTime()}`;
    for (let i = 0; i < sorted.length; i++) {
      sorted[i]!.overlapCluster = {
        clusterId,
        peers: sorted,
        index: i,
      };
    }
  }
  return copies;
}

const stackConcurrentSlotLayout: DayLayoutFunction<CourseRBCEvent> = (args) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- RBC internal module is untyped
  const styled = overlapLayoutRaw(args) as StyledRow[];
  const byBand = new Map<string, StyledRow[]>();
  for (const item of styled) {
    const { top, height } = item.style;
    const key = `${String(top)}|${String(height)}`;
    const group = byBand.get(key);
    if (group) group.push(item);
    else byBand.set(key, [item]);
  }
  for (const group of byBand.values()) {
    if (group.length < 2) continue;
    for (const item of group)
      Object.assign(item.style, { width: 100, xOffset: 0 });
  }
  return styled as { event: CourseRBCEvent; style: CSSProperties }[];
};

export default stackConcurrentSlotLayout;
