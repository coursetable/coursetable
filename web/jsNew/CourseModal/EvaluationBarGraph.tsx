// import $ from 'jquery';
import React from 'react';
// import '../../libs/bootstrap-2.3.2/js/bootstrap';
import { EvaluationSummary } from '../types';
import Bar from '../Bar';

interface Props {
  evaluation: EvaluationSummary;
}

/**
 * Display a bar graph summarizing the average rating/difficulty for
 * a past course
 */
export default class EvaluationBarGraph extends React.PureComponent<Props> {
  render() {
    const { evaluation: evaluation } = this.props;
    return (
      <>
        <Bar
          data={evaluation.average.rating}
          max={5}
          barClasses="chart-bar bar-blue rating-bar"
          digits={2}
        />
        <Bar
          data={evaluation.average.workload}
          max={5}
          barClasses="chart-bar bar-red difficulty-bar"
          digits={2}
        />
      </>
    );
  }
}
