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

/**
 * Popout select component for select filters in popout dropdowns
 */
export function PopoutSelect<
  T extends Option<number | string>,
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
      // TODO
      // eslint-disable-next-line jsx-a11y/no-autofocus
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
