// vue.config.js
module.exports = {
  chainWebpack: config => {
    
    config.module
      .rule('raw')
      .test(/\.compiled$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}
