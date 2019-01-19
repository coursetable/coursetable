// @flow
import _ from 'lodash';

type Label = string | React.Element<*>;
type Value = string | boolean | number;

type Option = {
  label: Label,
  value: Value,
};

export type OptionsProp = Array<Option> | { [string]: Label };

export function normalizeOptions(options: OptionsInput): OptionsProp {
  return options instanceof Array
    ? options
    : _.map(options, (label, value) => ({ label, value }));
}

export default { normalizeOptions };
