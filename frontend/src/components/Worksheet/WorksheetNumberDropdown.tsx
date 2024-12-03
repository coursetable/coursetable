import { DropdownButton, Dropdown } from 'react-bootstrap';
import type { Option } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import styles from './WorksheetNumberDropdown.module.css';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { components } from 'react-select';
import { useStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import { Input } from '../Typography';

type WorksheetOption = Option<number | 'add'>;

function WorksheetNumDropdownDesktop() {
  const { worksheetsRefresh, addWorksheet, deleteWorksheet, renameWorksheet } = useStore(
    useShallow((state) => ({
      worksheetsRefresh: state.worksheetsRefresh,
      addWorksheet: state.addWorksheet,
      deleteWorksheet: state.deleteWorksheet,
      renameWorksheet: state.renameWorksheet,
    })),
  );

  const [isAddingWorksheet, setIsAddingWorksheet] = useState(false);
  const [inputField, setInputField] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState(0);

  const {
    changeViewedWorksheetNumber,
    viewedWorksheetNumber,
    worksheetOptions,
    viewedSeason,
  } = useWorksheet();

  const modifiedWorksheetOptions: WorksheetOption[] = useMemo(() => [
    ...worksheetOptions,
    { value: 'add', label: '+' },
  ], [worksheetOptions]);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.setSelectionRange(cursorPos, cursorPos);
  }, [inputField]);

  const CustomOption = (props: any) => {
    const { data, innerProps } = props;

    if (data.value === 'add' && isAddingWorksheet) {
      return (
        <div
          {...innerProps}
          className={clsx(props.className, styles.optionInputContainer)}
        >
          <Input
            className={styles.optionInput}
            type="text"
            value={inputField}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const selectionStart = e.target.selectionStart;
              if (selectionStart) setCursorPos(selectionStart);
              setInputField(e.target.value);
            }}
            onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => {
              e.stopPropagation();
              if (e.key === 'Enter') {
                e.preventDefault();
                await addWorksheet(viewedSeason, inputField.trim() || 'New Worksheet');
                await worksheetsRefresh();
                setIsAddingWorksheet(false);
                setInputField('');
              } else if (e.key === 'Escape') {
                setIsAddingWorksheet(false);
                setInputField('');
              }
            }}
            onMouseDown={(e: React.MouseEvent<HTMLInputElement>) => {
              e.stopPropagation();
            }}
            onBlur={() => {
              setIsAddingWorksheet(false);
              setInputField('');
            }}
            placeholder="Hit Enter to save"
            ref={inputRef}
            maxLength={64}
            autoFocus
          />
        </div>
      );
    } else {
      return <components.Option {...props} />;
    }
  };

  return (
    <Popout
      buttonText="Worksheet"
      displayOptionLabel
      selectedOptions={worksheetOptions[viewedWorksheetNumber]}
      clearIcon={false}
    >
      <PopoutSelect<WorksheetOption, false>
        value={worksheetOptions[viewedWorksheetNumber]}
        options={modifiedWorksheetOptions}
        onChange={(selectedOption) => {
          if (selectedOption!.value === 'add') {
            setIsAddingWorksheet(true);
          } else {
            changeViewedWorksheetNumber(selectedOption!.value);
          }
        }}
        showControl={false}
        minWidth={200}
        classNames={{
          option: ({ data }) =>
            clsx(styles.option, data.value === 'add' && styles.optionAdd)
        }}
        components={{
          Option: CustomOption,
        }}
      />
    </Popout>
  );
}

function WorksheetNumDropdownMobile() {
  const {
    changeViewedWorksheetNumber,
    viewedWorksheetNumber,
    worksheetOptions,
  } = useWorksheet();

  return (
    <DropdownButton
      className={styles.dropdownButton}
      variant="primary"
      title={worksheetOptions[viewedWorksheetNumber]!.label}
      onSelect={(v) => {
        if (v) changeViewedWorksheetNumber(Number(v));
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
  return mobile ? (
    <WorksheetNumDropdownMobile />
  ) : (
    <WorksheetNumDropdownDesktop />
  );
}

export default WorksheetNumDropdown;
