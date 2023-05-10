const {
	defineConfig
} = require('@vue/cli-service')
const {
	VantResolver
} = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

// const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path')
// 路径处理方法
function resolve (dir) {
	return path.join(__dirname, dir)
}

module.exports = defineConfig({
	transpileDependencies: true,
	lintOnSave: false,
	publicPath: './',
	outputDir: 'dist',
	assetsDir: 'static',// 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
	productionSourceMap: false,
	devServer: {
		proxy: {
			[process.env.VUE_APP_BASE_API]: {
				// target: `http://10.3.7.228:8080/order`,
				target: `https://order.ynejkj.com/api/order`,
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					['^' + process.env.VUE_APP_BASE_API]: ''
				}
			}
		}
	},
	configureWebpack: {
		plugins: [
			ComponentsPlugin({
				resolvers: [VantResolver()],
			}),
		],
		resolve: {
			extensions: ['.vue', '.js', '.json', 'scss', 'css'],
			alias: {
				'@': resolve('src')
			},
			modules: [resolve('src'), 'node_modules']
		},
		module: {},
	},
	chainWebpack: (config) => {
		// 解决引入vant require is not defined at eval (index.mjs?732c:1:1)at ./node_modules/.store/vant@3.6.11/node_modules/vant/es/icon/style/index.mjs
		config.module
			.rule("mjs$")
			.test(/.mjs$/)
			.include.add(/node_modules/)
			.end()
			.type("javascript/auto")

		// 配置网页标签title
		config
			.plugin('html')
			.tap(args => {
				args[0].title = '彩云点餐'

				// args[0].cdn = []
				return args
			})
		
		// 开启gzip压缩
		config
			.plugin('CompressionPlugin')
			.use('compression-webpack-plugin', [{
				filename: '[path][base].gz',
				algorithm: 'gzip',
				test: /\.js$|\.css$|\.html$/,
				threshold: 10240, // 只处理比这个值大的资源。按字节计算
				minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
			}])
			
		// 代码分割
		config
			.optimization.splitChunks({
				cacheGroups: {
					styles: {
						name: 'styles',
						test: /\.(s?css|less|sass)$/,
						chunks: 'all',
						priority: 10
					},
					common: {
						name: 'chunk-common',
						chunks: 'all',
						minChunks: 2, // 拆分前必须共享模块的最小 chunks 数。
						maxInitialRequests: 5, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
						minSize: 0, // 生成 chunk 的最小体积（≈ 20kb)
						priority: 1, // 优化将优先考虑具有更高 priority（优先级）的缓存组
						reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
					},
					vendors: {
						name: 'chunk-vendors',
						test: /[\\/]node_modules[\\/]/,
						chunks: 'all',
						priority: 2,
						reuseExistingChunk: true
					},
					lrucache: {
						name: 'chunk-lrucache',
						test: /[\\/]node_modules[\\/]_?lru-cache(.*)/,
						chunks: 'all',
						priority: 3,
						reuseExistingChunk: true
					}
				}
			})
	},

})
