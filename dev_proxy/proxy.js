const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');
const axios = require('axios').default;

const app = express();
const port = 8080;
const insecure_port = process.env.PORT || 3001;
const frontend_uri = process.env.FRONTEND_LOC || 'http://frontend:3000';
const api_uri = process.env.CHALLENGE_LOC || 'http://api:4096';
const php_uri = 'http://nginx:8080';

// Enable request logging.
app.use(morgan('tiny'));

// Strip all headers matching X-COURSETABLE-* from incoming requests.
app.use((req, _, next) => {
  for (const [header, _] of Object.entries(req.headers)) {
    // Headers are automatically made lowercase by express.
    if (header.startsWith('x-coursetable-')) {
      delete req.headers[header];
    }
  }

  next();
});

// Authentication - set X-COURSETABLE-* headers.
const authSoft = (req, _, next) => {
  axios
    .get(`${php_uri}/AuthStatus.php`, {
      headers: {
        cookie: req.headers['cookie'],
      },
    })
    .then(({ data }) => {
      req.headers['x-coursetable-authd'] = data.success;
      req.headers['x-coursetable-netid'] = data.netId;
      return next();
    })
    .catch(err => {
      return next(err);
    });
};

// Authentication - reject all unauthenticated requests.
const authHard = (req, res, next) => {
  axios
    .get(`${php_uri}/AuthStatus.php`, {
      headers: {
        cookie: req.headers['cookie'],
      },
    })
    .then(({ data }) => {
      if (data.success) {
        return next();
      }
      // Return 403 forbidden if the request lacks auth.
      res.status(403).send('request missing authentication');
    })
    .catch(err => {
      return next(err);
    });
};

// Setup all the proxy routes.

app.use(
  ['/legacy_api', '/index.php'],
  createProxyMiddleware({
    target: php_uri,
    pathRewrite: {
      '^/legacy_api': '/', // remove base path
    },
    xfwd: true,
  })
);

app.use('/ferry', authHard);
app.use(
  '/ferry',
  createProxyMiddleware({
    target: 'http://graphql-engine:8080',
    pathRewrite: {
      '^/ferry': '/', // remove base path
    },
    ws: true,
  })
);

app.use('/api', authSoft);
app.use(
  '/api',
  createProxyMiddleware({
    target: api_uri,
  })
);

app.use(
  '/sockjs-node',
  createProxyMiddleware({
    target: frontend_uri,
    ws: true,
  })
);
app.use(
  '/',
  createProxyMiddleware({
    target: frontend_uri,
  })
);

// Serve with SSL.
https
  .createServer(
    {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    },
    app
  )
  .listen(port, () => {
    console.log(`Secure dev proxy listening on port ${port}`);
  });
app.listen(insecure_port, () => {
  console.log(`insecure dev proxy listening on port ${insecure_port}`);
});
