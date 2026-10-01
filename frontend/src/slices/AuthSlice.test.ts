import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAuthSlice } from './AuthSlice';
import { checkAuth } from '../queries/api';
import type { Store } from '../store';

vi.mock('../queries/api', () => ({ checkAuth: vi.fn() }));

function harness(user?: Store['user']) {
  let state = {
    user,
    userRefresh: vi.fn().mockResolvedValue(undefined),
    worksheetsRefresh: vi.fn().mockResolvedValue(undefined),
    wishlistRefresh: vi.fn().mockResolvedValue(undefined),
    friendRefresh: vi.fn().mockResolvedValue(undefined),
    friendReqRefresh: vi.fn().mockResolvedValue(undefined),
  } as Partial<Store>;
  const slice = createAuthSlice(
    ((patch: Partial<Store>) => {
      state = { ...state, ...patch };
    }) as Parameters<typeof createAuthSlice>[0],
    (() => state as Store) as Parameters<typeof createAuthSlice>[1],
    {} as Parameters<typeof createAuthSlice>[2],
  );
  return { slice, state: () => state };
}

describe('refreshAuth', () => {
  beforeEach(() => vi.mocked(checkAuth).mockReset());

  it('clears the persisted user when not authenticated', async () => {
    vi.mocked(checkAuth).mockResolvedValue(false);
    const { slice, state } = harness({ netId: 'abc12' } as Store['user']);

    await slice.refreshAuth();

    expect(state().authStatus).toBe('unauthenticated');
    expect(state().user).toBeUndefined();
  });

  it('keeps the user when authenticated', async () => {
    vi.mocked(checkAuth).mockResolvedValue(true);
    const user = { netId: 'abc12' } as Store['user'];
    const { slice, state } = harness(user);

    await slice.refreshAuth();

    expect(state().authStatus).toBe('authenticated');
    expect(state().user).toBe(user);
  });
});
