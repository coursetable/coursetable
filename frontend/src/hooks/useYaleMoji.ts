import { useEffect, useState } from 'react';
import { clearYaleMojiCache, subscribeYaleMoji } from './yalemojiCache';
import type { YaleMojiAvatar } from '../queries/api';
import type { NetId } from '../queries/graphql-types';

export function useYaleMoji(netId: NetId | undefined) {
  const [loaded, setLoaded] = useState<{
    netId: NetId;
    avatar: YaleMojiAvatar | null;
  } | null>(null);
  const [failedUrl, setFailedUrl] = useState<string>();

  useEffect(() => {
    if (!netId) {
      clearYaleMojiCache();
      return undefined;
    }
    return subscribeYaleMoji(netId, (nextAvatar) => {
      setLoaded({ netId, avatar: nextAvatar });
      setFailedUrl(undefined);
    });
  }, [netId]);

  const avatar = loaded && loaded.netId === netId ? loaded.avatar : null;
  return {
    avatar: avatar?.png_url === failedUrl ? null : avatar,
    onAvatarError: () => setFailedUrl(avatar?.png_url),
  };
}
