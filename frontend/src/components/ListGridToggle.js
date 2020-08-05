import React from 'react';
import styles from './ListGridToggle.module.css';
import { Row, Col } from 'react-bootstrap';
import { FaBars, FaTh } from 'react-icons/fa';

const ListGridToggle = (props) => {
  return (
    <div
      className={styles.btn_container + ' d-flex ml-auto my-auto'}
      onClick={() => props.setView(!props.isList)}
    >
      {!props.isList ? (
        <FaBars className={styles.btn + ' m-auto'} size={15} />
      ) : (
        <FaTh className={styles.btn + ' m-auto'} size={15} />
      )}
    </div>
  );
};

export default ListGridToggle;
