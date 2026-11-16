import debounce from 'lodash.debounce';

export type NoteSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * Debounces note saves and runs one at a time. If the note changes while a save
 * is running, the newest content is saved next.
 */
export function createNoteSaver({
  initialContent,
  save,
  onStatusChange,
  delay = 500,
}: {
  initialContent: string;
  save: (content: string) => Promise<boolean>;
  onStatusChange: (status: NoteSaveStatus) => void;
  delay?: number;
}) {
  let latestContent = initialContent;
  let savedContent = initialContent;
  let isSaving = false;

  const saveLatest = async () => {
    if (isSaving) return;
    if (latestContent === savedContent) {
      onStatusChange('saved');
      return;
    }
    isSaving = true;
    onStatusChange('saving');
    const content = latestContent;
    const succeeded = await save(content).catch(() => false);
    isSaving = false;
    if (succeeded) savedContent = content;
    if (latestContent !== content) await saveLatest();
    else onStatusChange(succeeded ? 'saved' : 'error');
  };

  const debouncedSave = debounce(() => {
    void saveLatest();
  }, delay);

  return {
    update(content: string) {
      latestContent = content;
      debouncedSave();
    },
    flush() {
      debouncedSave.flush();
    },
  };
}
