import React from 'react';

interface Props {
  digits?: number;
  data: number;
  max: number;
  barClasses?: string;
}

export default class Bar extends React.PureComponent<Props> {
  static defaultProps = {
    data: 0,
    digits: 0,
  };

  render() {
    const { data, max, barClasses } = this.props;
    const digits = this.props.digits || 0;
    const widthPercent = (data / max) * 100;

    return (
      <span>
        <span className={barClasses} style={{ width: `${widthPercent}%` }}>
          <span className="chart-label">
            {widthPercent > 25 ? data.toFixed(digits) : '\xa0'}
          </span>
        </span>
        {widthPercent <= 25 && (
          <span className="chart-label">{data.toFixed(digits)}</span>
        )}
      </span>
    );
  }
}
