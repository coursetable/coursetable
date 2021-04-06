/* eslint-disable */
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { API_ENDPOINT } from '../config';

import { toast } from 'react-toastify';

import { boards } from './CannyContainer';

const CannyBoard = ({ board }) => {
  useEffect(() => {
    (function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          var f = d.getElementsByTagName(s)[0],
            e = d.createElement(s);
          (e.type = 'text/javascript'),
            (e.async = !0),
            (e.src = 'https://canny.io/sdk.js'),
            f.parentNode.insertBefore(e, f);
        }
      }
      if ('function' != typeof w.Canny) {
        var c = function () {
          c.q.push(arguments);
        };
        (c.q = []),
          (w.Canny = c),
          'complete' === d.readyState
            ? l()
            : w.attachEvent
            ? w.attachEvent('onload', l)
            : w.addEventListener('load', l, !1);
      }
    })(window, document, 'canny-jssdk', 'script');

    axios
      .get(`${API_ENDPOINT}/api/canny/token`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        Canny('render', {
          boardToken: board.token,
          basePath: `/feedback/${board.value}`,
          ssoToken: data.token,
        });
      })
      .catch((err) => {
        toast.error('Please sign in to view and submit feedback');
      });
  }, [board]);

  return <div data-canny></div>;
};

export default CannyBoard;
