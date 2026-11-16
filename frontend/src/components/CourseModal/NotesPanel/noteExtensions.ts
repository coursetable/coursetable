import { BulletList } from '@tiptap/extension-list';
import type { Mark } from '@tiptap/pm/model';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { type Editor, Extension, wrappingInputRule } from '@tiptap/react';

import { DEFAULT_FONT_SIZE } from './noteContent';

// Runs before the normal undo, so it only removes the latest auto-conversion
export const NoteShortcuts = Extension.create({
  name: 'noteShortcuts',
  priority: 1000,
  addKeyboardShortcuts() {
    return {
      'Mod-z': () => this.editor.commands.undoInputRule(),
      'Mod-Shift-x': () => this.editor.commands.toggleStrike(),
    };
  },
});

/**
 * Typing "- " makes a dashed list and "* " a bullet list. Neither joins a list
 * just above, so a new list always starts on its own.
 */
export const DashableBulletList = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      dashed: {
        default: false,
        parseHTML: (element) => element.classList.contains('dashed'),
        renderHTML: (attributes) =>
          attributes.dashed ? { class: 'dashed' } : {},
      },
    };
  },
  addInputRules() {
    return [
      wrappingInputRule({
        find: /^\s*-\s$/u,
        type: this.type,
        getAttributes: () => ({ dashed: true }),
        joinPredicate: () => false,
      }),
      wrappingInputRule({
        find: /^\s*[*+]\s$/u,
        type: this.type,
        joinPredicate: () => false,
      }),
    ];
  },
});

// The browser hides a selection when focus moves to the toolbar's size box, so
// it is painted as a decoration until the editor has focus again
const keptSelectionKey = new PluginKey<DecorationSet>('keptSelection');
export const KeepSelectionVisible = Extension.create({
  name: 'keepSelectionVisible',
  addProseMirrorPlugins() {
    return [
      new Plugin<DecorationSet>({
        key: keptSelectionKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, set) {
            const next = tr.getMeta(keptSelectionKey) as
              | DecorationSet
              | undefined;
            return next ?? set.map(tr.mapping, tr.doc);
          },
        },
        props: {
          decorations: (state) => keptSelectionKey.getState(state),
        },
      }),
    ];
  },
  onBlur() {
    const { state, view } = this.editor;
    const { from, to, empty } = state.selection;
    const set = empty
      ? DecorationSet.empty
      : DecorationSet.create(state.doc, [
          Decoration.inline(from, to, { class: 'kept-selection' }),
        ]);
    view.dispatch(state.tr.setMeta(keptSelectionKey, set));
  },
  onFocus() {
    const { state, view } = this.editor;
    view.dispatch(state.tr.setMeta(keptSelectionKey, DecorationSet.empty));
  },
});

/**
 * A click on a bullet, number or the space beside it puts the cursor at the end
 * of that line, as in Google Docs, instead of before its first letter.
 */
export const ListMarkerClick = Extension.create({
  name: 'listMarkerClick',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            mousedown(view, event) {
              const target = event.target as HTMLElement;
              if (event.button !== 0 || event.shiftKey) return false;
              if (!['LI', 'UL', 'OL'].includes(target.tagName)) return false;
              // The innermost item line at the clicked height, left of its text
              const line = [...view.dom.querySelectorAll('li > p')]
                .filter((p) => {
                  const r = p.getBoundingClientRect();
                  return (
                    event.clientY >= r.top &&
                    event.clientY <= r.bottom &&
                    event.clientX < r.left
                  );
                })
                .at(-1);
              if (!line) return false;
              event.preventDefault();
              const start = view.posAtDOM(line, 0);
              const end =
                start + view.state.doc.resolve(start).parent.content.size;
              view.focus();
              view.dispatch(
                view.state.tr.setSelection(
                  TextSelection.create(view.state.doc, end),
                ),
              );
              return true;
            },
          },
        },
      }),
    ];
  },
});

/**
 * List buttons work on the current line and never join a neighbouring list.
 * The active kind turns the line back into text; the other kind switches the
 * list; the bullet button turns a dashed list into bullets.
 */
export function toggleNoteList(
  editor: Editor,
  kind: 'bulletList' | 'orderedList',
) {
  const { $from } = editor.state.selection;
  for (let { depth } = $from; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name !== 'bulletList' && node.type.name !== 'orderedList')
      continue;
    const pos = $from.before(depth);
    if (kind === 'bulletList' && node.attrs.dashed) {
      return editor
        .chain()
        .focus()
        .command(({ tr }) => {
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, dashed: false });
          return true;
        })
        .run();
    }
    if (node.type.name === kind)
      return editor.chain().focus().liftListItem('listItem').run();
    return editor
      .chain()
      .focus()
      .command(({ tr }) => {
        tr.setNodeMarkup(pos, editor.schema.nodes[kind]);
        return true;
      })
      .run();
  }
  return editor.chain().focus().wrapInList(kind).run();
}

function sizeOf(marks: readonly Mark[]) {
  const size = marks.find((mark) => mark.type.name === 'textStyle')?.attrs
    .fontSize as string | undefined;
  return size ? Math.round(parseFloat(size)) : DEFAULT_FONT_SIZE;
}

/** The size at the cursor, or null when the selection mixes sizes. */
export function selectedFontSize(editor: Editor): number | null {
  const { state } = editor;
  const { from, to, empty, $from } = state.selection;
  if (empty) return sizeOf(state.storedMarks ?? $from.marks());
  const sizes = new Set<number>();
  state.doc.nodesBetween(from, to, (node) => {
    if (node.isText) sizes.add(sizeOf(node.marks));
  });
  return sizes.size === 1 ? [...sizes][0]! : null;
}
