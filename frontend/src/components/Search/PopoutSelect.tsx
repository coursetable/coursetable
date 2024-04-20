import React from 'react';
import type { Props as SelectProps } from 'react-select';
import CustomSelect from './CustomSelect';
import type { Option } from '../../contexts/searchContext';

type Props = {
  readonly hideSelectedOptions?: boolean;
  readonly isClearable?: boolean;
  readonly isMulti?: boolean;
  readonly useColors?: boolean;
};

export function PopoutSelect<
  T extends Option<number | string>,
  IsMulti extends boolean,
>({
  isMulti = false as IsMulti,
  isClearable = isMulti, // Multi-selects are clearable by default
  ...props
}: SelectProps<T, IsMulti> & Props) {
  return (
    <CustomSelect<T, IsMulti>
      popout
      {...props}
      isMulti={isMulti}
      // This is not DOM auto focus
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      backspaceRemovesValue={false}
      controlShouldRenderValue
      isClearable={isClearable}
      menuIsOpen
      tabSelectsValue={false}
      closeMenuOnSelect={!isMulti}
    />
  );
}
