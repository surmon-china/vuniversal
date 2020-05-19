#!/usr/bin/env node

// Init stdout interceptor
require('../cli-dist/services/stdout').init()
const open = require('open')
const semver = require('semver')
const program = require('commander')
const didYouMean = require('didyoumean')
const loggerService = require('../cli-dist/services/logger')
const { vunPackageJSON } = require('../cli-dist/configs/package')
const { APP_VUN_CONFIG_FILE, VUN_DOC_URL } = require('../cli-dist/paths')
const { VUN_COMMND, VUNIVERSAL_NAME } = require('../cli-dist/texts')
const { default: logger, yellowText, greenText, linkText, redText } = loggerService

// Overlay global console
global.console.warn = logger.warn
global.console.error = logger.error

didYouMean.threshold = 0.6

 // Check Node version
 const currentVersion = process.version
 const targetVersion = vunPackageJSON.engines.node
 if (!semver.satisfies(currentVersion, targetVersion)) {
  logger.error(`You are using Node ${currentVersion}, but this version of ${VUNIVERSAL_NAME} requires Node ${targetVersion}.\n\nPlease upgrade your Node version.`)
  process.exit(1)
}

program
  .name(VUN_COMMND)
  .usage('<command>')
  .version(vunPackageJSON.version, '-v, --version', `Output the ${VUNIVERSAL_NAME} version number`)
  .helpOption('-h, --help', `Display help for ${VUN_COMMND} command`)

program
  .command('init')
  .description(`Create ${VUNIVERSAL_NAME} config file ${greenText('(' + APP_VUN_CONFIG_FILE + ')')}`)
  .action(() => require('../cli-dist/scripts/init'))

program
  .command('dev')
  .description(`Start the application in ${greenText('development')} mode (e.g. hot-code reloading, error reporting)`)
  .action(() => require('../cli-dist/scripts/dev'))

program
  .command('build')
  .description(`Compiles the application for ${greenText('production')} deployment ${greenText('(ssr/spa/prerender)')}`)
  .action(() => require('../cli-dist/scripts/build'))

program
  .command('doc')
  .description(`Open documentation site: ${linkText(VUN_DOC_URL)}`)
  .action(() => open(VUN_DOC_URL))

program
  .arguments('[command]')
  .action(command => {
    if (command === undefined) {
      require('../cli-dist/scripts/dev')
    } else {
      const warnText = redText(`Unknown command ${yellowText(VUN_COMMND + ' ' + command)}`)
      const suggestion = didYouMean(command, program.commands.map(cmd => cmd._name))
      logger.br()
      logger.log(
        suggestion
          ? warnText + ',' + redText(` Did you mean ${yellowText(VUN_COMMND + ' ' + suggestion)} ?`)
          : warnText + '.'
      )
      logger.br()
      program.outputHelp()
      logger.br()
    }
  })

program.parse(process.argv)
