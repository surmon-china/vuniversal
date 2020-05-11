#!/usr/bin/env node

// Init stdout interceptor
require('../cli-dist/services/stdout').init()
const script = process.argv[2]
const chalk = require('chalk')
const logger = require('../cli-dist/services/logger').default

// Overlay global console
global.console.log = logger.log
global.console.info = logger.info
global.console.warn = logger.warn
global.console.debug = logger.debug
global.console.error = logger.error

function logHelp() {
  logger.log(
    `\n  Usage: ${chalk.green('vun <command>')} [options]\n` +
    `\n  Commands:\n`
  )
  const commands = {
    init: 'Create vuniversal config file (vun.config.js)',
    dev: 'Start the application in development mode (e.g. hot-code reloading, error reporting)',
    build: 'Compiles the application for production deployment (server-rendered/spa-prerender)',
    test: 'Run test',
    help: 'Shows help for vuniversal'
  }
  Object.keys(commands).forEach(command => {
    logger.log(`    ${chalk.green(command.padEnd(8))} ${commands[command]}`)
  })
  logger.br()
}

switch (script) {
  case 'init':
    require('../cli-dist/scripts/init')
    break
  case 'build':
    require('../cli-dist/scripts/build')
    break
  case 'test':
    require('../cli-dist/scripts/test')
    break
  case 'dev':
  case undefined:
    require('../cli-dist/scripts/dev')
    break
  case 'help':
    logHelp()
    break
  default:
    logger.error(`command "${script}" does not exist.`)
}
