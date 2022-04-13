const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './' // 本番環境にupした際、directry構成が崩れないようにするため超重要!!
})
