const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
/*
 * actual link: https://app.nanonets.com/api/v2/ObjectDetection/Model/{modelId}/LabelFile/
 * 
 * code below converts [  /api/  ]  ---> [  https://app.nanonets.com/api/   ]
 * /api/v2/OCR/Model/${modelId}/LabelFile/  ---> https://app.nanonets.com/api/v2/ObjectDetection/Model/{modelId}/LabelFile/
 * 
 * User sends a request (localhost:3000/api/) to React server 
 * React forwards the request to backend server. (Django)
 */
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://app.nanonets.com',
      changeOrigin: true,
    })
  );
  /*app.use(
    '/back',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite:{ '^/back/':'/' }
    })
  );*/
};