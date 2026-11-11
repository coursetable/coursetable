import { useState } from 'react';
import clsx from 'clsx';
import { type Editor, useEditorState } from '@tiptap/react';

import { linkLabel, normalizeLinkUrl } from './noteContent';
import styles from './NoteLinkControls.module.css';

export type LinkDraft = { from: number; to: number; href: string };

/** Places a popover just under a document position, inside the note. */
function positionUnder(editor: Editor, pos: number) {
  const area = editor.view.dom.parentElement!.getBoundingClientRect();
  const coords = editor.view.coordsAtPos(pos);
  return {
    left: Math.max(8, Math.min(coords.left - area.left, area.width - 340)),
    top: coords.bottom - area.top + 8,
  };
}

function LinkForm({
  editor,
  draft,
  onClose,
}: {
  readonly editor: Editor;
  readonly draft: LinkDraft;
  readonly onClose: () => void;
}) {
  const [url, setUrl] = useState(draft.href);
  const [invalid, setInvalid] = useState(false);

  const save = () => {
    const href = normalizeLinkUrl(url);
    if (!href) {
      setInvalid(true);
      return;
    }
    const chain = editor.chain().focus();
    if (draft.from === draft.to) {
      // Nothing selected: the address itself becomes the link text
      chain
        .insertContentAt(draft.from, {
          type: 'text',
          text: linkLabel(href),
          marks: [{ type: 'link', attrs: { href } }],
        })
        .run();
    } else {
      chain
        .setTextSelection({ from: draft.from, to: draft.to })
        .setLink({ href })
        .run();
    }
    onClose();
  };

  return (
    <div className={styles.pop} style={positionUnder(editor, draft.from)}>
      <form
        className={styles.row}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <input
          className={styles.input}
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="Paste or type a link"
          aria-label="Link address"
          value={url}
          // Focus moves here so the address can be typed right away
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(e) => {
            setUrl(e.target.value);
            setInvalid(false);
          }}
          // Clicking anywhere else closes the box
          onBlur={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
              editor.commands.focus();
            }
          }}
        />
        <button
          className={styles.save}
          type="submit"
          onMouseDown={(e) => e.preventDefault()}
        >
          Save
        </button>
      </form>
      {invalid && (
        <p className={styles.error}>
          Enter a web address, like courses.yale.edu.
        </p>
      )}
    </div>
  );
}

const copyIcon = (
  <svg viewBox="0 0 20 20">
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M13 4.5V4a1.5 1.5 0 0 0-1.5-1.5h-7A1.5 1.5 0 0 0 3 4v7a1.5 1.5 0 0 0 1.5 1.5H5" />
  </svg>
);
const editIcon = (
  <svg viewBox="0 0 20 20">
    <path d="M12.5 4.5l3 3L7 16H4v-3z" />
    <path d="M11 6l3 3" />
  </svg>
);
const unlinkIcon = (
  <svg viewBox="0 0 20 20">
    <path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-3.2-5.9M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 3.2 5.9M3 3l14 14" />
  </svg>
);

/** Shown while the cursor is in a link: its address, Copy, Edit and Remove. */
function LinkBar({
  editor,
  href,
  onEdit,
}: {
  readonly editor: Editor;
  readonly href: string;
  readonly onEdit: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div
      className={styles.bar}
      style={positionUnder(editor, editor.state.selection.from)}
    >
      <a
        className={styles.href}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="Open link in a new tab"
        onMouseDown={keepFocus}
      >
        {linkLabel(href)}
      </a>
      <button
        type="button"
        className={clsx(styles.iconBtn, copied && styles.done)}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title={copied ? 'Link copied' : 'Copy link'}
        onMouseDown={keepFocus}
        onClick={() => {
          void navigator.clipboard.writeText(href).then(
            () => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            },
            () => setCopied(false),
          );
        }}
      >
        {copyIcon}
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Edit link"
        title="Edit link"
        onMouseDown={keepFocus}
        onClick={onEdit}
      >
        {editIcon}
      </button>
      <button
        type="button"
        className={styles.iconBtn}
        aria-label="Remove link"
        title="Remove link"
        onMouseDown={keepFocus}
        onClick={() =>
          editor.chain().focus().extendMarkRange('link').unsetLink().run()
        }
      >
        {unlinkIcon}
      </button>
    </div>
  );
}

function NoteLinkControls({
  editor,
  draft,
  onEdit,
  onClose,
}: {
  readonly editor: Editor;
  readonly draft: LinkDraft | null;
  readonly onEdit: () => void;
  readonly onClose: () => void;
}) {
  const link = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e.isFocused && e.state.selection.empty && e.isActive('link')
        ? (e.getAttributes('link').href as string | undefined)
        : undefined,
  });

  if (draft)
    return <LinkForm editor={editor} draft={draft} onClose={onClose} />;
  if (link) return <LinkBar editor={editor} href={link} onEdit={onEdit} />;
  return null;
}

export default NoteLinkControls;
