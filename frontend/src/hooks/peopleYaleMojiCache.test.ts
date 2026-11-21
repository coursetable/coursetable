import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { YaleMojiAvatar } from '../queries/api';

const { lookup } = vi.hoisted(() => ({
  lookup:
    vi.fn<
      (
        ids: string[],
      ) => Promise<{ [id: string]: YaleMojiAvatar | null } | undefined>
    >(),
}));
vi.mock('../queries/api', () => ({ getYaleMojiAvatars: lookup }));
const avatar = {
  version: 1,
  png_url: 'https://assets.example/avatar.png',
  svg_url: 'https://assets.example/avatar.svg',
  background_url: 'https://assets.example/background.svg',
};

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  lookup.mockReset();
});
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('people Yalemoji lookups', () => {
  it('batches 205 rows into groups of 100 and shares duplicate subscriptions', async () => {
    lookup.mockImplementation((ids: string[]) =>
      Promise.resolve(Object.fromEntries(ids.map((id) => [id, avatar]))),
    );
    const { subscribePeopleYaleMoji } = await import('./peopleYaleMojiCache');
    const listener = vi.fn();
    for (let i = 0; i < 205; i++) subscribePeopleYaleMoji(`u${i}`, listener);
    subscribePeopleYaleMoji('U0', listener);
    await vi.runAllTimersAsync();
    expect(lookup.mock.calls.map(([ids]) => ids.length)).toEqual([100, 100, 5]);
    expect(new Set(lookup.mock.calls.flatMap(([ids]) => ids)).size).toBe(205);
    expect(listener).toHaveBeenLastCalledWith(avatar);
  });

  it('shares cached avatars and confirmed missing avatars between menus', async () => {
    lookup.mockResolvedValue({ aa1: avatar, bb2: null });
    const { subscribePeopleYaleMoji } = await import('./peopleYaleMojiCache');
    subscribePeopleYaleMoji('aa1', vi.fn());
    subscribePeopleYaleMoji('bb2', vi.fn());
    await vi.runAllTimersAsync();
    const found = vi.fn();
    const missing = vi.fn();
    subscribePeopleYaleMoji('aa1', found);
    subscribePeopleYaleMoji('bb2', missing);
    await vi.runAllTimersAsync();
    expect(lookup).toHaveBeenCalledTimes(1);
    expect(found).toHaveBeenLastCalledWith(avatar);
    expect(missing).toHaveBeenLastCalledWith(null);
  });

  it('ignores unmounted rows while completing lookups for other rows', async () => {
    let finish: (value: {
      [id: string]: YaleMojiAvatar | null;
    }) => void = () => {};
    lookup.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const { subscribePeopleYaleMoji } = await import('./peopleYaleMojiCache');
    const listener = vi.fn();
    const unsubscribe = subscribePeopleYaleMoji('aa1', listener);
    await vi.advanceTimersByTimeAsync(0);
    unsubscribe();
    finish({ aa1: avatar });
    await vi.runAllTimersAsync();
    expect(listener).toHaveBeenCalledExactlyOnceWith(null);
  });

  it('preserves previous avatars during outages and retries after reopening', async () => {
    lookup
      .mockResolvedValueOnce({ aa1: avatar })
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({ aa1: null });
    const { subscribePeopleYaleMoji } = await import('./peopleYaleMojiCache');
    subscribePeopleYaleMoji('aa1', vi.fn());
    await vi.runAllTimersAsync();
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    const listener = vi.fn();
    const unsubscribe = subscribePeopleYaleMoji('aa1', listener);
    await vi.runAllTimersAsync();
    expect(listener).toHaveBeenLastCalledWith(avatar);
    unsubscribe();
    subscribePeopleYaleMoji('aa1', listener);
    await vi.runAllTimersAsync();
    expect(listener).toHaveBeenLastCalledWith(null);
    expect(lookup).toHaveBeenCalledTimes(3);
  });
});
