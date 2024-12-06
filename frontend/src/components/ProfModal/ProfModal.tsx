import { Modal } from 'react-bootstrap';

import ModalHeaderInfo from './Header/InfoRow';

import { useModalHistory } from '../../contexts/modalHistoryContext';
import type { ProfModalOverviewDataQuery } from '../../generated/graphql-types';
import { useProfModalOverviewDataQuery } from '../../queries/graphql-queries';
import { useStore } from '../../store';
import { suspended } from '../../utilities/display';
import styles from './ProfModal.module.css';

export type ProfInfo = ProfModalOverviewDataQuery['professors'][0];

const OverviewPanel = suspended(() => import('./OverviewPanel/OverviewPanel'));

function ProfModal({ professorId }: { readonly professorId: number }) {
  const user = useStore((state) => state.user);
  const { closeModal } = useModalHistory();
  const { data } = useProfModalOverviewDataQuery({
    variables: { professorId, hasEvals: Boolean(user?.hasEvals) },
  });
  // TODO different messages for loading/error
  if (!data || data.professors.length === 0) {
    return (
      <div className="d-flex justify-content-center">
        <Modal
          show
          onHide={closeModal}
          dialogClassName={styles.dialog}
          animation={false}
          centered
        >
          <Modal.Header className={styles.modalHeader} closeButton />
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
          <ModalHeaderInfo professor={professor} />
        </Modal.Header>
        <Modal.Body>
          <OverviewPanel professor={professor} />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProfModal;
