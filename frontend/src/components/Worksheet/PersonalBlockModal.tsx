import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { updateWorksheetMetadata } from '../../queries/api';
import type { Season } from '../../queries/graphql-types';
import { useStore } from '../../store';
import {
  personalBlockSchema,
  personalBlocksSchema,
  type PersonalBlock,
} from '../../utilities/personalBlock';

function PersonalBlockModal({
  block,
  blocks,
  season,
  worksheetNumber,
  onClose,
}: {
  readonly block?: PersonalBlock;
  readonly blocks: PersonalBlock[];
  readonly season: Season;
  readonly worksheetNumber: number;
  readonly onClose: () => void;
}) {
  const [draft, setDraft] = useState<PersonalBlock>(
    () =>
      block ?? {
        id: crypto.randomUUID(),
        title: '',
        days: [],
        start: '15:00',
        end: '16:00',
      },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const validation = personalBlockSchema.safeParse(draft);

  const updateBlocks = async (action: 'save' | 'delete') => {
    if (saving) return;

    let personalBlocks = blocks.filter((item) => item.id !== draft.id);
    if (action === 'save') {
      if (!validation.success) return;
      const blocksValidation = personalBlocksSchema.safeParse([
        ...personalBlocks,
        validation.data,
      ]);
      if (!blocksValidation.success) {
        setError(
          blocksValidation.error.issues[0]?.message ?? 'Invalid commitment.',
        );
        return;
      }
      personalBlocks = blocksValidation.data;
    }

    setSaving(true);
    setError('');
    try {
      const saved = await updateWorksheetMetadata({
        action: 'setPersonalBlocks',
        season,
        worksheetNumber,
        personalBlocks,
      });
      if (!saved) throw new Error('Commitment update failed');
      await worksheetsRefresh();
      onClose();
    } catch {
      setError('Could not save your commitment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      show
      onHide={() => {
        if (!saving) onClose();
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {block ? 'Edit commitment' : 'Add commitment'}
        </Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          void updateBlocks('save');
        }}
      >
        <Modal.Body>
          <fieldset disabled={saving}>
            <Form.Group controlId="commitment-title" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                maxLength={100}
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
              />
            </Form.Group>
            <fieldset className="mb-3">
              <legend className="fs-6">Weekdays</legend>
              <div className="d-flex gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(
                  (day, index) => (
                    <Button
                      key={day}
                      type="button"
                      variant={
                        draft.days.includes(index + 1)
                          ? 'primary'
                          : 'outline-primary'
                      }
                      className="rounded-circle p-0 flex-shrink-0"
                      style={{
                        width: 44,
                        height: 44,
                        color: draft.days.includes(index + 1)
                          ? 'var(--color-text-dark)'
                          : 'var(--color-text)',
                        backgroundColor: draft.days.includes(index + 1)
                          ? 'var(--color-primary)'
                          : 'var(--color-surface)',
                        border: '1px solid var(--color-primary)',
                      }}
                      aria-label={day}
                      aria-pressed={draft.days.includes(index + 1)}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          days: draft.days.includes(index + 1)
                            ? draft.days.filter((value) => value !== index + 1)
                            : [...draft.days, index + 1],
                        })
                      }
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ),
                )}
              </div>
            </fieldset>
            <Form.Group controlId="commitment-start" className="mb-3">
              <Form.Label>Start time</Form.Label>
              <Form.Control
                type="time"
                required
                value={draft.start}
                onChange={(event) =>
                  setDraft({ ...draft, start: event.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="commitment-end" className="mb-3">
              <Form.Label>End time</Form.Label>
              <Form.Control
                type="time"
                required
                value={draft.end}
                onChange={(event) =>
                  setDraft({ ...draft, end: event.target.value })
                }
              />
              {draft.end <= draft.start && (
                <Form.Text className="text-danger">
                  End time must be after start time.
                </Form.Text>
              )}
            </Form.Group>
          </fieldset>
          {error && (
            <p role="alert" className="text-danger mt-3">
              {error}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {block && (
            <Button
              variant="danger"
              disabled={saving}
              onClick={() => {
                void updateBlocks('delete');
              }}
            >
              Delete
            </Button>
          )}
          <Button variant="secondary" disabled={saving} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || !validation.success}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default PersonalBlockModal;
