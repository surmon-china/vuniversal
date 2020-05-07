#!/usr/bin/env node

const script = process.argv[2]

switch (script) {
  case 'build':
    require('../cli-dist/scripts/build')
    break
  case 'test':
    require('../cli-dist/scripts/test')
    break
  case '':
  case 'dev':
    require('../cli-dist/scripts/dev')
    break
  default:
    require('../cli-dist/scripts/dev')
}
