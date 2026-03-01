import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { MdBookmark, MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

import { Popout } from './Popout';
import {
  fetchSavedSearches,
  deleteSavedSearch,
  type SavedSearch,
} from '../../queries/api';
import Spinner from '../Spinner';
import styles from './SavedSearchesDropdown.module.css';

interface SavedSearchesDropdownProps {
  readonly onSearchApplied?: () => void;
}

export default function SavedSearchesDropdown({
  onSearchApplied,
}: SavedSearchesDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const loadSearches = async () => {
    setIsLoading(true);
    try {
      const result = await fetchSavedSearches();
      if (result) setSearches(result.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) void loadSearches();
  }, [isOpen]);

  const handleApplySearch = (search: SavedSearch) => {
    navigate(`/catalog${search.queryString}`);
    setIsOpen(false);
    onSearchApplied?.();
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    searchId: number,
    searchName: string,
  ) => {
    e.stopPropagation();
    setDeleteConfirm({ id: searchId, name: searchName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const { id } = deleteConfirm;
    setDeleteConfirm(null);
    setDeletingId(id);
    try {
      const success = await deleteSavedSearch(id);
      if (success) {
        toast.success('Saved search deleted');
        setSearches((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Popout
      title="Saved Searches"
      icon={<MdBookmark size={18} />}
      open={isOpen}
      setOpen={setIsOpen}
    >
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loading}>
            <Spinner message="Loading saved searches..." />
          </div>
        ) : searches.length === 0 ? (
          <div className={styles.empty}>
            <p>No saved searches yet.</p>
            <p className={styles.emptyHint}>
              Save a search to quickly return to it later!
            </p>
          </div>
        ) : (
          <div className={styles.searchList}>
            {searches.map((search) => (
              <button
                key={search.id}
                type="button"
                className={styles.searchItem}
                onClick={() => handleApplySearch(search)}
              >
                <div className={styles.searchInfo}>
                  <div className={styles.searchName}>{search.name}</div>
                  {search.seasonSpecific && (
                    <div className={styles.searchBadge}>Season-specific</div>
                  )}
                </div>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteClick(e, search.id, search.name)}
                  disabled={deletingId === search.id}
                  title="Delete saved search"
                  aria-label={`Delete ${search.name}`}
                >
                  {deletingId === search.id ? (
                    <Spinner className={styles.spinner} message={undefined} />
                  ) : (
                    <MdDelete size={18} />
                  )}
                </button>
              </button>
            ))}
          </div>
        )}
      </div>
      <Modal
        show={deleteConfirm !== null}
        onHide={() => setDeleteConfirm(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete saved search?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteConfirm && (
            <>
              Are you sure you want to delete &quot;{deleteConfirm.name}&quot;?
              This cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteConfirm().catch(console.error)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Popout>
  );
}
