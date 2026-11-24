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

export function noteText(content: string) {
  const parts: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.text) parts.push(node.text);
    node.content?.forEach(walk);
    if (node.type !== 'text') parts.push(' ');
  };
  const doc = parseNoteContent(content);
  if (doc) walk(doc);
  return parts.join('').replace(/\s+/gu, ' ').trim();
}
