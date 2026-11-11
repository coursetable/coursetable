import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createNoteSaver, type NoteSaveStatus } from './noteSaver';

function makeSaver(save: (content: string) => Promise<boolean>) {
  const statuses: NoteSaveStatus[] = [];
  const saver = createNoteSaver({
    initialContent: 'first',
    save,
    onStatusChange: (status) => statuses.push(status),
  });
  return { saver, statuses };
}

describe('createNoteSaver', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('saves once, 500ms after the last change', async () => {
    const save = vi.fn().mockResolvedValue(true);
    const { saver, statuses } = makeSaver(save);
    saver.update('a');
    await vi.advanceTimersByTimeAsync(400);
    saver.update('ab');
    await vi.advanceTimersByTimeAsync(499);
    expect(save).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(save.mock.calls).toEqual([['ab']]);
    expect(statuses).toEqual(['saving', 'saved']);
  });

  it('saves pending changes immediately on flush', async () => {
    const save = vi.fn().mockResolvedValue(true);
    const { saver } = makeSaver(save);
    saver.update('closing');
    saver.flush();
    await vi.advanceTimersByTimeAsync(0);
    expect(save.mock.calls).toEqual([['closing']]);
  });

  it('saves the newest content after an in-flight save', async () => {
    let finishFirstSave: (succeeded: boolean) => void = () => undefined;
    const save = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<boolean>((resolve) => {
            finishFirstSave = resolve;
          }),
      )
      .mockResolvedValue(true);
    const { saver, statuses } = makeSaver(save);
    saver.update('one');
    await vi.advanceTimersByTimeAsync(500);
    saver.update('two');
    saver.update('three');
    await vi.advanceTimersByTimeAsync(500);
    expect(save).toHaveBeenCalledTimes(1);
    finishFirstSave(true);
    await vi.advanceTimersByTimeAsync(0);
    expect(save.mock.calls).toEqual([['one'], ['three']]);
    expect(statuses.at(-1)).toBe('saved');
  });

  it('reports a failed save and retries on the next edit', async () => {
    const save = vi.fn().mockResolvedValueOnce(false).mockResolvedValue(true);
    const { saver, statuses } = makeSaver(save);
    saver.update('unsaved');
    await vi.advanceTimersByTimeAsync(500);
    expect(statuses.at(-1)).toBe('error');
    saver.update('unsaved!');
    await vi.advanceTimersByTimeAsync(500);
    expect(save.mock.calls).toEqual([['unsaved'], ['unsaved!']]);
    expect(statuses.at(-1)).toBe('saved');
  });

  it('treats a rejected save as a failure', async () => {
    const save = vi.fn().mockRejectedValue(new Error('network'));
    const { saver, statuses } = makeSaver(save);
    saver.update('unsaved');
    await vi.advanceTimersByTimeAsync(500);
    expect(statuses.at(-1)).toBe('error');
  });

  it('does not save when the content returns to the saved version', async () => {
    const save = vi.fn().mockResolvedValue(true);
    const { saver } = makeSaver(save);
    saver.update('changed');
    saver.update('first');
    await vi.advanceTimersByTimeAsync(500);
    expect(save).not.toHaveBeenCalled();
  });
});
