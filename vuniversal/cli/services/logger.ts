import chalk from 'chalk'

export enum LogTypes {
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
    bg: chalk.bgHex('#de1e1e'),
    text: chalk.hex('#de1e1e'),
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

const write = (type: LogTypes, text: string, verbose?: any) => {
  const logType = logStyles[type]

  let logObject = false
  let textToLog = logType.bg.black(logType.msg) + ' ' + logType.text(text)

  // Adds optional verbose output
  if (verbose) {
    if (typeof verbose === 'object') {
      logObject = true
    } else {
      textToLog += `\n\n${verbose}`
    }
  }

  console.log(textToLog)
  if (['start', 'done', 'error'].includes(type)) {
    console.log()
  }

  if (logObject) {
    console.dir(verbose, { depth: 15 })
  }
}

// Printing any statements
export const log = (text = '') => console.log(text)
// Starting a process
export const start = (text: string) => write(LogTypes.Start, text)
// Ending a process
export const done = (text: string) => write(LogTypes.Done, text)
// Info about a process task
export const info = (text: string) => write(LogTypes.Info, text)
// Verbose output
// takes optional data
export const debug = (text: string, data?: any) => write(LogTypes.Debug, text, data)
// Warn output
export const warn = (text: string, data?: any) => write(LogTypes.Warn, text, data)
// Error output
// takes an optional error
export const error = (text: string, error?: Error) => write(LogTypes.Error, text, error)
export const errors = (text: string, errors: Array<Error | string>) => {
  const errorLog = logStyles[LogTypes.Error]
  console.log(errorLog.bg.black(errorLog.msg) + ' ' + errorLog.text(text))
  console.log()
  errors.forEach(error => {
    console.log(
      errorLog.text(
        error instanceof Error
          ? error.message || String(error)
          : error
        )
    )
    console.log()
  })
}

export function br(): void {
  console.log('\n')
}

export function clear(): void {
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
