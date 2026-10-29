import { describe, expect, it } from 'vitest';

import { getWeightedWorkload, WORKLOAD_PIVOT } from './workload';

describe('getWeightedWorkload', () => {
  it('leaves a typical course unchanged', () => {
    expect(getWeightedWorkload(WORKLOAD_PIVOT)).toBe(WORKLOAD_PIVOT);
  });

  it('counts two light courses as less than one heavy course', () => {
    const twoLight = getWeightedWorkload(2) * 2;
    const oneHeavy = getWeightedWorkload(4);
    expect(twoLight).toBeCloseTo(2.67);
    expect(oneHeavy).toBeCloseTo(5.33);
    expect(twoLight).toBeLessThan(oneHeavy);
  });

  it('returns 0 for no workload', () => {
    expect(getWeightedWorkload(0)).toBe(0);
  });
});
