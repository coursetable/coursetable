import React, { useMemo } from 'react';
import chroma from 'chroma-js';
import Select, {
  mergeStyles,
  type Props as SelectProps,
  type StylesConfig,
  type Theme as SelectTheme,
  type ThemeConfig,
} from 'react-select';
import makeAnimated from 'react-select/animated';
import type { Option } from '../../contexts/searchContext';

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
function popoutStyles(width: number): StylesConfig<Option<number | string>> {
  return {
    control: (base, { isDisabled }) => ({
      ...base,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled
        ? 'var(--color-disabled)'
        : 'var(--color-select)',
      borderColor: 'var(--color-border-control)',
      minWidth: width,
      margin: 8,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: 'none',
    }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 var(--color-shadow)' }),
    option: (base) => ({
      ...base,
      cursor: 'pointer',
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
};

function CustomSelect<
  T extends Option<string | number>,
  IsMulti extends boolean = false,
>({
  popout = false,
  colors,
  isMulti = false as IsMulti,
  components: componentsProp,
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
      ...componentsProp,
    }),
    [componentsProp],
  );

  let styles = mergeStyles(
    indicatorStyles(isMulti),
    popout ? popoutStyles(400) : defaultStyles(),
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
    />
  );
}

export default CustomSelect;
