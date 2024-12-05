import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { IoMdArrowRoundBack } from 'react-icons/io';
import type { CourseModalPrefetchListingDataFragment } from '../../../generated/graphql-types';
import { extraInfo } from '../../../utilities/constants';
import { TextComponent } from '../../Typography';
import type { ModalNavigationFunction } from '../CourseModal';
import type { CourseInfo } from '../OverviewPanel/OverviewInfo';
import styles from './ProfessorInfoRow.module.css';

export default function ProfessorModalHeaderInfo({
  listing,
  professor,
  disableProfessorView,
  onNavigation,
}: {
  readonly listing: CourseModalPrefetchListingDataFragment;
  readonly professor:
    | CourseInfo['course_professors'][number]['professor']
    | null;
  readonly disableProfessorView: () => void;
  readonly onNavigation: ModalNavigationFunction;
}) {
  return (
    <div className={styles.modalTop}>
      <Link
        to="#"
        onClick={(e) => {
          e.preventDefault();
          // SetSearchParams((prev) => {
          //   prev.delete('prof');
          //   return prev;
          // });
          disableProfessorView();
        }}
        className={styles.backArrow}
      >
        <IoMdArrowRoundBack size={30} />
      </Link>
      <div>
        <Modal.Title>
          <div className={styles.modalTitle}>
            {listing.course.extra_info !== 'ACTIVE' ? (
              <span className={styles.cancelledText}>
                {extraInfo[listing.course.extra_info]}{' '}
              </span>
            ) : (
              ''
            )}
            {professor?.name}
          </div>
        </Modal.Title>

        <div className={styles.badges}>
          <p className={styles.courseCodes}>
            <TextComponent type="tertiary">
              Professor |{' '}
              <a href={`mailto:${professor?.email}`}>{professor?.email}</a>
            </TextComponent>
          </p>
        </div>
      </div>
    </div>
  );
}
