import type { JSONContent } from '@tiptap/react';

export const DEFAULT_FONT_SIZE = 15;
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 48;

export function clampFontSize(size: number) {
  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(size)));
}

/**
 * Notes are stored as Tiptap JSON. Anything else is older plain text, which is
 * shown as one paragraph per line.
 */
export function parseNoteContent(content: string): JSONContent | null {
  if (!content) return null;
  try {
    const doc = JSON.parse(content) as JSONContent | null;
    if (doc?.type === 'doc' && Array.isArray(doc.content)) return doc;
  } catch {}
  return {
    type: 'doc',
    content: content
      .split('\n')
      .map((line) =>
        line
          ? { type: 'paragraph', content: [{ type: 'text', text: line }] }
          : { type: 'paragraph' },
      ),
  };
}

/** Only web links are allowed, so a note can never hold a javascript: link. */
export function normalizeLinkUrl(raw: string): string | null {
  const text = raw.trim();
  if (!text || /\s/u.test(text)) return null;
  const withScheme = /^[a-z][a-z\d+.-]*:/iu.test(text)
    ? text
    : `https://${text}`;
  try {
    const url = new URL(withScheme);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (!url.hostname.includes('.')) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** A link's address without the scheme or trailing slash, for display. */
export function linkLabel(href: string) {
  return href.replace(/^https?:\/\//u, '').replace(/\/$/u, '');
}

/** Pasted text keeps its formatting, except sizes copied from other sites. */
export function stripPastedFontSizes(html: string) {
  return html.replace(/font-size\s*:[^;"']*;?\s*/giu, '');
}
