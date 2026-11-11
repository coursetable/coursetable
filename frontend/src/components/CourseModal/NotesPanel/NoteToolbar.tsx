import { useState } from 'react';
import { type Editor, useEditorState } from '@tiptap/react';

import { clampFontSize, DEFAULT_FONT_SIZE } from './noteContent';
import { selectedFontSize, toggleNoteList } from './noteExtensions';
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
      className={styles.btn}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      // Keeps the note's selection while the button is pressed
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function FontSizeControl({
  editor,
  size,
}: {
  readonly editor: Editor;
  readonly size: number | null;
}) {
  // What is typed in the box, while it has focus
  const [draft, setDraft] = useState<string | null>(null);

  const apply = (value: number) => {
    const next = clampFontSize(value);
    const chain = editor.chain().focus();
    if (next === DEFAULT_FONT_SIZE) chain.unsetFontSize().run();
    else chain.setFontSize(`${next}px`).run();
    setDraft(null);
  };
  const base = () => {
    const typed = parseInt(draft ?? '', 10);
    return typed || size || DEFAULT_FONT_SIZE;
  };

  return (
    <span className={styles.size}>
      <ToolbarButton label="Smaller text" onClick={() => apply(base() - 1)}>
        −
      </ToolbarButton>
      <input
        className={styles.sizeInput}
        type="text"
        inputMode="numeric"
        aria-label="Text size"
        title="Text size"
        value={draft ?? (size === null ? '' : String(size))}
        onFocus={(e) => {
          setDraft(e.target.value);
          e.target.select();
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => setDraft(null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const typed = parseInt(draft ?? '', 10);
            if (typed) apply(typed);
            else setDraft(null);
          } else if (e.key === 'Escape') {
            setDraft(null);
            editor.commands.focus();
          }
        }}
      />
      <ToolbarButton label="Bigger text" onClick={() => apply(base() + 1)}>
        +
      </ToolbarButton>
    </span>
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
      size: selectedFontSize(e),
    }),
  });

  return (
    <div className={styles.bar} role="toolbar" aria-label="Formatting">
      <FontSizeControl editor={editor} size={state.size} />
      <span className={styles.sep} />
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
        <span className={styles.italic}>I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Underline (⌘U)"
        pressed={state.underline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className={styles.underline}>U</span>
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough (⌘⇧X)"
        pressed={state.strike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className={styles.strike}>S</span>
      </ToolbarButton>
      <span className={styles.sep} />
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
      <span className={styles.sep} />
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
