import React from 'react';
import Bar from './Bar';

export default class Histogram extends React.PureComponent {
  props: {
    data: Array<number>;
    labels: Array<string>;
    round?: number;
    barClasses?: Array<string>;
  };

  static defaultProps = {
    round: 0,
  };

  render() {
    const { round, data, labels, barClasses } = this.props;

    const maxCount = Math.max(...data);

    return (
      <table style={{ width: '100%' }} className="chart">
        <colgroup span={2}>
          <col width="100px" />
          <col />
        </colgroup>

        {data.map((count, index) => {
          const label = labels[index];
          return (
            <tr>
              <td className="chart-legend">{label}</td>
              <td>
                <Bar
                  data={count}
                  max={maxCount}
                  barClasses={
                    'square-chart-bar ' + (barClasses ? barClasses[index] : '')
                  }
                  digits={round}
                />
              </td>
            </tr>
          );
        })}
      </table>
    );
  }
}
