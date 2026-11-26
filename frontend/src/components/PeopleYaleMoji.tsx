import { useEffect, useState } from 'react';
import { subscribePeopleYaleMoji } from '../hooks/peopleYaleMojiCache';
import type { YaleMojiAvatar } from '../queries/api';
import { getInitials } from '../utilities/common';
import styles from './PeopleYaleMoji.module.css';

const DEFAULT_AVATAR = 'https://www.yalemoji.com/assets/default-avatar.png?v=3';

export function PeopleYaleMoji({
  netId,
  name,
}: {
  readonly netId: string;
  readonly name?: string | null;
}) {
  const [loaded, setLoaded] = useState<{
    netId: string;
    avatar: YaleMojiAvatar | null;
  }>();
  useEffect(
    () =>
      subscribePeopleYaleMoji(netId, (nextAvatar) => {
        setLoaded({ netId, avatar: nextAvatar });
      }),
    [netId],
  );
  const avatar = loaded?.netId === netId ? loaded.avatar : null;
  return (
    <span className={styles.avatar} aria-hidden="true">
      <YaleMojiImage avatar={avatar} netId={netId} name={name} />
    </span>
  );
}

export function YaleMojiImage({
  avatar,
  className,
  onAvatarError,
  netId,
  name,
}: {
  readonly avatar: YaleMojiAvatar | null;
  readonly className?: string;
  readonly onAvatarError?: () => void;
  readonly netId?: string | null;
  readonly name?: string | null;
}) {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const pngUrl = avatar?.png_url;
  const src = pngUrl && !failedUrls.includes(pngUrl) ? pngUrl : undefined;
  const initials = getInitials({ name, netId });
  return (
    <span className={className ?? styles.image} aria-hidden="true">
      <span className={styles.image}>
        {src ? (
          <img
            src={src}
            alt=""
            onError={() => {
              setFailedUrls((urls) => [...urls, src]);
              onAvatarError?.();
            }}
          />
        ) : initials ? (
          <span className={styles.initials}>{initials}</span>
        ) : (
          <img src={DEFAULT_AVATAR} alt="" />
        )}
      </span>
    </span>
  );
}
