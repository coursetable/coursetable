import React, { useMemo } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useWorksheet } from '../../contexts/worksheetContext';
import './DropdownShared.css';

function WorksheetNumDropdown() {
  const { changeWorksheet, worksheet_number } = useWorksheet();

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

  const WorksheetDropdownItem = ({
    worksheetNumber,
  }: {
    worksheetNumber: string;
  }) => {
    let text: string;
    if (worksheetNumber === '0') {
      text = 'Main Worksheet';
    } else {
      text = `Worksheet ${worksheetNumber}`;
    }
    return (
      <Dropdown.Item
        key={worksheetNumber}
        eventKey={worksheetNumber}
        className="d-flex"
        // Styling if this is the current person
      >
        <div className="mx-auto">{text}</div>
      </Dropdown.Item>
    );
  };

  // worksheet drop down
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
        {worksheetOptions.map((worksheet) => (
          <WorksheetDropdownItem worksheetNumber={worksheet.value} />
        ))}
      </DropdownButton>
    </div>
  );
}

export default WorksheetNumDropdown;
