/* eslint-disable */
import axios from 'axios';
import React, { useEffect } from 'react';

import {API_ENDPOINT} from "../config"

import { toast } from 'react-toastify';


const BoardToken = '1ce2e740-4310-1893-6927-1e2edad7785e';


const CannyContainer = () => {

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

    axios.get(`${API_ENDPOINT}/api/canny/token`, {
      withCredentials: true,
    }).then(({data})=>{
      Canny('render', {
        boardToken: BoardToken,
        basePath: "/feedback",
        ssoToken: data.token,
      });
    }).catch((err)=>{
      toast.error('Error signing in to Canny');
    })
  });

  return <div data-canny />;
};

export default CannyContainer;
