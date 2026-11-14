import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { YaleMojiAvatar } from '../queries/api';
import type { NetId } from '../queries/graphql-types';

const { lookup } = vi.hoisted(() => ({ lookup: vi.fn() }));
vi.mock('../queries/api', () => ({
  getYaleMojiAvatar: lookup,
  yaleMojiAvatarSchema: {
    safeParse: (value: unknown) => ({ success: Boolean(value), data: value }),
  },
}));

const netId = 'abc123' as NetId;
const avatar: YaleMojiAvatar = {
  version: 1,
  png_url: 'https://assets.example/avatar.png',
  svg_url: 'https://assets.example/avatar.svg',
  background_url: 'https://assets.example/background.svg',
};

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
}

async function setup(cached?: YaleMojiAvatar) {
  const localStorage = memoryStorage();
  const sessionStorage = memoryStorage();
  if (cached) {
    localStorage.setItem(
      'coursetable-yalemoji',
      JSON.stringify({ netid: netId, avatar: cached }),
    );
  }
  const window = Object.assign(new EventTarget(), {
    localStorage,
    sessionStorage,
  });
  const document = Object.assign(new EventTarget(), {
    readyState: 'complete',
    visibilityState: 'visible',
  });
  vi.stubGlobal('window', window);
  vi.stubGlobal('document', document);
  vi.stubGlobal('performance', { getEntriesByType: () => [], now: () => 0 });
  const api = await import('./yalemojiCache');
  return { api, window, document, localStorage, sessionStorage };
}

beforeEach(() => {
  vi.resetModules();
  lookup.mockReset();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Yalemoji shared cache and banner eligibility', () => {
  it('shares the initial lookup across the profile and banner and across remounts', async () => {
    lookup.mockResolvedValue(null);
    const { api } = await setup();
    const unsubscribe = api.subscribeYaleMoji(netId, vi.fn());
    const banner = vi.fn();
    api.subscribeYaleMojiBanner(netId, banner);
    await vi.runAllTimersAsync();
    expect(banner).toHaveBeenLastCalledWith(true);
    unsubscribe();
    api.subscribeYaleMoji(netId, vi.fn());
    expect(lookup).toHaveBeenCalledExactlyOnceWith(netId);
  });

  it('does not advertise during an outage or before the lookup finishes', async () => {
    lookup.mockResolvedValue(undefined);
    const { api } = await setup();
    const banner = vi.fn();
    api.subscribeYaleMojiBanner(netId, banner);
    expect(banner).toHaveBeenLastCalledWith(false);
    await vi.runAllTimersAsync();
    expect(banner.mock.calls.every(([visible]) => visible === false)).toBe(
      true,
    );
  });

  it('shows a cached avatar immediately, then refreshes five seconds after load', async () => {
    lookup.mockResolvedValue({ ...avatar, version: 2 });
    const { api } = await setup(avatar);
    const profile = vi.fn();
    api.subscribeYaleMoji(netId, profile);
    expect(profile).toHaveBeenLastCalledWith(avatar);
    expect(lookup).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(4999);
    expect(lookup).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(profile).toHaveBeenLastCalledWith({ ...avatar, version: 2 });
  });

  it('refreshes once after a Yalemoji visit, hides the banner and updates every subscriber', async () => {
    lookup.mockResolvedValue(null);
    const { api, window, document } = await setup();
    const banner = vi.fn();
    const profile = vi.fn();
    api.subscribeYaleMojiBanner(netId, banner);
    api.subscribeYaleMoji(netId, profile);
    await vi.runAllTimersAsync();
    window.dispatchEvent(new Event('focus'));
    expect(lookup).toHaveBeenCalledTimes(1);
    api.markYaleMojiVisit();
    expect(banner).toHaveBeenLastCalledWith(false);
    lookup.mockResolvedValue(avatar);
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.runAllTimersAsync();
    expect(lookup).toHaveBeenCalledTimes(2);
    expect(profile).toHaveBeenLastCalledWith(avatar);
    expect(banner).toHaveBeenLastCalledWith(false);
  });

  it('preserves a cached avatar when a refresh fails', async () => {
    lookup.mockResolvedValue(undefined);
    const { api } = await setup(avatar);
    const profile = vi.fn();
    const banner = vi.fn();
    api.subscribeYaleMoji(netId, profile);
    api.subscribeYaleMojiBanner(netId, banner);
    await vi.runAllTimersAsync();
    expect(profile).toHaveBeenLastCalledWith(avatar);
    expect(banner).toHaveBeenLastCalledWith(false);
  });

  it('clears persisted state on logout and ignores a response from the old session', async () => {
    let finish: (value: YaleMojiAvatar) => void = () => {};
    lookup.mockReturnValue(
      new Promise<YaleMojiAvatar>((resolve) => {
        finish = resolve;
      }),
    );
    const { api, localStorage, sessionStorage } = await setup();
    const profile = vi.fn();
    api.subscribeYaleMoji(netId, profile);
    api.markYaleMojiVisit();
    api.clearYaleMojiCache();
    finish(avatar);
    await vi.runAllTimersAsync();
    expect(profile).not.toHaveBeenCalledWith(avatar);
    expect(localStorage.getItem('coursetable-yalemoji')).toBeNull();
    expect(sessionStorage.getItem('coursetable-yalemoji-return')).toBeNull();
  });
});
