'use strict';
const path = require('path');


function resolve(dir) {
    return path.join(__dirname, dir);
}

const name ='彩云点餐商家版'; // 标题

const port = process.env.port || process.env.npm_config_port || 8083; // 端口

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
    runtimeCompiler: true,
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.soil.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.soil.vip/admin/，则设置 baseUrl 为 /admin/。
    publicPath: "./" ,
    // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
    outputDir: 'dist',
    // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
    assetsDir: 'static',
    // 是否开启eslint保存检测，有效值：ture | false | 'error'
    lintOnSave: process.env.NODE_ENV === 'development',
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    // webpack-dev-server 相关配置
    devServer: {
        host: '10.3.7.78',
        port: port,
        open: true,
        proxy: {
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            [process.env.VUE_APP_BASE_API]: {
              //  target: `https://order.ynejkj.com/api/order`,
                 target: `http://10.3.7.63:8080/order`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            },
            // [process.env.VUE_APP_BASE_API_DEDUCT]: {
            //   target: `https://yn.icbc.com.cn/corp/api/ecommunity-test`,
            //   // target: `http://ip.ynejkj.com:10080/soil-api-dev/`,
            //   changeOrigin: true,
            //   pathRewrite: {
            //     ['^' + process.env.VUE_APP_BASE_API_DEDUCT]: ''
            //   }
            // },
        },
        disableHostCheck: true
    },
    chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src')).set('vue', resolve('./node_modules/vue'))
	},
};
