// A typical course's workload rating. Courses at this rating count the same in
// the weighted total as in the plain total.
export const WORKLOAD_PIVOT = 3;

/**
 * Weights a course's workload rating so heavier courses count for more than
 * their rating: w × (w / pivot). Two 2-workload courses (1.33 each) then add up
 * to much less than one 4-workload course (5.33).
 */
export function getWeightedWorkload(workload: number): number {
  return (workload * workload) / WORKLOAD_PIVOT;
}
