// import React from 'react';
import { OptionTypeBase, Props as SelectProps } from 'react-select';
import CustomSelect from '../CustomSelect';

type Props = {
  hideSelectedOptions?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
};

/**
 * Popout select component for select filters in popout dropdowns
 */
export const PopoutSelect = <T extends OptionTypeBase>({
  isMulti = false,
  isClearable = true,
  hideSelectedOptions = true,
  ...props
}: SelectProps<T, boolean> & Props) => {
  return (
    <CustomSelect<T>
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
};
