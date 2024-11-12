import { useMemo } from 'react';
import { MdUpdate } from 'react-icons/md';
import { useFerry } from '../../contexts/ferryContext';
import { TextComponent } from '../Typography';

function toRelativeTime(date: Date) {
  const nowTime = Date.now() / 1000;
  let lastUpdateTime = date.getTime() / 1000;
  if (lastUpdateTime > nowTime) lastUpdateTime -= 24 * 60 * 60;
  const diffInSecs = nowTime - lastUpdateTime;
  if (diffInSecs < 60) {
    return `${diffInSecs} sec${diffInSecs > 1 ? 's' : ''}`;
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

export default function LastUpdated() {
  const { courses } = useFerry();
  const { lastUpdated, relative } = useMemo(() => {
    if (Object.keys(courses).length === 0)
      return { lastUpdated: new Date(), relative: '0 sec' };
    // TODO: this currently only displays the max last update.
    // Maybe if we detected a mismatch between seasons, we should force a reload
    // for all the stale ones.
    const lastUpdated = new Date(
      Math.max(
        ...Object.values(courses).map((x) => Number(x.metadata.last_update)),
      ),
    );
    const relative = toRelativeTime(lastUpdated);
    return { lastUpdated, relative };
  }, [courses]);
  return (
    <TextComponent
      type="tertiary"
      small
      className="mb-2 text-end me-2"
      as="div"
    >
      <MdUpdate className="me-1" />
      Updated{' '}
      <time title={lastUpdated.toString()} dateTime={lastUpdated.toISOString()}>
        {relative} ago
      </time>
    </TextComponent>
  );
}
