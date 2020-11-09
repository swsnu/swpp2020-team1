const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://app.nanonets.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/back',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite:{ '^/back/':'/' }
    })
  );
};