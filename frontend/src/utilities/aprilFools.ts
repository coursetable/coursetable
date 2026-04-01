/** April Fools: odd-index digits, then even-index digits (same as 2025). */

export function aprilFoolsCourseNumberDisplay(courseNumber: string): string {
  const chars = [...courseNumber];
  return (
    chars.filter((_, i) => i % 2).join('') +
    chars.filter((_, i) => i % 2 === 0).join('')
  );
}
