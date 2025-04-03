import { Link, useSearchParams } from 'react-router-dom';
import { Modal, Badge } from 'react-bootstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';

import { useStore } from '../../../store';
import { ratingColormap } from '../../../utilities/constants';
import { TextComponent } from '../../Typography';
import type { ProfInfo } from '../ProfModal';
import styles from './InfoRow.module.css';

export default function ModalHeaderInfo({
  professor,
}: {
  readonly professor: ProfInfo;
}) {
  const [searchParams] = useSearchParams();
  const { backTarget, navigate } = useStore((state) => ({
    backTarget: state.backTarget,
    navigate: state.navigate,
  }));
  return (
    <div className={styles.modalTop}>
      {backTarget && (
        <Link
          to={backTarget}
          onClick={() => {
            navigate('pop', undefined, searchParams);
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
                    color: 'var(--color-text-dark)',
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
