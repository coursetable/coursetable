import { useState } from 'react';
import { Modal } from 'react-bootstrap';

import { useModalHistory } from '../../contexts/modalHistoryContext';
import { useProfModalOverviewDataQuery } from '../../queries/graphql-queries';
import { useStore } from '../../store';
import styles from './ProfModal.module.css';

function ProfModal({ professorId }: { readonly professorId: number }) {
  const user = useStore((state) => state.user);
  const { navigate, closeModal } = useModalHistory();
  const { data, loading, error } = useProfModalOverviewDataQuery({
    variables: { professorId, hasEvals: Boolean(user?.hasEvals) },
  });
  // TODO different messages
  if (!data || loading || error) {
    return (
      <div className="d-flex justify-content-center">
        <Modal
          show
          onHide={closeModal}
          dialogClassName={styles.dialog}
          animation={false}
          centered
        >
          <Modal.Body className="text-center">
            <p>Loading professor details...</p>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
  const professor = data.professors[0]!;

  return (
    <div className="d-flex justify-content-center">
      <Modal
        show
        scrollable
        onHide={closeModal}
        dialogClassName={styles.dialog}
        animation={false}
        centered
      >
        <Modal.Header className={styles.modalHeader} closeButton>
          {professor.name}
          {/* <ProfessorModalHeaderInfo
            listing={listing}
            professor={professorView}
            disableProfessorView={() => setProfessorView(null)}
            onNavigation={onNavigation}
          /> */}
        </Modal.Header>
        <Modal.Body>
          {/* <OverviewPanel
            onNavigation={onNavigation}
            prefetched={listing}
            professorView={professorView}
            setProfessorView={setProfessorView}
          /> */}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProfModal;
