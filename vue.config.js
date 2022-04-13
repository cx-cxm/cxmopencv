const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: './', // 本番環境にupした際、directry構成が崩れないようにするため超重要!!
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'タイトル'
    }
  }
})
