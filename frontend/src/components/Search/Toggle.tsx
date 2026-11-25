import { Link } from 'react-router-dom';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IoFlaskOutline } from 'react-icons/io5';
import { MdInfoOutline } from 'react-icons/md';
import { useLastUpdated } from '../../hooks/useLastUpdated';
import { useSearch } from '../../hooks/useSearch';
import { filterLabels } from '../../search/searchConstants';
import type { BooleanOptions } from '../../search/searchTypes';
import { hideFullTooltip } from '../../utilities/constants';
import styles from './Toggle.module.css';

export default function Toggle<K extends BooleanOptions>({
  handle: handleName,
}: {
  readonly handle: K;
}) {
  const { filters, setStartTime } = useSearch();
  const updated = useLastUpdated();
  const label = filterLabels[handleName];
  const handle = filters[handleName];
  return (
    <Form.Check type="switch" className={styles.check}>
      <Form.Check.Input
        aria-label={label}
        className={styles.input}
        checked={handle.value}
        onChange={() => {
          handle.set(!handle.value);
          setStartTime(Date.now());
        }}
      />
      <Form.Check.Label
        className={styles.label}
        onClick={() => {
          handle.set(!handle.value);
          setStartTime(Date.now());
        }}
      >
        {handleName === 'enableQuist' ? (
          <>
            Enable <IoFlaskOutline color="var(--color-primary)" />
            <Link to="/releases/quist">Quist</Link>
          </>
        ) : (
          filterLabels[handleName]
        )}
      </Form.Check.Label>
      {handleName === 'hideFull' && (
        <OverlayTrigger
          placement="top"
          trigger={['hover', 'focus', 'click']}
          overlay={(overlayProps) => (
            <Tooltip id="hide-full-info" {...overlayProps}>
              <small>{hideFullTooltip(updated?.relative ?? null)}</small>
            </Tooltip>
          )}
        >
          <span className="ms-1">
            <MdInfoOutline />
          </span>
        </OverlayTrigger>
      )}
    </Form.Check>
  );
}
