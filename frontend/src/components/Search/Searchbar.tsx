import React from 'react';
import type { OptionTypeBase, Props as SelectProps } from 'react-select';
import CustomSelect from '../CustomSelect';

type Props = {
  readonly popout?: boolean;
  readonly useColors?: boolean;
  readonly isMulti?: boolean;
};

/**
 * Popout select component for select filters in popout dropdowns
 */
export function Searchbar<T extends OptionTypeBase, IsMulti extends boolean>({
  isMulti = false as IsMulti,
  isClearable = true,
  hideSelectedOptions = true,
  components,
  handleInputChange,
  onKeyDown,
  ...props
}: SelectProps<T, IsMulti> & Props) {
  return (
    <CustomSelect<T, IsMulti>
      popout
      {...props}
      isMulti={isMulti}
      autoFocus
      backspaceRemovesValue={false}
      components={components}
      controlShouldRenderValue
      handleInputChange={handleInputChange}
      hideSelectedOptions={hideSelectedOptions}
      isClearable={isClearable}
      menuIsOpen
      onKeyDown={onKeyDown}
      tabSelectsValue={false}
      closeMenuOnSelect={!isMulti}
    />
  );
}
