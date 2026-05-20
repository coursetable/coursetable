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

export function isCourseTableScraperHeader(
  value: string | string[] | undefined,
): boolean {
  if (value === undefined) return false;
  const v = Array.isArray(value) ? value[0] : value;
  if (v === undefined) return false;
  return v.trim().toLowerCase() === 'scraper';
}
