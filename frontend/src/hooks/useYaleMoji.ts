import { useEffect, useState } from 'react';
import { clearYaleMojiCache, subscribeYaleMoji } from './yalemojiCache';
import type { YaleMojiAvatar } from '../queries/api';
import type { NetId } from '../queries/graphql-types';
import { useStore } from '../store';

export function useYaleMoji(netId: NetId | undefined) {
  const authStatus = useStore((state) => state.authStatus);
  const [loaded, setLoaded] = useState<{
    netId: NetId;
    avatar: YaleMojiAvatar | null;
  } | null>(null);
  const [failedUrl, setFailedUrl] = useState<string>();

  useEffect(() => {
    if (!netId) {
      if (authStatus === 'unauthenticated') clearYaleMojiCache();
      return undefined;
    }
    return subscribeYaleMoji(netId, (nextAvatar) => {
      setLoaded({ netId, avatar: nextAvatar });
      setFailedUrl(undefined);
    });
  }, [netId, authStatus]);

  const avatar = loaded && loaded.netId === netId ? loaded.avatar : null;
  return {
    avatar: avatar?.png_url === failedUrl ? null : avatar,
    onAvatarError: () => setFailedUrl(avatar?.png_url),
  };
}
