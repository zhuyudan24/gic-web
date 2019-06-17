module.exports = {
  proxyList: {
    '/api-auth/': {
      target: 'http://gicdev.demogic.com/api-auth/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-auth': ''
      }
    },
     '/api-plug/': {
      target: 'http://gicdev.demogic.com/api-plug/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-plug': ''
      }
    },
    '/api-admin/': {        // 基础模块，线上
      target: 'http://gicdev.demogic.com/api-admin/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-admin': ''
      }
    },
    
    // '/api-admin': {      // 门店标签，  测试 --- 陶光胜
    //   target: 'http://192.168.1.155:81/api-admin/',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/api-admin': ''
    //   }
    // },
    '/api-report/': {        // 积分结算
      target: 'http://gicdev.demogic.com/api-report/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-report': ''
      }
    },
    '/api-mall/': {
      target: 'http://gicdev.demogic.com/api-mall/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-mall': ''
      }
    }
  }
}
