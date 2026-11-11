import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { IoFlaskOutline } from 'react-icons/io5';
import { useSearch } from '../../hooks/useSearch';
import { filterLabels } from '../../search/searchConstants';
import { sortByOptions, type BooleanOptions } from '../../search/searchTypes';
import { useStore } from '../../store';
import styles from './Toggle.module.css';

export default function Toggle<K extends BooleanOptions>({
  handle: handleName,
  onToggle,
}: {
  readonly handle: K;
  readonly onToggle?: (value: boolean) => void;
}) {
  const { filters, setStartTime } = useSearch();
  const label = filterLabels[handleName];
  const handle = filters[handleName];
  const toggle = () => {
    handle.set(!handle.value);
    onToggle?.(!handle.value);
    setStartTime(Date.now());
  };
  return (
    <Form.Check type="switch" className={styles.check}>
      <Form.Check.Input
        aria-label={label}
        className={styles.input}
        checked={handle.value}
        onChange={toggle}
      />
      <Form.Check.Label className={styles.label} onClick={toggle}>
        {handleName === 'enableQuist' ? (
          <>
            Enable <IoFlaskOutline color="var(--color-primary)" />
            <Link to="/releases/quist">Quist</Link>
          </>
        ) : (
          filterLabels[handleName]
        )}
      </Form.Check.Label>
    </Form.Check>
  );
}

// Only shown to users who have friends. Turning it on narrows results to
// courses on friends' main worksheets (excluding ones they've hidden) and ranks
// them by how many friends are taking each one.
export function FriendsTakingToggle() {
  const hasFriends = useStore(
    (state) => Object.keys(state.friends ?? {}).length > 0,
  );
  const {
    filters: { friendsTaking, selectSortBy, sortOrder },
  } = useSearch();
  if (!hasFriends && !friendsTaking.value) return null;
  return (
    <Toggle
      handle="friendsTaking"
      onToggle={(enabled) => {
        if (!enabled) return;
        selectSortBy.set(sortByOptions.friend);
        sortOrder.set('desc');
      }}
    />
  );
}
