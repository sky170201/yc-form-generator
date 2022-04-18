const path = require('path')

function resolve (dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    configureWebpack: {
        externals: {
            vue: 'Vue',
            'vue-router': 'VueRouter',
            'element-ui': 'ELEMENT'
        }
    },
    chainWebpack (config) {
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons')) // url-loader 处理排除src/icons外的其他svg结尾的图片
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
        	.include.add(resolve('src/icons')) // svg-sprite-loader只处理src/icons下的svg图片
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    }
}
