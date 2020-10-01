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
const php_uri = 'http://nginx:8080';

// Enable request logging.
app.use(morgan('tiny'));

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

app.use('/ferry', (req, res, next) => {
  // Query the backend for authentication status.
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
    .catch((err) => {
      return next(err);
    });
});

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

app.use(
  '/umami',
  createProxyMiddleware({
    target: 'http://umami:3000',
    pathRewrite: {
      '^/umami': '/', // remove base path
    },
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
