const path = require('path')
const merge = require('webpack-merge')

module.exports = {
    chainWebpack: config => {
        config.module
            .rule('wasm')
            .test(/\.rs$/)
            .use('rust-wasm-loader')
                .loader('rust-wasm-loader')
                .options({
                    path: 'dist/'
                })
        }
}