import type { JSONContent } from '@tiptap/react';

export const DEFAULT_FONT_SIZE = 15;
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_SIZE = 48;

export function clampFontSize(size: number) {
  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(size)));
}

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

export function isWebLink(url: string) {
  return /^https?:\/\//iu.test(url);
}

export function stripPastedFontSizes(html: string) {
  return html.replace(/font-size\s*:[^;"']*;?\s*/giu, '');
}
