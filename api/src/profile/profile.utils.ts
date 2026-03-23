export type ViewerRelation = 'self' | 'friend' | 'stranger';
export type VisibilitySetting = 'self' | 'friends' | 'public';

export interface ProfilePrivacySettings {
  nameVisibility: VisibilitySetting;
  emailVisibility: VisibilitySetting;
  yearVisibility: VisibilitySetting;
  schoolVisibility: VisibilitySetting;
  majorVisibility: VisibilitySetting;
}

export interface ProfileNames {
  firstName: string | null;
  lastName: string | null;
  preferredFirstName: string | null;
  preferredLastName: string | null;
}

const DEFAULT_PRIVACY: ProfilePrivacySettings = {
  nameVisibility: 'public',
  emailVisibility: 'self',
  yearVisibility: 'friends',
  schoolVisibility: 'friends',
  majorVisibility: 'friends',
};

const VALID_VISIBILITIES = new Set<VisibilitySetting>([
  'self',
  'friends',
  'public',
]);

export const normalizeVisibility = (
  rawValue: string | null | undefined,
  fallback: VisibilitySetting,
): VisibilitySetting => {
  if (!rawValue) return fallback;
  return VALID_VISIBILITIES.has(rawValue as VisibilitySetting)
    ? (rawValue as VisibilitySetting)
    : fallback;
};

export const normalizePrivacySettings = (raw: {
  nameVisibility: string | null;
  emailVisibility: string | null;
  yearVisibility: string | null;
  schoolVisibility: string | null;
  majorVisibility: string | null;
}): ProfilePrivacySettings => ({
  nameVisibility: normalizeVisibility(
    raw.nameVisibility,
    DEFAULT_PRIVACY.nameVisibility,
  ),
  emailVisibility: normalizeVisibility(
    raw.emailVisibility,
    DEFAULT_PRIVACY.emailVisibility,
  ),
  yearVisibility: normalizeVisibility(
    raw.yearVisibility,
    DEFAULT_PRIVACY.yearVisibility,
  ),
  schoolVisibility: normalizeVisibility(
    raw.schoolVisibility,
    DEFAULT_PRIVACY.schoolVisibility,
  ),
  majorVisibility: normalizeVisibility(
    raw.majorVisibility,
    DEFAULT_PRIVACY.majorVisibility,
  ),
});

export const canViewerSee = (
  visibility: VisibilitySetting,
  relation: ViewerRelation,
): boolean => {
  switch (visibility) {
    case 'public':
      return true;
    case 'friends':
      return relation === 'self' || relation === 'friend';
    case 'self':
      return relation === 'self';
    default:
      return false;
  }
};

const trimToNull = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
};

export const getDisplayNameParts = (names: ProfileNames) => {
  const displayFirst = trimToNull(names.preferredFirstName ?? names.firstName);
  const displayLast = trimToNull(names.preferredLastName ?? names.lastName);
  return { displayFirst, displayLast };
};

export const joinName = (
  first: string | null,
  last: string | null,
): string | null => {
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (last) return last;
  return null;
};

export const getVisibleDisplayName = (
  names: ProfileNames,
  relation: ViewerRelation,
  nameVisibility: VisibilitySetting,
): string | null => {
  if (!canViewerSee(nameVisibility, relation)) return null;
  const { displayFirst, displayLast } = getDisplayNameParts(names);
  return joinName(displayFirst, displayLast);
};

export const getSelfDisplayNames = (names: ProfileNames) => {
  const { displayFirst, displayLast } = getDisplayNameParts(names);
  return {
    displayFirstName: displayFirst,
    displayLastName: displayLast,
    displayName: joinName(displayFirst, displayLast),
  };
};

export const sanitizeNullableName = (
  value: unknown,
): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  return trimmed;
};
