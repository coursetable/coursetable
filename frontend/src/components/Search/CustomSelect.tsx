import { useMemo } from 'react';
import clsx from 'clsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import chroma from 'chroma-js';
import Select, {
  mergeStyles,
  components,
  type Props as SelectProps,
  type StylesConfig,
  type Theme as SelectTheme,
  type ThemeConfig,
} from 'react-select';
import makeAnimated from 'react-select/animated';
import type { Option } from '../../contexts/searchContext';
import styles from './CustomSelect.module.css';

// Styles for the select indicators
function indicatorStyles<
  T extends Option<number | string>,
  IsMulti extends boolean,
>(isMulti: IsMulti): StylesConfig<T, IsMulti> {
  return {
    clearIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? 'var(--color-icon-focus)' : 'var(--color-icon)',
      ':hover': {
        ...base[':hover'],
        color: state.isFocused
          ? 'var(--color-icon-focus-hover)'
          : 'var(--color-icon-hover)',
      },
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      display: isMulti && state.hasValue ? 'none' : 'flex',
      color: state.isFocused ? 'var(--color-icon-focus)' : 'var(--color-icon)',
      ':hover': {
        ...base[':hover'],
        color: state.isFocused
          ? 'var(--color-icon-focus-hover)'
          : 'var(--color-icon-hover)',
      },
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none',
    }),
  };
}

// Styles for default select
function defaultStyles<T extends Option<number | string>>(): StylesConfig<T> {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled
        ? 'var(--color-disabled)'
        : 'var(--color-select)',
      borderColor: 'var(--color-border-control)',
      borderWidth: '2px',
      transition: 'none',
      userSelect: 'none',
    }),
    menu: (base) => ({
      ...base,
      paddingTop: 0,
      marginTop: 0,
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 var(--color-shadow)',
    }),
    menuList: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: '8px',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    multiValue: (base) => base,
    multiValueLabel: (base) => base,
    option: (base, { isSelected }) => ({
      ...base,
      cursor: 'pointer',
      color: isSelected ? 'white' : undefined,
    }),
    singleValue: (base, { isDisabled }) => ({
      ...base,
      color: isDisabled ? 'var(--color-text-tertiary)' : undefined,
    }),
  };
}

// Styles for popout select
function popoutStyles(
  minWidth: number,
  showControl = true,
): StylesConfig<Option<number | string>> {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      ...(!showControl && { display: 'none' }),
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled
        ? 'var(--color-disabled)'
        : 'var(--color-select)',
      borderColor: 'var(--color-border-control)',
      minWidth,
      margin: 8,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: 'none',
    }),
    menu: () =>
      showControl ? { boxShadow: 'inset 0 1px 0 var(--color-shadow)' } : {},
    option: (base) => ({
      ...base,
      cursor: 'pointer',
      minWidth,
    }),
  };
}

// Styles for skills/areas select
function colorStyles(colors: {
  [optionValue: string]: string;
}): StylesConfig<Option<number | string>> {
  return {
    multiValue(base, { data }) {
      const backgroundColor = chroma(colors[data.value]!).alpha(0.16).css();
      return {
        ...base,
        backgroundColor,
      };
    },
    multiValueLabel: (base, { data }) => ({
      ...base,
      color: colors[data.value]!,
      fontWeight: 'bold',
    }),
    multiValueRemove: (base, { data }) => ({
      ...base,
      color: colors[data.value]!,
      ':hover': {
        backgroundColor: colors[data.value]!,
        color: 'white',
      },
    }),
    option(base, { data, isDisabled, isFocused, isSelected }) {
      const color = chroma(colors[data.value]!);
      if (isDisabled) {
        return {
          ...base,
          fontWeight: 'bold',
          color: '#ccc',
        };
      } else if (isSelected) {
        return {
          ...base,
          fontWeight: 'bold',
          backgroundColor: colors[data.value]!,
          color: chroma.contrast(color, 'white') > 2 ? 'white' : 'black',
          ':active': {
            ...base[':active'],
            backgroundColor: colors[data.value]!,
          },
        };
      }
      return {
        ...base,
        fontWeight: 'bold',
        backgroundColor: isFocused ? color.alpha(0.1).css() : undefined,
        color: colors[data.value]!,

        ':active': {
          ...base[':active'],
          backgroundColor: color.alpha(0.5).css(),
        },
      };
    },
  };
}

type Props = {
  readonly popout?: boolean;
  readonly colors?: { [optionValue: string]: string };
  readonly isMulti?: boolean;
  readonly showControl?: boolean;
  readonly minWidth?: number;
} & (
  | {
      readonly isIntersection: boolean;
      readonly setIsIntersection: (isIntersection: boolean) => void;
      readonly unionIntersectionButtonLabel: (
        isIntersection: boolean,
      ) => string;
    }
  | {
      readonly isIntersection?: never;
      readonly setIsIntersection?: never;
      readonly unionIntersectionButtonLabel?: never;
    }
);
// Not worth typing this, since it's just spread into the subcomponent
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ControlWithUnionIndicator(props: any) {
  const {
    popout,
    isIntersection,
    setIsIntersection,
    unionIntersectionButtonLabel,
  } =
    // Props injected by react-select. These are all the props passed to the
    // *base* Select component, not Custom components. I'm casting it to Props
    // just for convenience.
    (props as { selectProps: Props }).selectProps;
  // Should not happen
  if (isIntersection === undefined) return <components.Control {...props} />;
  const label = unionIntersectionButtonLabel(isIntersection);
  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <components.Control {...props} />
      </div>
      <OverlayTrigger overlay={(p) => <Tooltip {...p}>{label}</Tooltip>}>
        <button
          type="button"
          className={clsx(
            styles.unionIntersectionButton,
            popout && styles.unionIntersectionButtonPopout,
          )}
          onClick={() => setIsIntersection(!isIntersection)}
          aria-label={label}
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
          >
            <path
              className={styles.vennFillIndicator}
              d={
                isIntersection
                  ? 'M49.63,24.03c-8.96,5.19-15,14.87-15,25.98s6.04,20.79,15,25.98c8.96-5.19,15-14.87,15-25.98 S58.59,29.22,49.63,24.03z'
                  : 'M64.63,20c-5.47,0-10.59,1.47-15,4.02c-4.41-2.55-9.53-4.02-15-4.02c-16.57,0-30,13.43-30,30s13.43,30,30,30 c5.47,0,10.59-1.47,15-4.02c4.41,2.55,9.53,4.02,15,4.02c16.57,0,30-13.43,30-30S81.2,20,64.63,20z'
              }
            />
            {['35', '65'].map((cx) => (
              <circle
                key={cx}
                className={styles.vennCircle}
                cx={cx}
                cy="50"
                r="30"
              />
            ))}
          </svg>
        </button>
      </OverlayTrigger>
    </div>
  );
}

function CustomSelect<
  T extends Option<string | number>,
  IsMulti extends boolean = false,
>({
  popout = false,
  colors,
  isMulti = false as IsMulti,
  showControl = true,
  components: componentsProp,
  minWidth = 400,
  isIntersection,
  setIsIntersection,
  unionIntersectionButtonLabel,
  ...props
}: SelectProps<T, IsMulti> & Props) {
  // All the default theme colors
  const themeStyles: ThemeConfig = (theme: SelectTheme): SelectTheme => ({
    ...theme,
    borderRadius: 8,
    colors: {
      ...theme.colors,
      primary50: '#85c2ff', // OptionBackground :focus
      primary25: 'var(--color-primary-subdued)', // OptionBackground :hover
      neutral0: 'var(--color-select)', // AllBackground & optionText :selected
      neutral10: 'var(--color-bg-button)', // SelectedOptionBackground & disabledBorder
      neutral30: 'hsl(0, 0%, 70%)', // Border :hover
      neutral60: 'var(--color-text)', // DropdownIconFocus & clearIconFocus
      neutral80: 'var(--color-text)', // SelectedOptionText & dropdownIconFocus :hover & clearIconFocus :hover
    },
  });

  const animatedComponents = useMemo(
    () => ({
      ...makeAnimated(),
      ...(isMulti &&
        isIntersection !== undefined && { Control: ControlWithUnionIndicator }),
      ...componentsProp,
    }),
    [componentsProp, isMulti, isIntersection],
  );

  let styles = mergeStyles(
    indicatorStyles(isMulti),
    popout ? popoutStyles(minWidth, showControl) : defaultStyles(),
  );
  if (colors) styles = mergeStyles(styles, colorStyles(colors));

  return (
    <Select<T, IsMulti>
      {...props}
      isMulti={isMulti}
      styles={styles as StylesConfig<T, IsMulti>}
      components={animatedComponents}
      theme={themeStyles}
      // https://github.com/coursetable/coursetable/issues/1674
      // All our selects are used in the navbar or the mobile search form, and
      // on mobile this is false anyway
      menuShouldScrollIntoView={false}
      isSearchable={showControl}
      // @ts-expect-error: this is passed to the control component
      popout={popout}
      isIntersection={isIntersection}
      setIsIntersection={setIsIntersection}
      unionIntersectionButtonLabel={unionIntersectionButtonLabel}
    />
  );
}

export default CustomSelect;
