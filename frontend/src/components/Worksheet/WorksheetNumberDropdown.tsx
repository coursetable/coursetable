import { useEffect, useMemo, useRef, useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import type { Option } from '../../contexts/searchContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import styles from './WorksheetNumberDropdown.module.css';
import { components, OptionProps } from 'react-select';
import { useStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import clsx from 'clsx';
import { Input } from '../Typography';
import { Season } from '../../queries/graphql-types';
import { MdDelete } from 'react-icons/md';
import { updateWorksheetMetadata } from '../../queries/api';

type WorksheetOption = Option<number | 'add'>;

type CustomInputProps = {
  isModifying: boolean;
  enterAction: (newWsName: string) => void;
  onCancel: () => void;
};

function CustomInput(props: CustomInputProps) {
  const {
    isModifying,
    enterAction,
    onCancel,
  } = props;

  const [inputField, setInputField] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPos, setCursorPos] = useState(0);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.setSelectionRange(cursorPos, cursorPos);
  }, [inputField]);

  return (
    <div className={styles.optionInputContainer}>
      {isModifying && (
        <Input
          className={styles.optionInput}
          type="text"
          value={inputField}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const selectionStart = e.target.selectionStart;
            if (selectionStart) setCursorPos(selectionStart);
            setInputField(e.target.value);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            e.stopPropagation();
            if (e.key === 'Enter') {
              e.preventDefault();
              enterAction(inputField);
              setInputField('');
            } else if (e.key === 'Escape') {
              setInputField('');
              onCancel();
            }
          }}
          onMouseDown={(e: React.MouseEvent<HTMLInputElement>) => {
            e.stopPropagation();
          }}
          onBlur={() => {
            setInputField('');
            onCancel();
          }}
          placeholder="Hit Enter to save"
          ref={inputRef}
          maxLength={64}
          autoFocus
        />
      )}
    </div>
  );
}

type CustomOptionProps = OptionProps<WorksheetOption, false> & {
  addWorksheet: (name: string) => Promise<boolean>;
  deleteWorksheet: (worksheetNumber: number) => Promise<boolean>;
  worksheetsRefresh: () => Promise<void>;
  viewedWorksheetNumber: number;
  changeViewedWorksheetNumber: (number: number) => void;
  viewedSeason: Season;
};

function CustomOption(props: CustomOptionProps) {
  const {
    data,
    addWorksheet,
    deleteWorksheet,
    worksheetsRefresh,
    viewedWorksheetNumber,
    changeViewedWorksheetNumber,
    innerProps,
  } = props;
  const [isAddingWorksheet, setIsAddingWorksheet] = useState(false);

  if (data.value !== 'add') {
    return (
      <components.Option
        {...props}
        innerProps={{
          ...innerProps,
          onClick: (e) => {
            e.stopPropagation();
            changeViewedWorksheetNumber(data.value as number);
          },
        }}
      >
        <div className={styles.optionContent}>
          <span>{data.label}</span>
          {data.value !== 0 &&
            <MdDelete
              className={styles.deleteWorksheetIcon}
              onClick={async (e) => {
                e.stopPropagation();
                await deleteWorksheet(data.value as number);
                if (viewedWorksheetNumber == data.value as number) {
                  changeViewedWorksheetNumber(0);
                }
                await worksheetsRefresh();
              }}
            />
          }
        </div>
      </components.Option>
    );
  } else {
    if (isAddingWorksheet) {
      return (
        <CustomInput
          isModifying={isAddingWorksheet}
          enterAction={async (newWsName: string) => {
            setIsAddingWorksheet(false);
            await addWorksheet(newWsName.trim() || 'New Worksheet');
            await worksheetsRefresh();
          }}
          onCancel={() => setIsAddingWorksheet(false)}
        />
      );
    } else {
      return (
        <components.Option
          {...props}
          innerProps={{
            ...innerProps,
            onClick: (e) => {
              e.stopPropagation();
              setIsAddingWorksheet(true);
            },
          }}
          className={clsx(styles.option, styles.optionAdd)}
        />
      );
    }
  }
}

function WorksheetNumDropdownDesktop() {
  const { worksheetsRefresh } = useStore(
    useShallow((state) => ({
      worksheetsRefresh: state.worksheetsRefresh,
    })),
  );

  const {
    changeViewedWorksheetNumber,
    viewedWorksheetNumber,
    worksheetOptions,
    viewedSeason,
  } = useWorksheet();

  const modifiedWorksheetOptions: WorksheetOption[] = useMemo(
    () => {
      console.log(worksheetOptions);
      return [
        ...Object.values(worksheetOptions),
        { value: 'add', label: '+' },
      ]
    },
    [worksheetOptions],
  );

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
        showControl={false}
        minWidth={200}
        classNames={{
          option: ({ data }) =>
            clsx(styles.option, data.value === 'add' && styles.optionAdd),
        }}
        components={{
          Option: (props) => (
            <CustomOption
              {...props}
              addWorksheet={async (name: string) => await updateWorksheetMetadata({ action: "add", season: viewedSeason, name })}
              deleteWorksheet={async (worksheetNumber: number) => updateWorksheetMetadata({ action: "delete", season: viewedSeason, worksheetNumber })}
              worksheetsRefresh={worksheetsRefresh}
              viewedWorksheetNumber={viewedWorksheetNumber}
              changeViewedWorksheetNumber={changeViewedWorksheetNumber}
              viewedSeason={viewedSeason}
            />
          ),
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
      {Object.values(worksheetOptions).map(({ value, label }) => (
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
