import React from 'react';
import { EvaluationSummary } from '../types';

interface Props {
  evaluation: EvaluationSummary;
  tooltip: string;
  btnClass: string;
}

/** Button that clicks into an evaluation */
export default class EvaluationButton extends React.PureComponent<Props> {
  render() {
    const { evaluation, btnClass, tooltip } = this.props;

    const nameStrings = [];
    for (let j = 0; j < evaluation.names.length; j++) {
      const name = evaluation.names[j];
      nameStrings.push(name.subject + '\xa0' + name.number);
    }

    return (
      <button
        className={`btn ${btnClass} span5 eval-button`}
        id={`show-eval${evaluation.id}`}
        title={`${tooltip} ${nameStrings.join(' / ')}`}
      >
        {evaluation.year} {evaluation.term}
        <div>See details</div>
      </button>
    );
  }
}
