import assert from 'node:assert/strict';
import {
  createServer,
  request as httpRequest,
  type IncomingHttpHeaders,
  type OutgoingHttpHeaders,
  type Server,
} from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, beforeEach, describe, test } from 'node:test';
import express from 'express';

import { registerFerryProxy } from './ferry.routes.js';

const TRUSTED_ADMIN_SECRET = 'trusted-test-admin-secret';

const BLOCKED_FERRY_PATHS = [
  '/ferry',
  '/ferry/',
  '/ferry/v1',
  '/ferry/v1/metadata',
  '/ferry/v2/query',
  '/ferry/v1alpha1/pg_dump',
  '/ferry/healthz',
  '/ferry/v1/version',
  '/ferry/v1/graphql/',
  '/ferry/v1/graphql/explain',
  '/ferry/v1/graphql.admin',
  '/ferry/v1/graphql;admin',
  '/FERRY/V1/GRAPHQL',
  '/ferry//v1/graphql',
  '/ferry/v1/graphql/../metadata',
  '/ferry/v1/%67raphql',
  '/ferry/v1%2fgraphql',
  '/ferry/v1%5cgraphql',
  '/ferry/v1/graphql%2f..%2fv1%2fmetadata',
  '/ferry/v1/graphql%zz',
  '/ferry\\v1\\graphql',
  '/ferry/v1/graphql#fragment',
  'http://example.test/ferry/v1/graphql',
] as const;

const BLOCKED_FERRY_METHODS = [
  'HEAD',
  'OPTIONS',
  'PUT',
  'PATCH',
  'DELETE',
  'TRACE',
] as const;

const FORBIDDEN_UPSTREAM_HEADERS = [
  'expect',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'upgrade',
  'x-remove-me',
] as const;

type HasuraHeaders = {
  [header: string]: string | string[];
};

type CapturedRequest = Readonly<{
  body: string;
  connection: string;
  hasuraHeaders: HasuraHeaders;
  method: string;
  path: string;
  unsafeHeaders: HasuraHeaders;
}>;

type TestResponse = Readonly<{
  body: string;
  headers: IncomingHttpHeaders;
  status: number;
}>;

type FerryFixture = Readonly<{
  close: () => Promise<void>;
  completedExpressHasuraHeaders: HasuraHeaders[];
  origin: string;
  reset: () => void;
  setAuthenticated: (authenticated: boolean) => void;
  upstreamRequests: CapturedRequest[];
}>;

async function listen(server: Server): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    const handleError = (error: Error) => reject(error);
    server.once('error', handleError);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', handleError);
      resolve();
    });
  });

  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

async function close(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function sendRequest(
  origin: string,
  path: string,
  options: Readonly<{
    body?: string;
    headers?: OutgoingHttpHeaders;
    method?: string;
    waitForContinue?: boolean;
  }> = {},
): Promise<TestResponse> {
  const url = new URL(origin);

  return await new Promise<TestResponse>((resolve, reject) => {
    const request = httpRequest(
      {
        headers: options.headers,
        hostname: url.hostname,
        method: options.method ?? 'GET',
        path,
        port: url.port,
        protocol: url.protocol,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => {
          resolve({
            body: Buffer.concat(chunks).toString('utf8'),
            headers: response.headers,
            status: response.statusCode ?? 0,
          });
        });
      },
    );

    request.on('error', reject);
    const sendBody = () => {
      if (options.body !== undefined) request.write(options.body);
      request.end();
    };
    if (options.waitForContinue) {
      request.once('continue', sendBody);
      request.flushHeaders();
    } else {
      sendBody();
    }
  });
}

async function createFerryFixture(): Promise<FerryFixture> {
  const completedExpressHasuraHeaders: HasuraHeaders[] = [];
  const upstreamRequests: CapturedRequest[] = [];
  let authenticated = false;

  const upstream = createServer((request, response) => {
    const chunks: Buffer[] = [];
    request.on('data', (chunk: Buffer) => chunks.push(chunk));
    request.on('end', () => {
      const hasuraHeaders: HasuraHeaders = {};
      for (const [name, value] of Object.entries(request.headers)) {
        if (name.startsWith('x-hasura-') && value !== undefined)
          hasuraHeaders[name] = value;
      }
      const unsafeHeaders: HasuraHeaders = {};
      for (const name of FORBIDDEN_UPSTREAM_HEADERS) {
        const value = request.headers[name];
        if (value !== undefined) unsafeHeaders[name] = value;
      }

      const capturedRequest: CapturedRequest = {
        body: Buffer.concat(chunks).toString('utf8'),
        connection: request.headers.connection ?? '',
        hasuraHeaders,
        method: request.method ?? '',
        path: request.url ?? '',
        unsafeHeaders,
      };
      upstreamRequests.push(capturedRequest);

      response.statusCode = 200;
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify(capturedRequest));
    });
  });
  const upstreamOrigin = await listen(upstream);

  const app = express();
  app.use((request, response, next) => {
    response.on('finish', () => {
      const hasuraHeaders: HasuraHeaders = {};
      for (const [name, value] of Object.entries(request.headers)) {
        if (name.startsWith('x-hasura-') && value !== undefined)
          hasuraHeaders[name] = value;
      }
      completedExpressHasuraHeaders.push(hasuraHeaders);
    });
    next();
  });
  app.use((request, _response, next) => {
    request.isAuthenticated =
      function isAuthenticated(): this is Express.AuthenticatedRequest {
        return authenticated;
      };
    next();
  });
  registerFerryProxy(app, {
    adminSecret: TRUSTED_ADMIN_SECRET,
    target: upstreamOrigin,
  });
  // Mirror production middleware order so body-parser regressions are visible.
  app.use(express.urlencoded({ extended: true }));
  app.use((_request, response) => {
    response.status(404).json({ error: 'NOT_FOUND' });
  });

  const api = createServer(app);
  const origin = await listen(api);

  return {
    async close() {
      await close(api);
      await close(upstream);
    },
    completedExpressHasuraHeaders,
    origin,
    reset() {
      authenticated = false;
      completedExpressHasuraHeaders.length = 0;
      upstreamRequests.length = 0;
    },
    setAuthenticated(value) {
      authenticated = value;
    },
    upstreamRequests,
  };
}

void describe('Ferry proxy', () => {
  // Initialized by the suite's `before` hook.
  // eslint-disable-next-line init-declarations
  let fixture: FerryFixture;

  before(async () => {
    fixture = await createFerryFixture();
  });

  beforeEach(() => fixture.reset());

  after(async () => {
    await fixture.close();
  });

  void test('forwards an anonymous GraphQL POST with its query string and body', async () => {
    const body = JSON.stringify({ query: 'query Catalog { seasons }' });

    const response = await sendRequest(
      fixture.origin,
      '/ferry/v1/graphql?operation=Catalog',
      {
        body,
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      },
    );

    assert.equal(response.status, 200);
    assert.deepEqual(fixture.upstreamRequests, [
      {
        body,
        connection: 'close',
        hasuraHeaders: {
          'x-hasura-admin-secret': TRUSTED_ADMIN_SECRET,
          'x-hasura-role': 'anonymous',
        },
        method: 'POST',
        path: '/v1/graphql?operation=Catalog',
        unsafeHeaders: {},
      },
    ]);
  });

  void test('forwards an authenticated GraphQL GET with the student role', async () => {
    fixture.setAuthenticated(true);

    const response = await sendRequest(
      fixture.origin,
      '/ferry/v1/graphql?query=query%20Catalog%20%7B%20seasons%20%7D',
    );

    assert.equal(response.status, 200);
    assert.deepEqual(fixture.upstreamRequests, [
      {
        body: '',
        connection: 'close',
        hasuraHeaders: {
          'x-hasura-admin-secret': TRUSTED_ADMIN_SECRET,
          'x-hasura-role': 'student',
        },
        method: 'GET',
        path: '/v1/graphql?query=query%20Catalog%20%7B%20seasons%20%7D',
        unsafeHeaders: {},
      },
    ]);
  });

  void test('injects trusted headers before forwarding Expect: 100-continue', async () => {
    const body = JSON.stringify({ query: 'mutation Test { test }' });

    const response = await sendRequest(fixture.origin, '/ferry/v1/graphql', {
      body,
      headers: {
        'content-type': 'application/json',
        Expect: '100-continue',
      },
      method: 'POST',
      waitForContinue: true,
    });

    assert.equal(response.status, 200);
    assert.deepEqual(fixture.upstreamRequests, [
      {
        body,
        connection: 'close',
        hasuraHeaders: {
          'x-hasura-admin-secret': TRUSTED_ADMIN_SECRET,
          'x-hasura-role': 'anonymous',
        },
        method: 'POST',
        path: '/v1/graphql',
        unsafeHeaders: {},
      },
    ]);
  });

  void test('streams URL-encoded GraphQL bodies without consuming them', async () => {
    const body = 'query=mutation%20Test%20%7B%20test%20%7D';

    const response = await sendRequest(fixture.origin, '/ferry/v1/graphql', {
      body,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    });

    assert.equal(response.status, 200);
    assert.deepEqual(fixture.upstreamRequests, [
      {
        body,
        connection: 'close',
        hasuraHeaders: {
          'x-hasura-admin-secret': TRUSTED_ADMIN_SECRET,
          'x-hasura-role': 'anonymous',
        },
        method: 'POST',
        path: '/v1/graphql',
        unsafeHeaders: {},
      },
    ]);
  });

  for (const path of BLOCKED_FERRY_PATHS) {
    void test(`rejects non-GraphQL raw path ${JSON.stringify(path)}`, async () => {
      const response = await sendRequest(fixture.origin, path);

      assert.equal(response.status, 404);
      assert.equal(fixture.upstreamRequests.length, 0);
    });
  }

  for (const method of BLOCKED_FERRY_METHODS) {
    void test(`rejects unsupported GraphQL method ${method}`, async () => {
      const response = await sendRequest(fixture.origin, '/ferry/v1/graphql', {
        method,
      });

      assert.equal(response.status, 405);
      assert.equal(response.headers.allow, 'GET, POST');
      assert.equal(fixture.upstreamRequests.length, 0);
    });
  }

  void test('replaces all client Hasura headers only on the outbound request', async () => {
    const body = 'test';
    const response = await sendRequest(fixture.origin, '/ferry/v1/graphql', {
      body,
      headers: {
        Connection: 'upgrade, x-hasura-role, x-remove-me',
        'Keep-Alive': 'timeout=5',
        'Proxy-Authenticate': 'Basic client-controlled',
        'Proxy-Authorization': 'Basic client-controlled',
        TE: 'trailers',
        Trailer: 'X-Checksum',
        'X-Hasura-Access-Key': 'legacy-client-secret',
        'X-Hasura-Admin-Secret': ['client-secret-one', 'client-secret-two'],
        'X-Hasura-Allowed-Roles': 'admin, student',
        'X-Hasura-Custom-Session': 'client-controlled',
        'X-Hasura-Role': ['admin', 'superuser'],
        'X-Hasura-Use-Backend-Only-Permissions': 'true',
        'X-Hasura-User-Id': 'victim',
        'X-Remove-Me': 'client-controlled',
      },
      method: 'POST',
    });

    assert.equal(response.status, 200);
    assert.deepEqual(fixture.upstreamRequests, [
      {
        body,
        connection: 'close',
        hasuraHeaders: {
          'x-hasura-admin-secret': TRUSTED_ADMIN_SECRET,
          'x-hasura-role': 'anonymous',
        },
        method: 'POST',
        path: '/v1/graphql',
        unsafeHeaders: {},
      },
    ]);
    assert.deepEqual(fixture.completedExpressHasuraHeaders, [{}]);
  });
});
