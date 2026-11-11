import { describe, it, expect } from 'vitest';
import {
  clampFontSize,
  linkLabel,
  normalizeLinkUrl,
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

describe('normalizeLinkUrl', () => {
  it('adds https:// when missing', () => {
    expect(normalizeLinkUrl('courses.yale.edu')).toBe(
      'https://courses.yale.edu/',
    );
  });

  it('keeps http and https links', () => {
    expect(normalizeLinkUrl(' http://example.com/a ')).toBe(
      'http://example.com/a',
    );
  });

  it('rejects links that could run code or are not web addresses', () => {
    // eslint-disable-next-line no-script-url -- checks that these links are rejected
    expect(normalizeLinkUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeLinkUrl('mailto:a@b.co')).toBeNull();
    expect(normalizeLinkUrl('not a link')).toBeNull();
    expect(normalizeLinkUrl('localhost')).toBeNull();
  });
});

describe('linkLabel', () => {
  it('drops the scheme and trailing slash', () => {
    expect(linkLabel('https://courses.yale.edu/')).toBe('courses.yale.edu');
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
