import { useEffect, useMemo, useState } from 'react';
import { FontSize, TextStyle } from '@tiptap/extension-text-style';
import { CharacterCount, Placeholder } from '@tiptap/extensions';
import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { parseNoteContent, stripPastedFontSizes } from './noteContent';
import {
  DashableBulletList,
  KeepSelectionVisible,
  ListMarkerClick,
  NoteShortcuts,
} from './noteExtensions';
import NoteLinkControls, { type LinkDraft } from './NoteLinkControls';
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
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      // Only web links, so a note can never hold a javascript: link
      isAllowedUri: (url, { defaultValidate }) =>
        /^https?:\/\//iu.test(url) && defaultValidate(url),
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
  const [linkDraft, setLinkDraft] = useState<LinkDraft | null>(null);
  const [tooLarge, setTooLarge] = useState(false);
  const saver = useMemo(
    () =>
      createNoteSaver({
        initialContent,
        save: (content) => saveCourseNote(season, crn, content),
        onStatusChange: setStatus,
      }),
    [season, crn, initialContent],
  );

  // Opening the link box on a link selects the whole link first
  const openLinkBox = (target: Editor) => {
    if (target.isActive('link')) target.commands.extendMarkRange('link');
    const { from, to } = target.state.selection;
    setLinkDraft({
      from,
      to,
      href: (target.getAttributes('link').href as string | undefined) ?? '',
    });
  };

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

  // ⌘K opens the link box, as in Google Docs
  useEffect(() => {
    const { dom } = editor.view;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openLinkBox(editor);
      }
    };
    dom.addEventListener('keydown', onKeyDown);
    return () => dom.removeEventListener('keydown', onKeyDown);
  });

  // Save pending edits when the tab or modal closes
  useEffect(() => () => saver.flush(), [saver]);

  return (
    <>
      <div className={styles.box}>
        <NoteToolbar editor={editor} onLink={() => openLinkBox(editor)} />
        <div className={styles.area}>
          <EditorContent editor={editor} className={styles.editor} />
          <NoteLinkControls
            editor={editor}
            draft={linkDraft}
            onEdit={() => openLinkBox(editor)}
            onClose={() => setLinkDraft(null)}
          />
        </div>
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
