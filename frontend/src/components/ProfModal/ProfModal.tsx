import { Modal } from 'react-bootstrap';

import ModalHeaderInfo from './Header/InfoRow';

import { useModalHistory } from '../../contexts/modalHistoryContext';
import type { ProfModalOverviewDataQuery } from '../../generated/graphql-types';
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
  const { data, loading, error } = useProfModalOverviewDataQuery({
    variables: { professorId, hasEvals: Boolean(user?.hasEvals) },
  });
  const professor = data?.professors[0];

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
          {professor && <ModalHeaderInfo professor={professor} />}
        </Modal.Header>
        <Modal.Body>
          {professor ? (
            <OverviewPanel professor={professor} />
          ) : loading ? (
            <Spinner message="Loading professor data..." />
          ) : error ? (
            <div>Error loading professor data: {error.message}</div>
          ) : null}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProfModal;
