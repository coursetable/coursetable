import React from 'react';
import type { OptionTypeBase, Props as SelectProps } from 'react-select';
import CustomSelect from '../CustomSelect';

type Props = {
  readonly hideSelectedOptions?: boolean;
  readonly isClearable?: boolean;
  readonly isMulti?: boolean;
};

/**
 * Popout select component for select filters in popout dropdowns
 */
export function PopoutSelect<
  T extends OptionTypeBase,
  IsMulti extends boolean,
>({
  isMulti = false as IsMulti,
  isClearable = true,
  hideSelectedOptions = true,
  ...props
}: SelectProps<T, IsMulti> & Props) {
  return (
    <CustomSelect<T, IsMulti>
      popout
      {...props}
      isMulti={isMulti}
      autoFocus
      backspaceRemovesValue={false}
      controlShouldRenderValue
      hideSelectedOptions={hideSelectedOptions}
      isClearable={isClearable}
      menuIsOpen
      tabSelectsValue={false}
      closeMenuOnSelect={!isMulti}
    />
  );
}
