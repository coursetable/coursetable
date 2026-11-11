import { useEffect, useMemo, useState } from 'react';
import { FontSize, TextStyle } from '@tiptap/extension-text-style';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import {
  isWebLink,
  parseNoteContent,
  stripPastedFontSizes,
} from './noteContent';
import {
  DashableBulletList,
  KeepSelectionVisible,
  ListMarkerClick,
  NoteShortcuts,
} from './noteExtensions';
import { createNoteSaver, type NoteSaveStatus } from './noteSaver';
import NoteToolbar from './NoteToolbar';
import { saveCourseNote } from '../../../queries/api';
import type { Crn, Season } from '../../../queries/graphql-types';
import styles from './NoteEditor.module.css';

const MAX_NOTE_LENGTH = 5000;
const NOTE_LENGTH_WARNING = 4500;
// Matches the API's cap. Only extreme formatting, such as every character
// styled differently, can pass it within the 5,000 character limit.
const MAX_NOTE_BYTES = 90_000;

const statusLabels: { [status in NoteSaveStatus]: string } = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved ✓',
  error: "Couldn't save",
};

const extensions = [
  StarterKit.configure({
    blockquote: false,
    bulletList: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    // A pasted or typed address becomes a link that opens in a new tab. There
    // is no link editing: removing one is undo, or deleting the text.
    link: {
      openOnClick: true,
      autolink: true,
      defaultProtocol: 'https',
      // Only web links, so a note can never hold a javascript: link
      isAllowedUri: (url, { defaultValidate }) =>
        isWebLink(url) && defaultValidate(url),
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
    },
  }),
  DashableBulletList,
  TextStyle,
  FontSize,
  Placeholder.configure({ placeholder: 'Add a note…' }),
  CharacterCount.configure({ limit: MAX_NOTE_LENGTH }),
  KeepSelectionVisible,
  ListMarkerClick,
  NoteShortcuts,
];

function NoteEditor({
  sameCourseId,
  season,
  crn,
  initialContent,
}: {
  readonly sameCourseId: number;
  readonly season: Season;
  readonly crn: Crn;
  readonly initialContent: string;
}) {
  const [status, setStatus] = useState<NoteSaveStatus>('idle');
  const [length, setLength] = useState(0);
  const [tooLarge, setTooLarge] = useState(false);
  const saver = useMemo(
    () =>
      createNoteSaver({
        initialContent,
        save: (content) =>
          saveCourseNote({ sameCourseId, season, crn }, content),
        onStatusChange: setStatus,
      }),
    [sameCourseId, season, crn, initialContent],
  );

  const editor = useEditor({
    extensions,
    content: parseNoteContent(initialContent),
    editorProps: {
      transformPastedHTML: stripPastedFontSizes,
    },
    onCreate({ editor: created }) {
      setLength(created.storage.characterCount.characters());
    },
    onUpdate({ editor: updated }) {
      setLength(updated.storage.characterCount.characters());
      const content = updated.isEmpty ? '' : JSON.stringify(updated.getJSON());
      const large = new TextEncoder().encode(content).length > MAX_NOTE_BYTES;
      setTooLarge(large);
      if (!large) saver.update(content);
    },
  });

  // Save pending edits when the tab or modal closes
  useEffect(() => () => saver.flush(), [saver]);

  return (
    <>
      <div className={styles.box}>
        <NoteToolbar editor={editor} />
        <EditorContent editor={editor} className={styles.editor} />
      </div>
      <div className={styles.footer}>
        {length >= NOTE_LENGTH_WARNING && (
          <span>
            {length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}{' '}
            characters
          </span>
        )}
        <output
          className={
            tooLarge || status === 'error' ? styles.statusError : undefined
          }
        >
          {tooLarge
            ? 'Too much formatting to save. Remove some to keep saving.'
            : statusLabels[status]}
        </output>
      </div>
    </>
  );
}

export default NoteEditor;
