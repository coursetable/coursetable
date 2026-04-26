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

function intervalsOverlap(a: CourseRBCEvent, b: CourseRBCEvent): boolean {
  return a.start < b.end && b.start < a.end;
}

export function attachOverlapClusters(
  events: CourseRBCEvent[],
): CourseRBCEvent[] {
  const copies = events.map((e) => ({ ...e }));

  const byDay = new Map<number, CourseRBCEvent[]>();
  for (const e of copies) {
    const day = e.start.getDay();
    const list = byDay.get(day) ?? [];
    list.push(e);
    byDay.set(day, list);
  }

  for (const dayEvents of byDay.values()) {
    if (dayEvents.length < 2) continue;

    const sorted = [...dayEvents].sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
    const visited = new Set<number>();

    for (let i = 0; i < sorted.length; i += 1) {
      if (visited.has(i)) continue;

      const component: CourseRBCEvent[] = [];
      const stack: number[] = [i];

      while (stack.length > 0) {
        const idx = stack.pop()!;
        if (visited.has(idx)) continue;
        visited.add(idx);
        const ev = sorted[idx]!;
        component.push(ev);
        for (let j = 0; j < sorted.length; j += 1) {
          if (visited.has(j)) continue;
          if (intervalsOverlap(ev, sorted[j]!)) stack.push(j);
        }
      }

      if (component.length < 2) continue;

      const ordered = [...component].sort((a, b) =>
        String(a.listing.crn).localeCompare(String(b.listing.crn), undefined, {
          numeric: true,
        }),
      );
      const clusterId = ordered
        .map(
          (e) =>
            `${String(e.listing.crn)}_${String(e.start.getTime())}_${String(e.end.getTime())}`,
        )
        .join('|');

      for (let k = 0; k < ordered.length; k += 1) {
        ordered[k]!.overlapCluster = {
          clusterId,
          peers: ordered,
          index: k,
        };
      }
    }
  }

  return copies;
}

const stackConcurrentSlotLayout: DayLayoutFunction<CourseRBCEvent> = (args) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- RBC internal module is untyped
  const styled = overlapLayoutRaw(args) as StyledRow[];

  const byClusterId = new Map<string, StyledRow[]>();
  for (const item of styled) {
    const cluster = item.event.overlapCluster;
    if (!cluster || cluster.peers.length < 2) continue;
    const list = byClusterId.get(cluster.clusterId) ?? [];
    list.push(item);
    byClusterId.set(cluster.clusterId, list);
  }

  for (const group of byClusterId.values()) {
    if (group.length < 2) continue;
    let minTop = Number.POSITIVE_INFINITY;
    let maxBottom = Number.NEGATIVE_INFINITY;
    for (const item of group) {
      const { top, height } = item.style;
      minTop = Math.min(minTop, top);
      maxBottom = Math.max(maxBottom, top + height);
    }
    const unionHeight = maxBottom - minTop;
    for (const item of group) {
      Object.assign(item.style, {
        top: minTop,
        height: unionHeight,
        width: 100,
        xOffset: 0,
      });
    }
  }

  return styled as { event: CourseRBCEvent; style: CSSProperties }[];
};

export default stackConcurrentSlotLayout;
