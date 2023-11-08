import React, { useMemo } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { NetId } from '../../utilities/common';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import './DropdownShared.css';

/**
 * Render FB Dropdown in mobile view.
 *
 * We include every friend in this list, even if they haven't selected
 * any classes in this season. In the list, we include the number of
 * listings they have in their worksheet in the given semester.
 */
function WorksheetNumDropdown() {
  // Fetch user context data
  const { user } = useUser();

  const { changeWorksheet, worksheet_number } = useWorksheet();

  // Generate list of possible worksheets
  const worksheet_options = useMemo(() => {
    const worksheet_options_temp = [
      { value: '0', label: 'Main Worksheet' },
      { value: '1', label: 'Worksheet 1' },
      { value: '2', label: 'Worksheet 2' },
      { value: '3', label: 'Worksheet 3' },
    ];
    return worksheet_options_temp;
  }, []);

  // worksheet drop downItem
  const WorksheetDropdownItem = ({
    worksheet_number,
  }: {
    worksheet_number: string;
  }) => {
    let text: string;
    if (worksheet_number === '0') {
      text = 'Main Worksheet';
    } else {
      text = `Worksheet ${worksheet_number}`;
    }
    return (
      <Dropdown.Item
        key={worksheet_number}
        eventKey={worksheet_number}
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
        onSelect={(worksheet_number) => {
          if (worksheet_number) {
            changeWorksheet(worksheet_number);
          }
        }}
      >
        {worksheet_options.map((worksheet) => (
          <WorksheetDropdownItem worksheet_number={worksheet.value} />
        ))}
      </DropdownButton>
    </div>
  );
}

export default WorksheetNumDropdown;
