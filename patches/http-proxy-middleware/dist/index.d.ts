import type { Filter, Options } from './types';

export declare function createProxyMiddleware(
  context: Filter | Options,
  options?: Options,
): import('./types').RequestHandler;
export * from './handlers';
export type { Filter, Options, RequestHandler } from './types';
