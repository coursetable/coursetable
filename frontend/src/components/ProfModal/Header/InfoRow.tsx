import { Link } from 'react-router-dom';
import { Modal, Badge } from 'react-bootstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useModalHistory } from '../../../contexts/modalHistoryContext';
import { ratingColormap } from '../../../utilities/constants';
import { TextComponent } from '../../Typography';
import type { ProfInfo } from '../ProfModal';
import styles from './InfoRow.module.css';

export default function ModalHeaderInfo({
  professor,
}: {
  readonly professor: ProfInfo;
}) {
  const { navigate, backTarget } = useModalHistory();
  return (
    <div className={styles.modalTop}>
      {backTarget && (
        <Link
          to={backTarget}
          onClick={() => {
            navigate('pop');
          }}
          className={styles.backArrow}
        >
          <IoMdArrowRoundBack size={30} />
        </Link>
      )}
      <div>
        <Modal.Title>
          <div className={styles.modalTitle}>{professor.name}</div>
        </Modal.Title>

        <div className={styles.badges}>
          <p className={styles.courseCodes}>
            <TextComponent type="tertiary">
              {professor.email && (
                <a href={`mailto:${professor.email}`}>{professor.email}</a>
              )}{' '}
              | {professor.courses_taught} courses taught{' '}
              {professor.average_rating && (
                <Badge
                  bg="none"
                  className="mx-1 mb-1"
                  style={{
                    backgroundColor: ratingColormap(
                      professor.average_rating,
                    ).css(),
                  }}
                >
                  {professor.average_rating.toFixed(1)}
                </Badge>
              )}
            </TextComponent>
          </p>
        </div>
      </div>
    </div>
  );
}
