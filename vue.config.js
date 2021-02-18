process.env.VUE_APP_VERSION = require('./package.json').version

const name = 'Quick Typing'

module.exports = {
  pwa: { name },

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = name
      return args
    })
  },

  productionSourceMap: false
}
