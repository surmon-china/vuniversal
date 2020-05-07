#!/usr/bin/env node

const script = process.argv[2]

switch (script) {
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
