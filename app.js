const express = require('express')
const {
  createProxyMiddleware
} = require('http-proxy-middleware');
const app = express()
const port = 9000

// 创建一个自定义代理路由器
const proxyRouter = {
  // 对于特定路径进行不同的代理设置
  '/oauth': {
    target: 'https://www.googleapis.com',
    changeOrigin: true,
    pathRewrite: {
      '^/oauth': '/oauth2/v4/token' // 将路径重写为实际的目标路径
    },
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  },
  '**': {
    target: 'https://generativelanguage.googleapis.com',
    changeOrigin: true,
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  }
};


// 创建代理中间件，并使用自定义路由器
app.use('/', createProxyMiddleware(proxyRouter));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})