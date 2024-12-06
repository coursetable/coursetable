import { useState } from 'react';
import { Modal } from 'react-bootstrap';

import { useModalHistory } from '../../contexts/modalHistoryContext';

function ProfModal() {
  const { navigate, closeModal } = useModalHistory();

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
          <ProfessorModalHeaderInfo
            listing={listing}
            professor={professorView}
            disableProfessorView={() => setProfessorView(null)}
            onNavigation={onNavigation}
          />
        </Modal.Header>
        <Modal.Body>
          <OverviewPanel
            onNavigation={onNavigation}
            prefetched={listing}
            professorView={professorView}
            setProfessorView={setProfessorView}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProfModal;
