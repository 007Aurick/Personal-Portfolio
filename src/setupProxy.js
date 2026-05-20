const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.SPOTIFY_LOCAL_API_TARGET || 'http://127.0.0.1:4398';

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      logLevel: 'warn',
    }),
  );
};
