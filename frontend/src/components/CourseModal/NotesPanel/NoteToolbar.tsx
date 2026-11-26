import clsx from 'clsx';
import { FaIndent, FaListOl, FaListUl, FaRedo, FaUndo } from 'react-icons/fa';
import { type Editor, useEditorState } from '@tiptap/react';

import { toggleNoteList } from './noteExtensions';
import styles from './NoteToolbar.module.css';

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
      className={clsx(
        'btn btn-sm',
        pressed ? 'btn-primary' : 'btn-none text-body-secondary',
        styles.btn,
      )}
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
        <FaListUl />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        pressed={state.numbers}
        onClick={() => toggleNoteList(editor, 'orderedList')}
      >
        <FaListOl />
      </ToolbarButton>
      <ToolbarButton
        label="Make sublist (Tab)"
        disabled={!state.canIndent}
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
      >
        <FaIndent />
      </ToolbarButton>
      <span className="vr mx-1" />
      <ToolbarButton
        label="Undo (⌘Z)"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <FaUndo />
      </ToolbarButton>
      <ToolbarButton
        label="Redo (⌘⇧Z)"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <FaRedo />
      </ToolbarButton>
    </div>
  );
}

export default NoteToolbar;
