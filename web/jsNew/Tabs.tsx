import React from 'react';
import { callProp, preventDefault } from 'react-updaters';
import { normalizeOptions, OptionsProp } from './lib/Select';

interface Props {
  tabs: OptionsProp;
  value: string | number | boolean | null;
  onChange: (value: string | number | boolean) => unknown;
  disabledTabs?: string[] | { [tab: string]: boolean } | null;
  className?: string;
}

export default class Tabs extends React.PureComponent<Props> {
  render() {
    const tabs = normalizeOptions(this.props.tabs);
    const activeTab = this.props.value;
    const className = this.props.className || 'nav nav-tabs';
    let disabledTabs = this.props.disabledTabs;

    const disabled: any[] =
      disabledTabs instanceof Array
        ? disabledTabs
        : Object.keys(disabledTabs || {});

    return (
      <ul className={className} role="navigation">
        {tabs.map(({ value, label }) => {
          let tabClassName = null;
          let onClick = callProp(this, 'onChange', [value], true);

          if (activeTab === value) {
            tabClassName = 'active';
          } else if (disabled.indexOf(value) !== -1) {
            tabClassName = 'disabled';
            onClick = preventDefault;
          }

          return (
            <li key={value.toString()} className={tabClassName || ''}>
              <a href={`#openTab${value}`} onClick={onClick}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}
