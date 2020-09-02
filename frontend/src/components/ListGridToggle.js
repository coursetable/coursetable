import React from 'react';
import styles from './ListGridToggle.module.css';
import { FaBars, FaTh } from 'react-icons/fa';

/**
 * Toggle button between List and Grid view
 * @prop isList - boolean that holds current view
 * @prop setView - function to switch views
 */

const ListGridToggle = ({ isList, setView }) => {
  return (
    <div
      className={styles.btn_container + ' d-flex ml-auto my-auto'}
      onClick={() => setView(!isList)}
    >
      {!isList ? (
        <FaBars className={styles.btn + ' m-auto'} size={15} />
      ) : (
        <FaTh className={styles.btn + ' m-auto'} size={15} />
      )}
    </div>
  );
};

export default ListGridToggle;
