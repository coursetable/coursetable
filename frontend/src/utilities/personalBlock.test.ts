import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPersonalBlockEvents } from './calendar';
import {
  personalBlockSchema,
  personalBlocksSchema,
} from '../../../shared/personalBlock.mjs';

const block = {
  id: 'b78d394d-85ec-428b-98bf-49f199d2e346',
  title: 'Practice',
  days: [2, 4],
  start: '15:00',
  end: '16:00',
};

describe('personal blocks', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('validates and trims titles with optional color', () => {
    expect(
      personalBlockSchema.parse({ ...block, title: ' Practice ' }),
    ).toEqual(block);
    expect(
      personalBlockSchema.safeParse({ ...block, color: '#abcdef' }).success,
    ).toBe(true);
  });

  it.each([
    { id: 'invalid' },
    { title: '  ' },
    { title: 'a'.repeat(101) },
    { days: [] },
    { days: [0] },
    { days: [6] },
    { days: [1.5] },
    { start: '9:00' },
    { start: '25:00' },
    { end: '16:60' },
    { start: '16:00' },
    { start: '17:00' },
    { color: 'invalid' },
  ])('rejects invalid input: %j', (invalid) => {
    expect(
      personalBlockSchema.safeParse({ ...block, ...invalid }).success,
    ).toBe(false);
  });

  it.each(['2026-10-26T12:00:00', '2026-11-01T12:00:00'])(
    'positions weekdays in the current local week on %s',
    (now) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(now));
      const events = getPersonalBlockEvents([block]);
      expect(events.map((event) => event.start.getDay())).toEqual([2, 4]);
      for (const event of events) {
        expect(event.kind).toBe('personal');
        expect(event.start.getHours()).toBe(15);
        expect(event.end.getHours()).toBe(16);
        expect(event.end.getTime() - event.start.getTime()).toBe(3600000);
        expect(event.block).toBe(block);
        const expectedDate = new Date(now);
        expectedDate.setDate(
          expectedDate.getDate() - expectedDate.getDay() + event.start.getDay(),
        );
        expect(event.start.toDateString()).toBe(expectedDate.toDateString());
      }
    },
  );

  it('keeps overlapping commitments and avoids duplicate weekday events', () => {
    expect(
      getPersonalBlockEvents([block, { ...block, id: 'other' }]),
    ).toHaveLength(4);
    expect(getPersonalBlockEvents([{ ...block, days: [2, 2] }])).toHaveLength(
      1,
    );
  });
});

describe('personal block collections', () => {
  it('allows clearing every commitment', () => {
    expect(personalBlocksSchema.parse([])).toEqual([]);
  });

  it('applies block validation when parsing a collection', () => {
    expect(
      personalBlocksSchema.parse([{ ...block, title: ' Practice ' }]),
    ).toEqual([block]);
    expect(
      personalBlocksSchema.safeParse([{ ...block, days: [] }]).success,
    ).toBe(false);
  });

  it('rejects duplicate IDs without rejecting distinct overlapping blocks', () => {
    expect(personalBlocksSchema.safeParse([block, block]).success).toBe(false);
    expect(
      personalBlocksSchema.safeParse([
        block,
        { ...block, id: '4aa95cf2-5c39-4c6a-a360-a96c159ba7fc' },
      ]).success,
    ).toBe(true);
  });

  it('allows 100 commitments and rejects any more', () => {
    const blocks = Array.from({ length: 101 }, (_, index) => ({
      ...block,
      id: `00000000-0000-4000-8000-${index.toString().padStart(12, '0')}`,
    }));
    expect(personalBlocksSchema.safeParse(blocks.slice(0, 100)).success).toBe(
      true,
    );
    expect(personalBlocksSchema.safeParse(blocks).success).toBe(false);
  });
});
