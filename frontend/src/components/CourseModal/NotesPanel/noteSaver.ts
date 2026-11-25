import debounce from 'lodash.debounce';

export type NoteSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

let pending: Promise<void> = Promise.resolve();

export function whenNotesSaved() {
  return pending;
}

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
  let queue: Promise<void> = Promise.resolve();

  const saveLatest = async () => {
    const content = latestContent;
    onStatusChange('saving');
    const succeeded = await save(content).catch(() => false);
    if (succeeded) savedContent = content;
    onStatusChange(succeeded ? 'saved' : 'error');
  };

  const enqueue = () => {
    if (latestContent === savedContent) {
      onStatusChange('saved');
      return;
    }
    queue = queue.then(saveLatest);
    pending = Promise.allSettled([pending, queue]).then(() => undefined);
  };

  const debouncedSave = debounce(enqueue, delay);

  return {
    setBaseline(content: string) {
      latestContent = content;
      savedContent = content;
    },
    update(content: string) {
      latestContent = content;
      debouncedSave();
    },
    flush() {
      debouncedSave.cancel();
      enqueue();
    },
  };
}
