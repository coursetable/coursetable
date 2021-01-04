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
    .get(`${api_uri}/api/auth/check`, {
      headers: {
        cookie: req.headers['cookie'] || null,
      },
    })
    .then(({ data }) => {
      req.headers['x-coursetable-authd'] = data.auth;
      req.headers['x-coursetable-netid'] = data.id;
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

// Authentication - reject all unauthenticated requests.
// If the user does not have evals enabled, these requests are also rejected.
const authHard = (req, res, next) => {
  axios
    .get(`${api_uri}/api/auth/check`, {
      headers: {
        cookie: req.headers['cookie'],
      },
    })
    .then(async ({ data }) => {
      if (!data.auth) {
        // Return 403 forbidden if the request lacks auth.
        return res.status(403).send('request missing authentication');
      }

      let evals_enabled = await axios
        .get(`${php_uri}/CheckEvals.php`, {
          headers: {
            'x-coursetable-netid': data.id,
          },
        })
        .then((response) => response.data.evaluationsEnabled)
        .catch((err) => {
          return next(err);
        });
      if (!evals_enabled) {
        // Return 403 forbidden since evals are not enabled.
        return res.status(403).send('you must enable evaluations first');
      }

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

// Setup all the proxy routes.

app.use('/legacy_api', authSoft);
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

// Redirection routes for historical pages.
app.get('/Blog', (_, res) => {
  res.redirect('https://legacy.coursetable.com/Blog.html');
});
app.get('/recommendations.htm', (_, res) => {
  res.redirect('https://legacy.coursetable.com/recommendations.htm');
});

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
    xfwd: true,
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
