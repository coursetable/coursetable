import React from 'react';
import EvaluationButton from './EvaluationButton';
import { EvaluationSummary } from '../types';
import EvaluationBarGraph from './EvaluationBarGraph';

interface Props {
  evaluation: EvaluationSummary;
  tooltip: string;
  btnClass: string;
}

export default class EvaluationRow extends React.PureComponent<Props> {
  render() {
    const { evaluation, tooltip, btnClass } = this.props;
    return (
      <div className="row-fluid eval-row">
        <EvaluationButton
          btnClass={btnClass}
          evaluation={evaluation}
          tooltip={tooltip}
        />
        <div className="span7">
          <EvaluationBarGraph evaluation={evaluation} />
        </div>
      </div>
    );
  }
}
