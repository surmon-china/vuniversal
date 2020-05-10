import chalk from 'chalk'

enum LogTypes {
  Warn = 'warn',
  Debug = 'debug',
  Info = 'info',
  Error = 'error',
  Start = 'start',
  Done = 'done'
}

const logStyles = {
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

const consoleLog = global.console.log
const consoleDir = global.console.dir

const write = (type: LogTypes, text: string, verbose?: any) => {
  const logType = logStyles[type]
  const isObjectVerbose = typeof verbose === 'object'
  // const needBr = [LogTypes.Start, LogTypes.Done, LogTypes.Warn, LogTypes.Debug].includes(type)
  const textToLog = logType.bg.black(logType.msg) + ' ' + logType.text(text)

  // Adds optional verbose output
  // needBr && consoleLog()
  if (isObjectVerbose) {
    consoleLog(textToLog)
    consoleDir(verbose, { depth: 15 })
  } else {
    consoleLog(
      !!verbose
        ? textToLog + `\n${verbose}`
        : textToLog
    )
  }
  consoleLog()
}

// Printing any statements
const log = (...text: string[]) => consoleLog(...text)
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
  // consoleLog()
  consoleLog(logContent)
  consoleLog()
}
const errors = (text: string, errors: Array<Error | string>) => {
  const errorLog = logStyles[LogTypes.Error]
  consoleLog(errorLog.bg.black(errorLog.msg) + ' ' + errorLog.text(text) + `(${errors.length} errors)`)
  consoleLog()
  errors.forEach(_error => {
    typeof _error === 'string'
      ? consoleLog(errorLog.text(_error))
      : write(LogTypes.Error, _error.name || _error.message, _error.stack)
    consoleLog()
  })
}

const br = () => consoleLog()
const clear = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}

export default {
  log,
  info,
  debug,
  warn,
  start,
  done,
  error,
  errors,
  clear,
  br
}
