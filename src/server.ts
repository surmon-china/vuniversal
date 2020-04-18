import express from 'express'
import { createVueApp } from './main'
import { vuniversalMiddleware } from '../fork_modules/vuniversal/vuniversal'

const config = require('../vun.config')
const app = express()

app.disable('x-powered-by')
app.use(vuniversalMiddleware({ appCreater: createVueApp }))

const server = app.listen(config.port, () => {
  console.log(`App run: http://localhost:3000`)
})

if ((module as any).hot) {
  ;(module as any).hot.accept()
  ;(module as any).hot.dispose(() => server.close())
}
