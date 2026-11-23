import { useEffect, useState } from 'react';
import { subscribePeopleYaleMoji } from '../hooks/peopleYaleMojiCache';
import type { YaleMojiAvatar } from '../queries/api';
import styles from './PeopleYaleMoji.module.css';

const DEFAULT_AVATAR = 'https://www.yalemoji.com/assets/default-avatar.png?v=3';

export function PeopleYaleMoji({ netId }: { readonly netId: string }) {
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
      <YaleMojiImage avatar={avatar} />
    </span>
  );
}

export function YaleMojiImage({
  avatar,
  className,
  onAvatarError,
}: {
  readonly avatar: YaleMojiAvatar | null;
  readonly className?: string;
  readonly onAvatarError?: () => void;
}) {
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  const src =
    avatar?.png_url && !failedUrls.includes(avatar.png_url)
      ? avatar.png_url
      : DEFAULT_AVATAR;
  return (
    <span className={className ?? styles.image} aria-hidden="true">
      <span className={styles.image}>
        {!failedUrls.includes(src) && (
          <img
            src={src}
            alt=""
            onError={() => {
              setFailedUrls((urls) => [...urls, src]);
              if (src === avatar?.png_url) onAvatarError?.();
            }}
          />
        )}
      </span>
    </span>
  );
}
