import React, { PureComponent } from 'react';
import { update } from 'react-updaters';
import _ from 'lodash';
import SelectButtons from './SelectButtons';

interface Props {
  comments: string[];
  sortByLength: boolean;
}

interface State {
  sortByLength: boolean;
}

const sortByLengthOptions = [
  { value: false, label: 'Original order' },
  { value: true, label: 'By length' },
];

export default class EvaluationComments extends PureComponent<Props, State> {
  state: State = { sortByLength: false };

  render() {
    const { comments } = this.props;
    const { sortByLength } = this.state;
    const sortedComments = _.clone(comments);

    if (sortByLength) {
      sortedComments.sort((a, b) => -(a.length - b.length));
    }

    return (
      <div>
        <div className="bottom10 text-right">
          <strong>Sort comments by: </strong>
          <SelectButtons
            options={sortByLengthOptions}
            onChange={update(this, 'sortByLength')}
            value={sortByLength}
          />
        </div>

        {sortedComments.map((comment, i) => (
          <div key={i} className="well well-small">
            {comment}
          </div>
        ))}
      </div>
    );
  }
}
