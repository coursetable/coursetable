/* eslint-disable */
import React, { Component } from 'react';

import PropTypes from 'prop-types';

import CannySDK from './CannySDK';

const AppID = process.env.REACT_APP_CANNY_ID;

export default class CannyContainer extends Component {
  static contextTypes = {
    viewer: PropTypes.shape({
      _id: PropTypes.string,
      avatarURL: PropTypes.string,
      companies: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          monthlySpend: PropTypes.number,
          name: PropTypes.string,
        })
      ),
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  };

  componentDidMount() {
    CannySDK.init();

    const { viewer } = this.context;
    if (!viewer || !viewer._id) {
      return;
    }

    Canny('identify', {
      appID: AppID,
      user: {
        id: viewer._id,
        name: viewer.name,
      },
    });
  }

  render() {
    return this.props.children;
  }
}
