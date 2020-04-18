
import express from 'express'
import { createVueApp } from './main'
import { vuniversalMiddleware } from '../fork_modules/vuniversal/vuniversal'
const config = require('../vun.config')

express()
  .disable('x-powered-by')
  .use(vuniversalMiddleware({ appCreater: createVueApp }))
  .listen(config.port, () => {
    console.log(`App  run: http://localhost:3000`)
  })
