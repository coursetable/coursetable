// @flow
import React from 'react';
import { callProp, preventDefault } from 'react-updaters';
import { normalizeOptions, type OptionsProp } from './lib/Select';

export default class Tabs extends React.PureComponent {
  props: {
    tabs: OptionsProp,
    value?: string | number | boolean,
    onChange: Function,
    disabledTabs?: Array | Object,
    className?: string,
  };

  render() {
    const tabs = normalizeOptions(this.props.tabs);
    const activeTab = this.props.value;
    const className = this.props.className || 'nav nav-tabs';
    const disabledTabs = this.props.disabledTabs;

    return (
      <ul className={className} role="navigation">
        {tabs.map(({ value, label }) => {
          let tabClassName = null;
          let onClick = callProp(this, 'onChange', [value], true);

          if (activeTab === value) {
            tabClassName = 'active';
          } else if (disabledTabs && disabledTabs.indexOf(value) !== -1) {
            tabClassName = 'disabled';
            onClick = preventDefault;
          }

          return (
            <li key={value} className={tabClassName}>
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
