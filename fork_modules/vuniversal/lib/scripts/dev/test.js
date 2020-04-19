
const vm = require('vm')
const http = require('http')
const { vol }  = require('memfs')

// const serverjs = vol.readFileSync('/Users/surmon/Projects/JavaScript/NPM/vuniversal/.vun/server.js', 'utf8').toString()
// console.log('--------test', vol)
const script = process.argv[3]

function run() {
  eval(script)
}

module.exports = run.call(global)
// module.exports = new vm.Script(code, { filename: 'server.js' }).runInThisContext()

// http.createServer((req, res) => {
//   res.writeHead(200)
//   res.end('你好世界\n')
// }).listen(8000, () => {
//   console.log('你好世界', global.mfs)
// })

// console.log(`工作进程 ${process.pid} 已启动`)
// new vm.Script('globalVar += 1', { filename: 'server.js' }).runInThisContext()