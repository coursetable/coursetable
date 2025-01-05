import { DropdownButton, Dropdown } from 'react-bootstrap';
import type { Option } from '../../contexts/searchContext';
import {
  useWorksheet,
  useWorksheetNumberOptions,
} from '../../contexts/worksheetContext';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import styles from './WorksheetNumberDropdown.module.css';

function WorksheetNumDropdownDesktop({
  options,
}: {
  readonly options: { [worksheetNumber: number]: Option<number> };
}) {
  const { changeViewedWorksheetNumber, viewedWorksheetNumber } = useWorksheet();

  return (
    <Popout
      buttonText="Worksheet"
      displayOptionLabel
      selectedOptions={options[viewedWorksheetNumber]}
      clearIcon={false}
    >
      <PopoutSelect<Option<number>, false>
        value={options[viewedWorksheetNumber]}
        options={Object.values(options)}
        onChange={(selectedOption) => {
          changeViewedWorksheetNumber(selectedOption!.value);
        }}
        showControl={false}
        minWidth={200}
      />
    </Popout>
  );
}

function WorksheetNumDropdownMobile({
  options,
}: {
  readonly options: { [worksheetNumber: number]: Option<number> };
}) {
  const { changeViewedWorksheetNumber, viewedWorksheetNumber } = useWorksheet();

  return (
    <DropdownButton
      className={styles.dropdownButton}
      variant="primary"
      title={options[viewedWorksheetNumber]!.label}
      onSelect={(v) => {
        if (v) changeViewedWorksheetNumber(Number(v));
      }}
    >
      {Object.values(options).map(({ value, label }) => (
        <Dropdown.Item
          key={value}
          eventKey={value}
          className="d-flex"
          // Styling if this is the current number
          style={{
            backgroundColor:
              value === viewedWorksheetNumber ? 'var(--color-primary)' : '',
          }}
        >
          <div className="mx-auto">{label}</div>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

function WorksheetNumDropdown({ mobile }: { readonly mobile: boolean }) {
  const { viewedSeason, viewedPerson } = useWorksheet();
  const options = useWorksheetNumberOptions(viewedPerson, viewedSeason);
  return mobile ? (
    <WorksheetNumDropdownMobile options={options} />
  ) : (
    <WorksheetNumDropdownDesktop options={options} />
  );
}

export default WorksheetNumDropdown;
