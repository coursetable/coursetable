/* eslint-disable */
const CannySDK = {
  init: () => {
    (function (w, d, i, s) {
      if (typeof w.Canny === 'function') {
        return;
      }

      var c = function () {
        c.q.push(arguments);
      };
      c.q = [];
      w.Canny = c;
      function l() {
        if (d.getElementById(i)) {
          return;
        }
        var f = d.getElementsByTagName(s)[0];
        var e = d.createElement(s);
        e.type = 'text/javascript';
        e.async = true;
        e.src = 'https://canny.io/sdk.js';
        f.parentNode.insertBefore(e, f);
      }
      if (d.readyState === 'complete') {
        l();
      } else if (w.attachEvent) {
        w.attachEvent('onload', l);
      } else {
        w.addEventListener('load', l, false);
      }
    })(window, document, 'canny-jssdk', 'script');
  },
};

export default CannySDK;
