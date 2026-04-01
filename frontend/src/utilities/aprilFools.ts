/** April Fools: show catalog numbers as Roman numerals (1–3999). */

const ROMAN_MAP: readonly (readonly [number, string])[] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
] as const;

export function integerToRoman(n: number): string {
  if (n < 1 || n > 3999)
    throw new RangeError('integerToRoman: n must be 1–3999');
  let rest = n;
  let out = '';
  for (const [value, numeral] of ROMAN_MAP) {
    while (rest >= value) {
      out += numeral;
      rest -= value;
    }
  }
  return out;
}

/**
 * If `courseNumber` starts with digits, that run is shown as Roman numerals.
 * Non-numeric or out-of-range values are returned unchanged.
 */
export function courseNumberAsRomanDisplay(courseNumber: string): string {
  const leadingDigits = /^\d+/u.exec(courseNumber);
  if (!leadingDigits) return courseNumber;
  const [digitStr] = leadingDigits;
  const suffix = courseNumber.slice(digitStr.length);
  const n = Number.parseInt(digitStr, 10);
  if (n < 1 || n > 3999) return courseNumber;
  return integerToRoman(n) + suffix;
}
