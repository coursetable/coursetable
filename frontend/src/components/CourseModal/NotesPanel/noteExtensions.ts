import { type Editor, Extension } from '@tiptap/react';

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
 * List buttons work on the current line and never join a neighbouring list.
 * The active kind turns the line back into text; the other kind switches it.
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
