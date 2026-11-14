import { useEffect, useState } from 'react';
import YaleMojiLink from './Navbar/YaleMojiLink';
import { subscribeYaleMojiBanner } from '../hooks/yalemojiCache';
import { useStore } from '../store';
import styles from './YaleMojiBanner.module.css';

export default function YaleMojiBanner() {
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
            <span className={styles.description}>
              Your personalized Yale avatar
            </span>
            <span className={styles.action}>
              Make your Yalemoji <span aria-hidden="true">↗</span>
            </span>
          </YaleMojiLink>
        </div>
      </div>
    </div>
  );
}
