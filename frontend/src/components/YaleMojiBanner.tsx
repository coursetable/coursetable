import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import YaleMojiLink from './Navbar/YaleMojiLink';
import { subscribeYaleMojiBanner } from '../hooks/yalemojiCache';
import { useStore } from '../store';
import { useLocalStorageState } from '../utilities/browserStorage';
import styles from './YaleMojiBanner.module.css';

const BANNER_ID = 1;

export default function YaleMojiBanner() {
  const [lastDismissed, setLastDismissed] = useLocalStorageState(
    'lastDismissedYalemojiBanner',
    0,
  );
  const authStatus = useStore((state) => state.authStatus);
  const netId = useStore((state) => state.user?.netId);
  const [loaded, setLoaded] = useState(false);
  const [eligibleNetId, setEligibleNetId] = useState<typeof netId>();

  useEffect(() => {
    let frame = 0;
    const onLoad = () => {
      frame = requestAnimationFrame(() => setLoaded(true));
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !netId) return undefined;
    return subscribeYaleMojiBanner(netId, (visible) => {
      setEligibleNetId(visible ? netId : undefined);
    });
  }, [authStatus, netId]);

  const open =
    lastDismissed !== BANNER_ID &&
    authStatus === 'authenticated' &&
    Boolean(netId) &&
    loaded &&
    eligibleNetId === netId;

  return (
    <div className={styles.banner} data-open={open} aria-hidden={!open}>
      <div className={styles.clip}>
        <div className={styles.content}>
          <YaleMojiLink
            className={styles.link}
            href="https://yalemoji.com/create?ref=coursetable"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
          >
            <span>Your avatar across Yale</span>
            <span className={styles.action}>
              Make your Yalemoji <span aria-hidden="true">↗</span>
            </span>
          </YaleMojiLink>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Dismiss Yalemoji banner"
            tabIndex={open ? 0 : -1}
            onClick={() => setLastDismissed(BANNER_ID)}
          >
            <FaTimes size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
