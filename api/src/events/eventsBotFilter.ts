export const BOT_UA_SUBSTRINGS = [
  'bot',
  'crawler',
  'spider',
  'headless',
  'puppeteer',
  'playwright',
  'curl',
  'wget',
] as const;

export function userAgentLooksLikeBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_UA_SUBSTRINGS.some((s) => ua.includes(s));
}

function headerValues(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function isCourseTableScraperHeader(
  value: string | string[] | undefined,
): boolean {
  return headerValues(value).some(
    (entry) => entry.trim().toLowerCase() === 'scraper',
  );
}
