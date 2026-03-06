import { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { defaultFilters, useSearch } from '../../contexts/searchContext';
import { createSavedSearch } from '../../queries/api';
import { buildFullFilterQueryString } from '../../utilities/params';
import styles from './SaveSearchModal.module.css';

interface SaveSearchModalProps {
  readonly show: boolean;
  readonly onHide: () => void;
  readonly onSave?: () => void;
}

export default function SaveSearchModal({
  show,
  onHide,
  onSave,
}: SaveSearchModalProps) {
  const { filters } = useSearch();
  const [name, setName] = useState('');
  const [seasonSpecific, setSeasonSpecific] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    setName('');
    setSeasonSpecific(false);
    onHide();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a name for your saved search');
      return;
    }

    setIsSaving(true);

    try {
      const queryString = buildFullFilterQueryString(filters, defaultFilters, {
        excludeSeason: !seasonSpecific,
      });

      const result = await createSavedSearch(name, queryString, seasonSpecific);

      if (result) {
        toast.success('Search saved successfully!');
        handleClose();
        onSave?.();
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title className={styles.title}>Save Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Search Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Computer Science 4+"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave().catch(console.error);
                }
              }}
              maxLength={64}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Save for current season only"
              checked={seasonSpecific}
              onChange={(e) => setSeasonSpecific(e.target.checked)}
            />
            <Form.Text className="text-muted">
              {seasonSpecific
                ? 'This search will only work in the current season.'
                : 'This search can be reused in any season.'}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleSave().catch(console.error);
          }}
          disabled={isSaving || !name.trim()}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
