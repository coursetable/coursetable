import { useEffect, useRef, useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { MdEdit, MdDelete } from 'react-icons/md';
import { components, type OptionProps, type MenuListProps } from 'react-select';
import type { Option } from '../../contexts/searchContext';
import {
  useWorksheet,
  useWorksheetNumberOptions,
} from '../../contexts/worksheetContext';
import { updateWorksheetMetadata } from '../../queries/api';
import { useStore } from '../../store';
import { Popout } from '../Search/Popout';
import { PopoutSelect } from '../Search/PopoutSelect';
import { Input } from '../Typography';
import styles from './WorksheetNumberDropdown.module.css';

function WSNameInput({
  startingInput,
  enterAction,
  onCancel,
}: {
  readonly startingInput: string;
  readonly enterAction: (newWsName: string) => void;
  readonly onCancel: () => void;
}) {
  const [inputField, setInputField] = useState(startingInput);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    });
  }, []);

  return (
    <div className={styles.optionInputContainer}>
      <Input
        className={styles.optionInput}
        type="text"
        value={inputField}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInputField(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          e.stopPropagation();
          if (e.key === 'Enter') {
            e.preventDefault();
            enterAction(inputField);
            setInputField('');
          } else if (e.key === 'Escape') {
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
      />
    </div>
  );
}

function OptionWithActionButtons(props: OptionProps<Option<number>>) {
  const [isRenamingWorksheet, setIsRenamingWorksheet] = useState(false);
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const {
    viewedSeason,
    viewedWorksheetNumber,
    changeViewedWorksheetNumber,
    viewedPerson,
  } = useWorksheet();

  if (isRenamingWorksheet) {
    return (
      <WSNameInput
        startingInput={props.data.label}
        enterAction={async (newWsName: string) => {
          setIsRenamingWorksheet(false);
          await updateWorksheetMetadata({
            action: 'rename',
            season: viewedSeason,
            worksheetNumber: props.data.value,
            name: newWsName.trim() || 'New Worksheet',
          });
          await worksheetsRefresh();
        }}
        onCancel={() => setIsRenamingWorksheet(false)}
      />
    );
  }
  return (
    <components.Option
      {...props}
      innerProps={{
        ...props.innerProps,
        onClick(e) {
          e.stopPropagation();
          changeViewedWorksheetNumber(props.data.value);
        },
      }}
    >
      <div className={styles.optionContent}>
        <span className={styles.optionName}>{props.data.label}</span>
        {props.data.value !== 0 && viewedPerson === 'me' && (
          <div className={styles.iconContainer}>
            <MdEdit
              className={styles.renameWorksheetIcon}
              onClick={(e) => {
                e.stopPropagation();
                setIsRenamingWorksheet(true);
              }}
            />
            <MdDelete
              className={styles.deleteWorksheetIcon}
              onClick={async (e) => {
                e.stopPropagation();
                await updateWorksheetMetadata({
                  action: 'delete',
                  season: viewedSeason,
                  worksheetNumber: props.data.value,
                });
                if (viewedWorksheetNumber === props.data.value)
                  changeViewedWorksheetNumber(0);

                await worksheetsRefresh();
              }}
            />
          </div>
        )}
      </div>
    </components.Option>
  );
}

function MenuListWithAdd({
  children,
  ...props
}: MenuListProps<Option<number>>) {
  const [isAddingWorksheet, setIsAddingWorksheet] = useState(false);
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const { viewedSeason, viewedPerson } = useWorksheet();
  const addBtn = isAddingWorksheet ? (
    <WSNameInput
      startingInput="New Worksheet"
      enterAction={async (newWsName: string) => {
        setIsAddingWorksheet(false);
        await updateWorksheetMetadata({
          action: 'add',
          season: viewedSeason,
          name: newWsName.trim() || 'New Worksheet',
        });
        await worksheetsRefresh();
      }}
      onCancel={() => setIsAddingWorksheet(false)}
    />
  ) : (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setIsAddingWorksheet(true);
      }}
      className={styles.addBtn}
    >
      +
    </button>
  );
  return (
    <components.MenuList {...props}>
      {children}
      {viewedPerson === 'me' && addBtn}
    </components.MenuList>
  );
}

function WorksheetNumDropdownDesktop({
  options,
}: {
  readonly options: { [worksheetNumber: number]: Option<number> };
}) {
  const { viewedWorksheetNumber } = useWorksheet();

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
        showControl={false}
        minWidth={200}
        components={{
          Option: OptionWithActionButtons,
          MenuList: MenuListWithAdd,
        }}
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
