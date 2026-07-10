import type { Application, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const DEFAULT_FERRY_TARGET = 'http://graphql-engine:8080';
const FERRY_GRAPHQL_PATH = '/ferry/v1/graphql';
const FERRY_GRAPHQL_METHODS = new Set(['GET', 'POST']);
const HOP_BY_HOP_HEADERS = [
  'connection',
  'expect',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
] as const;

export type FerryProxyOptions = Readonly<{
  adminSecret: string;
  target?: string;
}>;

export function registerFerryProxy(
  app: Application,
  options: FerryProxyOptions,
): void {
  app.use(
    '/ferry',
    (request, response, next) => {
      const queryIndex = request.originalUrl.indexOf('?');
      const rawPath =
        queryIndex === -1
          ? request.originalUrl
          : request.originalUrl.slice(0, queryIndex);
      if (rawPath !== FERRY_GRAPHQL_PATH) {
        response.status(404).json({ error: 'NOT_FOUND' });
        return;
      }
      if (!FERRY_GRAPHQL_METHODS.has(request.method)) {
        response.set('Allow', 'GET, POST');
        response.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
        return;
      }

      const hasuraHeaders = Object.keys(request.headers).filter((header) =>
        header.startsWith('x-hasura-'),
      );
      for (const header of hasuraHeaders) delete request.headers[header];

      const connectionHeaders = (request.headers.connection ?? '')
        .split(',')
        .map((header) => header.trim().toLowerCase())
        .filter(Boolean);
      const hopByHopHeaders = new Set([
        ...HOP_BY_HOP_HEADERS,
        ...connectionHeaders,
      ]);
      for (const header of hopByHopHeaders) delete request.headers[header];
      next();
    },
    createProxyMiddleware<Request, Response>({
      on: {
        proxyReq(proxyRequest, request) {
          const hasuraHeaders = proxyRequest
            .getHeaderNames()
            .filter((header) => header.startsWith('x-hasura-'));
          for (const header of hasuraHeaders) proxyRequest.removeHeader(header);

          const hasuraRole = request.isAuthenticated()
            ? 'student'
            : 'anonymous';
          proxyRequest.setHeader('connection', 'close');
          proxyRequest.setHeader('x-hasura-role', hasuraRole);
          proxyRequest.setHeader('x-hasura-admin-secret', options.adminSecret);
        },
      },
      target: options.target ?? DEFAULT_FERRY_TARGET,
      xfwd: true,
    }),
  );
}
