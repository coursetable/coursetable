import { Modal } from 'react-bootstrap';

import ModalHeaderInfo from './Header/InfoRow';
import type { ProfModalOverviewDataQuery } from '../../generated/graphql-types';
import { useModalHistory } from '../../hooks/useModalHistory';
import { useProfModalOverviewDataQuery } from '../../queries/graphql-queries';
import { useStore } from '../../store';
import { suspended } from '../../utilities/display';
import Spinner from '../Spinner';
import styles from './ProfModal.module.css';

export type ProfInfo = ProfModalOverviewDataQuery['professors'][0];

const OverviewPanel = suspended(() => import('./OverviewPanel/OverviewPanel'));

function ProfModal({ professorId }: { readonly professorId: number }) {
  const user = useStore((state) => state.user);
  const { closeModal } = useModalHistory();
  const validId = Number.isFinite(professorId);
  const { data, loading, error } = useProfModalOverviewDataQuery({
    variables: { professorId, hasEvals: Boolean(user?.hasEvals) },
    skip: !validId,
  });
  const professor = data?.professors[0];
  const awaitingFirstResult = loading && data === undefined;

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
          {professor ? <ModalHeaderInfo professor={professor} /> : null}
        </Modal.Header>
        <Modal.Body>
          {!validId ? (
            <p className="m-3 text-muted">This professor link is not valid.</p>
          ) : professor ? (
            <OverviewPanel professor={professor} />
          ) : awaitingFirstResult ? (
            <Spinner message="Loading professor data..." />
          ) : error ? (
            <div>Error loading professor data: {error.message}</div>
          ) : (
            <p className="m-3 text-muted">No professor was found.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProfModal;
