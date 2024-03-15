Object.defineProperty(exports, '__esModule', { value: true });
exports.fixRequestBody = exports.responseInterceptor = void 0;
const response_interceptor_1 = require('./response-interceptor');

Object.defineProperty(exports, 'responseInterceptor', {
  enumerable: true,
  get() {
    return response_interceptor_1.responseInterceptor;
  },
});
const fix_request_body_1 = require('./fix-request-body');

Object.defineProperty(exports, 'fixRequestBody', {
  enumerable: true,
  get() {
    return fix_request_body_1.fixRequestBody;
  },
});
