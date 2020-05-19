import chalk from 'chalk'
import { Console } from 'console'
import { isBrLastLine } from './stdout'

export enum LogTypes {
  Warn = 'warn',
  Debug = 'debug',
  Info = 'info',
  Error = 'error',
  Start = 'start',
  Done = 'done'
}

export const logStyles = {
  [LogTypes.Warn]: {
    bg: chalk.bgYellow,
    text: chalk.yellow,
    msg: ' WARNING '
  },
  [LogTypes.Debug]: {
    bg: chalk.bgMagenta,
    text: chalk.magenta,
    msg: ' DEBUG '
  },
  [LogTypes.Info]: {
    bg: chalk.bgCyan,
    text: chalk.cyan,
    msg: ' INFO '
  },
  [LogTypes.Error]: {
    bg: chalk.bgRed,
    text: chalk.red,
    msg: ' ERROR '
  },
  [LogTypes.Start]: {
    bg: chalk.bgBlue,
    text: chalk.blue,
    msg: ' WAIT '
  },
  [LogTypes.Done]: {
    bg: chalk.bgGreen,
    text: chalk.green,
    msg: ' DONE '
  }
}

export const yellowText = (text: string) => logStyles[LogTypes.Warn].text(text)
export const greenText = (text: string) => logStyles[LogTypes.Done].text(text)
export const blueText = (text: string) => logStyles[LogTypes.Info].text(text)
export const linkText = (text: string) => logStyles[LogTypes.Info].text.underline(text)
export const redText = (text: string) => logStyles[LogTypes.Error].text(text)
export const loggerConsole = new Console(process.stdout, process.stderr)

const br = () => {
  loggerConsole.log()
}

const clear = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

const autoPreBr = () => {
  if (!isBrLastLine()) {
    br()
  }
}

const write = (type: LogTypes, text: string, verbose?: any) => {
  const logType = logStyles[type]
  const isObjectVerbose = typeof verbose === 'object'
  const textToLog = logType.bg.black(logType.msg) + ' ' + logType.text(text)
  autoPreBr()
  if (isObjectVerbose) {
    loggerConsole.log(textToLog)
    loggerConsole.dir(verbose, { depth: 15 })
  } else {
    loggerConsole.log(
      !!verbose
        ? textToLog + `\n${verbose}`
        : textToLog
    )
  }
  br()
}

// Printing any statements
const log = (...text: string[]) => loggerConsole.log(...text)
// Starting a process
const start = (text: string) => write(LogTypes.Start, text)
// Ending a process
const done = (text: string) => write(LogTypes.Done, text)
// Info about a process task
const info = (text: string) => write(LogTypes.Info, text)
// Verbose output
const debug = (text: string, data?: any) => write(LogTypes.Debug, text, data)
// Warn output
const warn = (text: string, data?: any) => write(LogTypes.Warn, text, data)
// Error output
const error = (text: string | Error, error?: Error) => {
  const errorLog = logStyles[LogTypes.Error]
  let logContent = errorLog.bg.black(errorLog.msg) + ' '
  if (typeof text === 'string') {
    logContent += errorLog.text(text)
    if (error) {
      logContent += `\n\n${errorLog.text(error.stack || error.message || error)}`
    }
  } else {
    logContent += errorLog.text(text.stack || text.message || text)
  }
  autoPreBr()
  loggerConsole.error(logContent)
  br()
}
// Errors output
const errors = (text: string, errors: Array<Error | string>) => {
  const errorLog = logStyles[LogTypes.Error]
  autoPreBr()
  loggerConsole.error(errorLog.bg.black(errorLog.msg) + ' ' + errorLog.text(text) + `(${errors.length} errors)`)
  errors.forEach(_error => error(_error))
}

export default {
  br,
  autoPreBr,
  clear,
  log,
  info,
  debug,
  warn,
  start,
  done,
  error,
  errors
}
