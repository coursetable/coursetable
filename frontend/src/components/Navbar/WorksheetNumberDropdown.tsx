import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useWorksheet } from '../../contexts/worksheetContext';
import './DropdownShared.css';

function WorksheetNumDropdown() {
  const { changeWorksheet, worksheet_number, worksheet_options } = useWorksheet();

  return (
    <div className="container p-0 m-0">
      <DropdownButton
        variant="primary"
        title={
          worksheet_number === '0'
            ? 'Main Worksheet'
            : `Worksheet ${worksheet_number}`
        }
        onSelect={(worksheetNumber) => {
          if (worksheetNumber) {
            changeWorksheet(worksheetNumber);
          }
        }}
      >
        {worksheet_options.map((worksheet) => (
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
