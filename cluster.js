const cluster = require('cluster')
const http = require('http')
const path = require('path')
const numCPUs = require('os').cpus().length
const { fs, vol }  = require('memfs')

global.test = 'test'
fs.writeFileSync('/test2.txt', `console.log`)

cluster.setupMaster({
  exec: path.join(__dirname, 'test.js'),
  // exec: '',
  // args: ['--eval="console.log(3)"']
  // args: ['--eval="console.log(3)"', `console.log('xzxczxc')`]
  args: ['-e', `console.log('xzxczxc')`]
  // args: ['-js', `console.log('xzxczxc')`]
  // execArgv: [`--js=console.log('xzxczxc')`]
  // execArgv: [`--js=console.log('xzxczxc')`]
  // execArgv: ['--eval="console.log(3)"']
})
cluster.on('online', _ => {
  console.log('-------cluster online')
  console.log('-------cluster test', fs.readFileSync('/test2.txt', 'utf8'))
})
cluster.fork()

// if (cluster.isMaster) {
//   console.log(`主进程 ${process.pid} 正在运行`);

//   // 衍生工作进程。
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`工作进程 ${worker.process.pid} 已退出`);
//   });
// } else {
//   // 工作进程可以共享任何 TCP 连接。
//   // 在本例子中，共享的是 HTTP 服务器。
//   http.createServer((req, res) => {
//     res.writeHead(200);
//     res.end('你好世界\n');
//   }).listen(8000);

//   console.log(`工作进程 ${process.pid} 已启动`);
// }