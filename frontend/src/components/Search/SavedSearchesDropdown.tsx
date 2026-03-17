import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { MdBookmark, MdDelete, MdSave } from 'react-icons/md';
import { toast } from 'react-toastify';

import { Popout } from './Popout';
import {
  defaultFilters,
  getFilterValues,
  useSearch,
} from '../../contexts/searchContext';
import {
  fetchSavedSearches,
  deleteSavedSearch,
  createSavedSearch,
  type SavedSearch,
} from '../../queries/api';
import { buildFullFilterQueryString } from '../../utilities/params';
import Spinner from '../Spinner';
import { Input } from '../Typography';
import styles from './SavedSearchesDropdown.module.css';

interface SavedSearchesDropdownProps {
  readonly onSearchApplied?: () => void;
  readonly refreshKey?: number;
}

export default function SavedSearchesDropdown({
  onSearchApplied,
  refreshKey = 0,
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
  const [isAddingSearch, setIsAddingSearch] = useState(false);
  const [addingName, setAddingName] = useState('');
  const addInputRef = useRef<HTMLInputElement>(null);
  const { filters } = useSearch();

  useEffect(() => {
    if (isAddingSearch && addInputRef.current) addInputRef.current.focus();
  }, [isAddingSearch]);

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
  }, [isOpen, refreshKey]);

  const handleApplySearch = (search: SavedSearch) => {
    void navigate(`/catalog${search.queryString}`);
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
    <>
      <Popout
        buttonText="Saved Searches"
        Icon={<MdBookmark size={18} />}
        onOpenChange={setIsOpen}
      >
        <div className={styles.container}>
          <h3 className={styles.dropdownTitle}>Saved Searches</h3>
          <p className={styles.dropdownDescription}>
            Add a new search below, or click one to apply. Saved searches use
            the currently selected season when you apply them.
          </p>
          {isAddingSearch ? (
            <div className={styles.addInputContainer}>
              <Input
                className={styles.addInput}
                type="text"
                value={addingName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddingName(e.target.value)
                }
                placeholder="Name this search... (Enter to save)"
                maxLength={64}
                ref={addInputRef}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const name = addingName.trim();
                    if (name) {
                      const filterValues = getFilterValues(filters);
                      const queryString = buildFullFilterQueryString(
                        filterValues,
                        defaultFilters,
                        { excludeSeason: true },
                      );
                      void createSavedSearch(name, queryString).then(
                        (result) => {
                          if (result) {
                            toast.success('Search saved');
                            void loadSearches();
                          }
                        },
                      );
                    }
                    setAddingName('');
                    setIsAddingSearch(false);
                  } else if (e.key === 'Escape') {
                    setAddingName('');
                    setIsAddingSearch(false);
                  }
                }}
                onMouseDown={(e: React.MouseEvent<HTMLInputElement>) =>
                  e.stopPropagation()
                }
                onBlur={() => {
                  if (addingName.trim()) {
                    const filterValues = getFilterValues(filters);
                    const queryString = buildFullFilterQueryString(
                      filterValues,
                      defaultFilters,
                      { excludeSeason: true },
                    );
                    void createSavedSearch(addingName.trim(), queryString).then(
                      (result) => {
                        if (result) {
                          toast.success('Search saved');
                          void loadSearches();
                        }
                      },
                    );
                  }
                  setAddingName('');
                  setIsAddingSearch(false);
                }}
              />
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className={styles.saveButton}
              onClick={() => setIsAddingSearch(true)}
              title="Save current search"
            >
              <MdSave size={16} />
              Save current search
            </Button>
          )}
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
                  </div>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={(e) =>
                      handleDeleteClick(e, search.id, search.name)
                    }
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
      </Popout>
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
    </>
  );
}
