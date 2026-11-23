import clsx from 'clsx';
import { type Editor, useEditorState } from '@tiptap/react';

import { toggleNoteList } from './noteExtensions';
import styles from './NoteToolbar.module.css';

const icons = {
  bullets: (
    <svg viewBox="0 0 20 20">
      <circle cx="4" cy="5" r="1" />
      <circle cx="4" cy="10" r="1" />
      <circle cx="4" cy="15" r="1" />
      <path d="M8 5h9M8 10h9M8 15h9" />
    </svg>
  ),
  numbers: (
    <svg viewBox="0 0 20 20">
      <path d="M3 4h1.5v3M3 7h3M3 13.5c0-1 2.6-1 2.6 0S3 15 3 16h3M9 5h8M9 10h8M9 15h8" />
    </svg>
  ),
  indent: (
    <svg viewBox="0 0 20 20">
      <path d="M3 5h14M9 10h8M9 15h8M3 9l3 2.5L3 14" />
    </svg>
  ),
  undo: (
    <svg viewBox="0 0 20 20">
      <path d="M6 8H13a4 4 0 0 1 0 8H8M6 8l3-3M6 8l3 3" />
    </svg>
  ),
  redo: (
    <svg viewBox="0 0 20 20">
      <path d="M14 8H7a4 4 0 0 0 0 8h5M14 8l-3-3M14 8l-3 3" />
    </svg>
  ),
};

function ToolbarButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: {
  readonly label: string;
  readonly pressed?: boolean;
  readonly disabled?: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={clsx('btn btn-sm', styles.btn)}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function NoteToolbar({ editor }: { readonly editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      bullets: e.isActive('bulletList'),
      numbers: e.isActive('orderedList'),
      canIndent: e.can().sinkListItem('listItem'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  return (
    <div className={styles.bar} role="toolbar" aria-label="Formatting">
      <ToolbarButton
        label="Bold (⌘B)"
        pressed={state.bold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <b>B</b>
      </ToolbarButton>
      <ToolbarButton
        label="Italic (⌘I)"
        pressed={state.italic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i>I</i>
      </ToolbarButton>
      <ToolbarButton
        label="Underline (⌘U)"
        pressed={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough (⌘⇧X)"
        pressed={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s>S</s>
      </ToolbarButton>
      <span className="vr mx-1" />
      <ToolbarButton
        label="Bulleted list"
        pressed={state.bullets}
        onClick={() => toggleNoteList(editor, 'bulletList')}
      >
        {icons.bullets}
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        pressed={state.numbers}
        onClick={() => toggleNoteList(editor, 'orderedList')}
      >
        {icons.numbers}
      </ToolbarButton>
      <ToolbarButton
        label="Make sublist (Tab)"
        disabled={!state.canIndent}
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
      >
        {icons.indent}
      </ToolbarButton>
      <span className="vr mx-1" />
      <ToolbarButton
        label="Undo (⌘Z)"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        {icons.undo}
      </ToolbarButton>
      <ToolbarButton
        label="Redo (⌘⇧Z)"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        {icons.redo}
      </ToolbarButton>
    </div>
  );
}

export default NoteToolbar;
