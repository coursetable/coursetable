import React from 'react';
import { callProp } from 'react-updaters';
import { normalizeOptions, OptionsProp } from './lib/Select';

export default class SelectButtons extends React.PureComponent {
  props: {
    options: OptionsProp;
    value: string | number | boolean;
    onChange: Function;
    className?: string;
    disabled?: boolean;
    btnGroupClassName?: string;
  };

  render() {
    const curValue = this.props.value;
    const options = normalizeOptions(this.props.options);

    const className = this.props.className || 'btn btn-default';
    const btnGroupClassName = this.props.btnGroupClassName || 'btn-group';

    return (
      <div className={btnGroupClassName} role="group">
        {options.map(({ label, value }) => {
          return (
            <button
              key={value.toString()}
              type="button"
              className={className + (value === curValue ? ' active' : '')}
              onClick={callProp(this, 'onChange', [value])}
              disabled={this.props.disabled}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }
}
