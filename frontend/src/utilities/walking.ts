import walkingETAsJson from '../data/walkingETAs.json';

type WalkingETAsData = {
  durations_seconds?: { [key: string]: { [key: string]: number } };
  durations_upper?: { [key: string]: { [key: string]: number } };
  locations?: { [key: string]: { name?: string; lat: number; lng: number } };
};

const walkingETAs = walkingETAsJson as WalkingETAsData;

export function getBuildingCodeFromLocation(location: string): string | null {
  const trimmed = location.trim();
  if (!trimmed) return null;
  const [code] = trimmed.split(/\s+/u);
  return code ? code.toUpperCase() : null;
}

export function getWalkingSeconds(
  fromCode: string,
  toCode: string,
): number | null {
  const a = fromCode.trim().toUpperCase();
  const b = toCode.trim().toUpperCase();
  if (!a || !b) return null;
  if (a === b) return 0;

  if (walkingETAs.durations_seconds)
    return walkingETAs.durations_seconds[a]?.[b] ?? null;

  const upper = walkingETAs.durations_upper;
  if (!upper) return null;
  return upper[a]?.[b] ?? upper[b]?.[a] ?? null;
}

export function getWalkingMinutes(
  fromCode: string,
  toCode: string,
): number | null {
  const seconds = getWalkingSeconds(fromCode, toCode);
  if (seconds === null || Number.isNaN(seconds)) return null;
  return Math.round(seconds / 60);
}
