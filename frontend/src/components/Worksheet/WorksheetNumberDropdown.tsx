import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useWorksheet } from '../../contexts/worksheetContext';
import styles from './WorksheetNumberDropdown.module.css';

function WorksheetNumDropdown() {
  const { changeWorksheet, worksheetNumber, worksheetOptions } = useWorksheet();

  return (
    <div className="container p-0 m-0 w-mx">
      <DropdownButton
        className={styles.dropdownButton}
        variant="primary"
        title={worksheetOptions[worksheetNumber]!.label}
        onSelect={(v) => {
          if (v) changeWorksheet(Number(v));
        }}
      >
        {worksheetOptions.map(({ value, label }) => (
          <Dropdown.Item key={value} eventKey={value} className="d-flex">
            <div className="mx-auto">{label}</div>
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
}

export default WorksheetNumDropdown;
