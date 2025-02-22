 
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { updateWorksheetCourses } from '../../queries/api';
import { useWorksheetNumberOptions } from '../../slices/WorksheetSlice';
import { useStore } from '../../store';

// Import styles from './CalendarEvent.module.css';
import type { RBCEvent } from '../../utilities/calendar';

interface WorksheetMoveDropdownProps {
  readonly event: RBCEvent;
}

export function WorksheetMoveDropdown({ event }: WorksheetMoveDropdownProps) {
  const { viewedSeason, viewedWorksheetNumber, worksheetsRefresh } = useStore(
    (state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      worksheetsRefresh: state.worksheetsRefresh,
    }),
  );

  // Get worksheet options and filter out the current one.
  const options = useWorksheetNumberOptions('me', viewedSeason);
  const filteredOptions = Object.values(options).filter(
    (option) => option.value !== viewedWorksheetNumber,
  );

  const handleSelect = async (worksheetKey: string | null) => {
    if (!worksheetKey) return;
    const newWorksheetNumber = Number(worksheetKey);

    // Remove the course from its current worksheet.
    await updateWorksheetCourses({
      action: 'remove',
      season: viewedSeason,
      crn: event.listing.crn,
      worksheetNumber: viewedWorksheetNumber,
    });

    // Add the course to the new worksheet.
    const addResult = await updateWorksheetCourses({
      action: 'add',
      season: viewedSeason,
      crn: event.listing.crn,
      worksheetNumber: newWorksheetNumber,
      color: event.color,
      hidden: false,
    });

    if (addResult) {
      console.log(`Course moved to worksheet ${newWorksheetNumber}`);
      // Update the UI real-time!
      worksheetsRefresh();
    }
  };

  return (
    <DropdownButton
      title="Move"
      onClick={(e) => {
        // Prevents opening the modal for the actual course
        e.stopPropagation();
      }}
      onSelect={handleSelect}
      //   ClassName={styles.worksheetMoveDropdown}
      variant="secondary"
      size="sm"
    >
      {filteredOptions.map(({ value, label }) => (
        <Dropdown.Item key={value} eventKey={String(value)}>
          {label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
