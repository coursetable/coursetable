import { useMemo } from 'react';
import { useFerry } from './useFerry';

function toRelativeTime(date: Date) {
  const nowTime = Date.now() / 1000;
  let lastUpdateTime = date.getTime() / 1000;
  if (lastUpdateTime > nowTime) lastUpdateTime -= 24 * 60 * 60;
  const diffInSecs = nowTime - lastUpdateTime;
  if (diffInSecs < 60) {
    return `${Math.floor(diffInSecs)} sec${Math.floor(diffInSecs) > 1 ? 's' : ''}`;
  } else if (diffInSecs < 3600) {
    const diffInMins = Math.floor(diffInSecs / 60);
    return `${diffInMins} min${diffInMins > 1 ? 's' : ''}`;
  } else if (diffInSecs < 86400) {
    const diffInHrs = Math.floor(diffInSecs / 3600);
    return `${diffInHrs} hr${diffInHrs > 1 ? 's' : ''}`;
  }
  const diffInDays = Math.floor(diffInSecs / 86400);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
}

export function useLastUpdated() {
  const { courses } = useFerry();
  return useMemo(() => {
    // TODO: this currently only displays the max last update.
    // Maybe if we detected a mismatch between seasons, we should force a
    // reload for all the stale ones.
    const timestamps = Object.values(courses).map((x) =>
      Number(x.metadata.last_update),
    );
    if (timestamps.length === 0) return null;
    const lastUpdated = new Date(Math.max(...timestamps));
    return { lastUpdated, relative: toRelativeTime(lastUpdated) };
  }, [courses]);
}
