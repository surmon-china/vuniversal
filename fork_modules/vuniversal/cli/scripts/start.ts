
import { NodeEnv } from '../environment'

// @ts-ignore
process.noDeprecation = true
process.env.NODE_ENV = NodeEnv.Production

// 如果是 客户端/静态 打包，我应该启动一个 nodejs 服务器
// 如果是 SSR，应该 require server.js 文件即可 
