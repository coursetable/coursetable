import { DropdownButton, Dropdown } from 'react-bootstrap';
import type { Option } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import styles from './WorksheetNumberDropdown.module.css';

function WorksheetNumDropdownDesktop() {
  const { changeWorksheet, worksheetNumber, worksheetOptions } = useWorksheet();

  return (
    <Popout
      buttonText="Worksheet"
      displayOptionLabel
      selectedOptions={worksheetOptions[worksheetNumber]}
      clearIcon={false}
    >
      <PopoutSelect<Option<number>, false>
        value={worksheetOptions[worksheetNumber]}
        options={worksheetOptions}
        onChange={(selectedOption) => {
          changeWorksheet(selectedOption!.value);
        }}
        showControl={false}
        minWidth={200}
      />
    </Popout>
  );
}

function WorksheetNumDropdownMobile() {
  const { changeWorksheet, worksheetNumber, worksheetOptions } = useWorksheet();

  return (
    <DropdownButton
      className={styles.dropdownButton}
      variant="primary"
      title={worksheetOptions[worksheetNumber]!.label}
      onSelect={(v) => {
        if (v) changeWorksheet(Number(v));
      }}
    >
      {worksheetOptions.map(({ value, label }) => (
        <Dropdown.Item
          key={value}
          eventKey={value}
          className="d-flex"
          // Styling if this is the current number
          style={{
            backgroundColor:
              value === worksheetNumber ? 'var(--color-primary)' : '',
          }}
        >
          <div className="mx-auto">{label}</div>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

function WorksheetNumDropdown({ mobile }: { readonly mobile: boolean }) {
  return mobile ? (
    <WorksheetNumDropdownMobile />
  ) : (
    <WorksheetNumDropdownDesktop />
  );
}

export default WorksheetNumDropdown;
