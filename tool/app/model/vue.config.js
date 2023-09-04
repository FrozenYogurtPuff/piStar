const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: './',
  configureWebpack: {
    devtool: 'source-map'
  }
})
