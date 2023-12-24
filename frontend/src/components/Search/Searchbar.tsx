import React from 'react';
import type { Props as SelectProps } from 'react-select';
import CustomSelect from '../CustomSelect';
import type { Option } from '../../contexts/searchContext';

type Props = {
  readonly popout?: boolean;
  readonly useColors?: boolean;
  readonly isMulti?: boolean;
};

/**
 * Popout select component for select filters in popout dropdowns
 */
export function Searchbar<
  T extends Option<number | string>,
  IsMulti extends boolean,
>({
  isMulti = false as IsMulti,
  isClearable = true,
  hideSelectedOptions = true,
  components,
  onKeyDown,
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
      components={components}
      controlShouldRenderValue
      hideSelectedOptions={hideSelectedOptions}
      isClearable={isClearable}
      menuIsOpen
      onKeyDown={onKeyDown}
      tabSelectsValue={false}
      closeMenuOnSelect={!isMulti}
    />
  );
}
