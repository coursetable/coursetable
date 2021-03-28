import React from 'react';
import _ from 'lodash';

type Label = React.ReactNode;
type Value = string | boolean | number;

type Option = {
  label: Label;
  value: Value;
};

export type OptionsProp = Array<Option> | { [value: string]: Label };

export function normalizeOptions(options: OptionsProp): Array<Option> {
  return options instanceof Array
    ? options
    : _.map(options, (label, value) => ({ label, value }));
}

export default { normalizeOptions };
