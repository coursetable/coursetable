const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const https = require('https');

const app = express();
const port = 8080;
const insecure_port = process.env.PORT || 3001;
const frontend_uri = process.env.FRONTEND_LOC || "http://frontend:3000";

app.use(
  ['/legacy_api', '/index.php'],
  createProxyMiddleware({
    target: 'http://nginx:8080/',
    pathRewrite: {
      '^/legacy_api': '/', // remove base path
    },
    xfwd: true,
  })
);

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
  '/',
  createProxyMiddleware({
    target: frontend_uri,
    ws: true,
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
