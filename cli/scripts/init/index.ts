import readline from 'readline'
// import program from 'program'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 检测到你已经存在 vun.config.js 文件了，是否覆盖
// TODO: 选择语言
// TODO: 检测到当前是 vue 项目，是否从 vue.config.js 自动推断
// TODO: 检测到当前是 nuxt 项目，是否从 nuxt.config.js 自动推断

// TODO: xxx
rl.question('检测到你使用了 Typescript 创建项目？ ？', (answer) => {
  console.log(`感谢您的宝贵意见：${answer}`)
  // fs.writeFile('/xxx/vun.config.js', `module.exports = { ${config} }`)
  rl.close()
})
