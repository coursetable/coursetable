import { useEffect, useMemo, useState } from 'react';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { Markdown } from '@tiptap/markdown';
import { EditorContent, Extension, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { createNoteSaver, type NoteSaveStatus } from './noteSaver';
import { saveCourseNote } from '../../../queries/api';
import type { Crn, Season } from '../../../queries/graphql-types';
import styles from './NoteEditor.module.css';

const MAX_NOTE_LENGTH = 5000;
const NOTE_LENGTH_WARNING = 4500;

const statusLabels: { [status in NoteSaveStatus]: string } = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved ✓',
  error: "Couldn't save",
};

// Runs before the normal undo, so it only removes the latest auto-conversion
const UndoAutoConversion = Extension.create({
  name: 'undoAutoConversion',
  priority: 1000,
  addKeyboardShortcuts() {
    return { 'Mod-z': () => this.editor.commands.undoInputRule() };
  },
});

const extensions = [
  StarterKit.configure({
    blockquote: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    link: false,
    strike: false,
    underline: false,
    listKeymap: {
      listTypes: [
        { itemName: 'listItem', wrapperNames: ['bulletList', 'orderedList'] },
        { itemName: 'taskItem', wrapperNames: ['taskList'] },
      ],
    },
  }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Placeholder.configure({ placeholder: 'Add a note… (try "- " for a list)' }),
  CharacterCount.configure({ limit: MAX_NOTE_LENGTH }),
  Markdown,
  UndoAutoConversion,
];

function NoteEditor({
  season,
  crn,
  initialContent,
}: {
  readonly season: Season;
  readonly crn: Crn;
  readonly initialContent: string;
}) {
  const [status, setStatus] = useState<NoteSaveStatus>('idle');
  const [length, setLength] = useState(0);
  const saver = useMemo(
    () =>
      createNoteSaver({
        initialContent,
        save: (content) => saveCourseNote(season, crn, content),
        onStatusChange: setStatus,
      }),
    [season, crn, initialContent],
  );

  const editor = useEditor({
    extensions,
    content: initialContent,
    contentType: 'markdown',
    onCreate({ editor: createdEditor }) {
      setLength(createdEditor.storage.characterCount.characters());
    },
    onUpdate({ editor: updatedEditor }) {
      setLength(updatedEditor.storage.characterCount.characters());
      saver.update(updatedEditor.getMarkdown().trim());
    },
  });

  // Save pending edits when the tab or modal closes
  useEffect(() => () => saver.flush(), [saver]);

  return (
    <>
      <EditorContent editor={editor} className={styles.editor} />
      <div className={styles.footer}>
        {length >= NOTE_LENGTH_WARNING && (
          <span>
            {length.toLocaleString()} / {MAX_NOTE_LENGTH.toLocaleString()}{' '}
            characters
          </span>
        )}
        <output className={status === 'error' ? styles.statusError : undefined}>
          {statusLabels[status]}
        </output>
      </div>
    </>
  );
}

export default NoteEditor;
