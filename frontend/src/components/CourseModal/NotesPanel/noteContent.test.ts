import { describe, it, expect } from 'vitest';
import {
  clampFontSize,
  isWebLink,
  parseNoteContent,
  stripPastedFontSizes,
} from './noteContent';

describe('parseNoteContent', () => {
  it('returns nothing for an empty note', () => {
    expect(parseNoteContent('')).toBeNull();
  });

  it('reads a stored Tiptap document', () => {
    const doc = { type: 'doc', content: [{ type: 'paragraph' }] };
    expect(parseNoteContent(JSON.stringify(doc))).toEqual(doc);
  });

  it('shows older plain text one line per paragraph', () => {
    expect(parseNoteContent('- shop both\n\nsecond')).toEqual({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: '- shop both' }] },
        { type: 'paragraph' },
        { type: 'paragraph', content: [{ type: 'text', text: 'second' }] },
      ],
    });
  });

  it('treats JSON that is not a document as text', () => {
    expect(parseNoteContent('{"type":"paragraph"}')?.content?.[0]).toEqual({
      type: 'paragraph',
      content: [{ type: 'text', text: '{"type":"paragraph"}' }],
    });
  });
});

describe('isWebLink', () => {
  it('allows http and https addresses', () => {
    expect(isWebLink('http://example.com/a')).toBe(true);
    expect(isWebLink('https://courses.yale.edu/')).toBe(true);
  });

  it('rejects addresses that could run code or are not web addresses', () => {
    // eslint-disable-next-line no-script-url -- checks that these links are rejected
    expect(isWebLink('javascript:alert(1)')).toBe(false);
    expect(isWebLink('data:text/html,<script></script>')).toBe(false);
    expect(isWebLink('mailto:a@b.co')).toBe(false);
    expect(isWebLink('courses.yale.edu')).toBe(false);
  });
});

describe('clampFontSize', () => {
  it('keeps sizes between 8 and 48', () => {
    expect(clampFontSize(2)).toBe(8);
    expect(clampFontSize(200)).toBe(48);
    expect(clampFontSize(15.4)).toBe(15);
  });
});

describe('stripPastedFontSizes', () => {
  it('removes font sizes but keeps other styles', () => {
    expect(
      stripPastedFontSizes(
        '<span style="font-size: 30px; font-weight: 700">Big</span>',
      ),
    ).toBe('<span style="font-weight: 700">Big</span>');
  });
});
