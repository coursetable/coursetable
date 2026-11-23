import { useEffect, useMemo, useState } from 'react';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { isWebLink, parseNoteContent } from './noteContent';
import { NoteShortcuts } from './noteExtensions';
import { createNoteSaver, type NoteSaveStatus } from './noteSaver';
import NoteToolbar from './NoteToolbar';
import { saveCourseNote } from '../../../queries/api';
import styles from './NoteEditor.module.css';

const MAX_NOTE_LENGTH = 5000;
const NOTE_LENGTH_WARNING = 4500;
const MAX_NOTE_BYTES = 60_000;

const statusLabels: { [status in NoteSaveStatus]: string } = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved ✓',
  error: "Couldn't save",
};

const extensions = [
  StarterKit.configure({
    blockquote: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    link: {
      openOnClick: true,
      autolink: true,
      defaultProtocol: 'https',
      isAllowedUri: (url, { defaultValidate }) =>
        isWebLink(url) && defaultValidate(url),
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
    },
  }),
  Placeholder.configure({ placeholder: 'Add a note…' }),
  CharacterCount.configure({ limit: MAX_NOTE_LENGTH }),
  NoteShortcuts,
];

function NoteEditor({
  sameCourseId,
  initialContent,
}: {
  readonly sameCourseId: number;
  readonly initialContent: string;
}) {
  const [status, setStatus] = useState<NoteSaveStatus>('idle');
  const [length, setLength] = useState(0);
  const [tooLarge, setTooLarge] = useState(false);
  const saver = useMemo(
    () =>
      createNoteSaver({
        initialContent,
        save: (content) => saveCourseNote(sameCourseId, content),
        onStatusChange: setStatus,
      }),
    [sameCourseId, initialContent],
  );

  const editor = useEditor({
    extensions,
    content: parseNoteContent(initialContent),
    editorProps: {},
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

  useEffect(() => () => saver.flush(), [saver]);

  return (
    <>
      <div className={styles.box}>
        <NoteToolbar editor={editor} />
        <EditorContent editor={editor} className={styles.editor} />
      </div>
      <div className="d-flex justify-content-end gap-3 mt-1 small text-body-tertiary">
        {length >= NOTE_LENGTH_WARNING && (
          <span>
            {length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}{' '}
            characters
          </span>
        )}
        <output
          className={tooLarge || status === 'error' ? 'text-danger' : undefined}
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
