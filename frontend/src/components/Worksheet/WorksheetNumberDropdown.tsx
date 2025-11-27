import { useEffect, useRef, useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa6';
import { MdEdit, MdDelete, MdLock } from 'react-icons/md';
import { components, type OptionProps, type MenuListProps } from 'react-select';
import { useShallow } from 'zustand/react/shallow';
import MdLockOpenRight from '../../images/MdLockOpenRight';
import { updateWorksheetMetadata } from '../../queries/api';
import {
  useWorksheetNumberOptions,
  type WorksheetNumberOption,
} from '../../slices/WorksheetSlice';
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

function OptionWithActionButtons(props: OptionProps<WorksheetNumberOption>) {
  const [isRenamingWorksheet, setIsRenamingWorksheet] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [animateButtonsIn, setAnimateButtonsIn] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const {
    viewedSeason,
    viewedWorksheetNumber,
    changeViewedWorksheetNumber,
    viewedPerson,
  } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      changeViewedWorksheetNumber: state.changeViewedWorksheetNumber,
      viewedPerson: state.viewedPerson,
    })),
  );

  useEffect(() => {
    if (isConfirmingDelete && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const popup = document.createElement('div');
      popup.className = styles.confirmationPopup!;
      popup.textContent = 'Are you sure?';
      popup.style.position = 'fixed';
      popup.style.top = `${rect.top + rect.height / 2}px`;
      popup.style.left = `${rect.right}px`;
      popup.style.transform = 'translateY(-50%)';
      document.body.appendChild(popup);

      return () => {
        document.body.removeChild(popup);
      };
    }
    return undefined;
  }, [isConfirmingDelete]);

  useEffect(() => {
    if (isConfirmingDelete) {
      requestAnimationFrame(() => {
        setAnimateButtonsIn(true);
      });
    } else {
      setAnimateButtonsIn(false);
    }
  }, [isConfirmingDelete]);

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

  if (isConfirmingDelete) {
    return (
      <components.Option {...props} className={styles.noPaddingOption}>
        <div className={styles.confirmContainer} ref={containerRef}>
          <div
            className={`${styles.confirmButtons ?? ''} ${
              animateButtonsIn && styles.confirmButtonsVisible
                ? styles.confirmButtonsVisible
                : ''
            }`}
          >
            <button
              type="button"
              className={styles.keepButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmingDelete(false);
              }}
            >
              Keep
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={async (e) => {
                e.stopPropagation();
                setIsConfirmingDelete(false);
                await updateWorksheetMetadata({
                  action: 'delete',
                  season: viewedSeason,
                  worksheetNumber: props.data.value,
                });
                if (viewedWorksheetNumber === props.data.value)
                  changeViewedWorksheetNumber(0);
                await worksheetsRefresh();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </components.Option>
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
        {/* Star/Lock/Unlock icon left of Worksheet name */}
        {props.data.value === 0 ? (
          <FaStar />
        ) : props.data.isPrivate ? (
          <MdLock />
        ) : (
          <MdLockOpenRight />
        )}

        {/* Name of worksheet */}
        <span className={styles.optionName}>{props.data.label}</span>

        {/* Edit/Delete buttons */}
        {props.data.value !== 0 && viewedPerson === 'me' && (
          <div className={styles.iconContainer}>
            <MdEdit
              className={styles.renameWorksheetIcon}
              onClick={(e) => {
                e.stopPropagation();
                setIsRenamingWorksheet(true);
              }}
            />
            <div>
              <MdDelete
                className={styles.deleteWorksheetIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmingDelete(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </components.Option>
  );
}

function MenuListWithAdd({
  children,
  ...props
}: MenuListProps<WorksheetNumberOption>) {
  const [isAddingWorksheet, setIsAddingWorksheet] = useState(false);
  const worksheetsRefresh = useStore((state) => state.worksheetsRefresh);
  const { viewedSeason, viewedPerson } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedPerson: state.viewedPerson,
    })),
  );
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
  readonly options: { [worksheetNumber: number]: WorksheetNumberOption };
}) {
  const viewedWorksheetNumber = useStore(
    (state) => state.viewedWorksheetNumber,
  );

  return (
    <Popout
      buttonText="Worksheet"
      displayOptionLabel
      selectedOptions={options[viewedWorksheetNumber]}
      clearIcon={false}
      Icon={
        // Star/Lock/Unlock icon in dropdown button
        viewedWorksheetNumber === 0 ? (
          <FaStar />
        ) : options[viewedWorksheetNumber]?.isPrivate ? (
          <MdLock />
        ) : (
          <MdLockOpenRight />
        )
      }
    >
      <PopoutSelect<WorksheetNumberOption, false>
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
  readonly options: { [worksheetNumber: number]: WorksheetNumberOption };
}) {
  const { changeViewedWorksheetNumber, viewedWorksheetNumber } = useStore(
    useShallow((state) => ({
      viewedWorksheetNumber: state.viewedWorksheetNumber,
      changeViewedWorksheetNumber: state.changeViewedWorksheetNumber,
    })),
  );

  return (
    <DropdownButton
      className={styles.dropdownButton}
      variant="primary"
      title={options[viewedWorksheetNumber]?.label ?? 'Worksheet'}
      onSelect={(v) => {
        if (v) changeViewedWorksheetNumber(Number(v));
      }}
    >
      {Object.values(options).map(({ value, label }) => (
        <Dropdown.Item key={value} eventKey={value} className="d-flex">
          <div className="mx-auto">{label}</div>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

function WorksheetNumDropdown({ mobile }: { readonly mobile: boolean }) {
  const { viewedSeason, viewedPerson } = useStore(
    useShallow((state) => ({
      viewedSeason: state.viewedSeason,
      viewedPerson: state.viewedPerson,
    })),
  );
  const options = useWorksheetNumberOptions(viewedPerson, viewedSeason);
  return mobile ? (
    <WorksheetNumDropdownMobile options={options} />
  ) : (
    <WorksheetNumDropdownDesktop options={options} />
  );
}

export default WorksheetNumDropdown;
