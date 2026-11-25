import { MdUpdate } from 'react-icons/md';
import { useLastUpdated } from '../../hooks/useLastUpdated';
import { TextComponent } from '../Typography';

export default function LastUpdated() {
  const updated = useLastUpdated() ?? {
    lastUpdated: new Date(),
    relative: '0 sec',
  };
  return (
    <TextComponent type="tertiary" small className="mb-2 text-end" as="div">
      <MdUpdate className="me-1" />
      Updated{' '}
      <time
        title={updated.lastUpdated.toString()}
        dateTime={updated.lastUpdated.toISOString()}
      >
        {updated.relative} ago
      </time>
    </TextComponent>
  );
}
