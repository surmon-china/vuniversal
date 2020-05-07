#!/usr/bin/env ts-node-script

const script = process.argv[2]

switch (script) {
  case 'build':
    require('../cli/scripts/build')
  case 'test':
    require('../cli/scripts/test')
  case '':
  case 'dev':
    require('../cli/scripts/dev')
  default:
    require('../cli/scripts/dev')
    break
}
