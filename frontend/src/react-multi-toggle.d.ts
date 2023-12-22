declare module 'react-multi-toggle' {
  import type { ReactNode } from 'react';

  export type Option<T> = {
    value: T;
    displayName?: ReactNode;
    optionClass?: string;
  };

  export type Props<T> = {
    options: readonly Option<T>[];
    selectedOption: T;
    onSelectOption?: (value: T) => void;
    label?: ReactNode;
    className?: string;
  };

  export default function MultiToggle<T>(props: Props<T>): ReactNode;
}
