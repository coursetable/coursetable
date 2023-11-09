import React, { useMemo } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useWorksheet } from '../../contexts/worksheetContext';
import './DropdownShared.css';

function WorksheetNumDropdown() {
  const { changeWorksheet, worksheetNumber } = useWorksheet();

  // Generate list of possible worksheets
  const worksheetOptions = useMemo(() => {
    const tempWorksheetOptions = [
      { value: '0', label: 'Main Worksheet' },
      { value: '1', label: 'Worksheet 1' },
      { value: '2', label: 'Worksheet 2' },
      { value: '3', label: 'Worksheet 3' },
    ];
    return tempWorksheetOptions;
  }, []);

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={
          worksheetNumber === '0'
            ? 'Main Worksheet'
            : `Worksheet ${worksheetNumber}`
        }
        onSelect={(n) => {
          if (n) {
            changeWorksheet(n);
          }
        }}
      >
        {worksheetOptions.map((worksheet) => (
          <Dropdown.Item
            key={worksheet.value}
            eventKey={worksheet.value}
            className="d-flex"
          >
            <div className="mx-auto">{worksheet.label}</div>
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
}

export default WorksheetNumDropdown;
