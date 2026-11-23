import type { JSONContent } from '@tiptap/react';

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
