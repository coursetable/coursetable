import { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { updateWorksheetMetadata } from '../../queries/api';
import type { Season } from '../../queries/graphql-types';
import { useStore } from '../../store';
import {
  personalBlockSchema,
  personalBlocksSchema,
  type PersonalBlock,
} from '../../utilities/personalBlock';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

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
        { ...validation.data, updatedAt: new Date().toISOString() },
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
              <div className="d-flex flex-wrap gap-3">
                {WEEKDAYS.map((day, index) => {
                  const value = index + 1;
                  return (
                    <Form.Check
                      key={day}
                      inline
                      type="checkbox"
                      id={`commitment-day-${value}`}
                      label={day.slice(0, 3)}
                      className="m-0"
                      checked={draft.days.includes(value)}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          days: event.target.checked
                            ? [...draft.days, value]
                            : draft.days.filter((d) => d !== value),
                        })
                      }
                    />
                  );
                })}
              </div>
            </fieldset>
            <Row className="mb-3">
              {(['start', 'end'] as const).map((field) => (
                <Form.Group
                  key={field}
                  as={Col}
                  xs={6}
                  controlId={`commitment-${field}`}
                >
                  <Form.Label>
                    {field === 'start' ? 'Start time' : 'End time'}
                  </Form.Label>
                  <Form.Control
                    type="time"
                    required
                    value={draft[field]}
                    onChange={(event) =>
                      setDraft({ ...draft, [field]: event.target.value })
                    }
                  />
                </Form.Group>
              ))}
              {draft.end <= draft.start && (
                <Form.Text className="text-danger">
                  End time must be after start time.
                </Form.Text>
              )}
            </Row>
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
