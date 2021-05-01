import React from 'react';
import { Props as SelectProps } from 'react-select';
import CustomSelect from './CustomSelect';

/**
 * Popout select component for select filters in popout dropdowns
 */
export const PopoutSelect: React.FC<SelectProps> = ({
  isMulti,
  isClearable = true,
  hideSelectedOptions = true,
  ...props
}) => {
  return (
    <CustomSelect
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
