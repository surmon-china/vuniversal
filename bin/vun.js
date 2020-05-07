#!/usr/bin/env node

const script = process.argv[2]

switch (script) {
  case 'build':
    require('../cli-dist/scripts/build')
  case 'test':
    require('../cli-dist/scripts/test')
  case '':
  case 'dev':
    require('../cli-dist/scripts/dev')
  default:
    require('../cli-dist/scripts/dev')
    break
}
