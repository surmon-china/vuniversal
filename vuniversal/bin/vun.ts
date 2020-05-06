#!/usr/bin/env node

const script = process.argv[2]

switch (script) {
  case 'start':
    require('../lib/scripts/start')
  case 'build':
    require('../lib/scripts/build')
  case 'test':
    require('../lib/scripts/test')
  case '':
  case 'dev':
    require('../lib/scripts/dev')
  default:
    require('../lib/scripts/dev')
    break
}
