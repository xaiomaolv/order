// 所有生产环境
const prodPlugin = []

if (process.env.NODE_ENV === 'production') {

  // 如果是生产环境，则自动清理掉打印的日志，但保留error 与 warn
  prodPlugin.push([
    'transform-remove-console',
    {
      // 不清理的内容
      exclude: ['error', 'warn'] // 保留 console.error 与 console.warn
    }
  ])
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
	plugins: [
		...prodPlugin
	]
}
