import React from 'react';
import PropTypes from 'prop-types';

import styles from './ScheduleEvent.module.css';

const propTypes = {
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
};

class Event extends React.PureComponent {
  render() {
    const { start, end, value } = this.props;
    return (
      <div className={styles.event + ' event'}>
        {value}
        <br />
        <span>{`${start.format('HH:mm')} - ${end.format('HH:mm')}`}</span>
      </div>
    );
  }
}

Event.propTypes = propTypes;
export default Event;
