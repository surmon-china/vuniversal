let lastLineIsEmptyLine = false
const handleOutput = (...args: any[]) => {
  const chunk = args[0]
  if (typeof chunk === 'string') {
    if (chunk.trim() === '') {
      // console.log() === br
      lastLineIsEmptyLine = true
    } else if (chunk.trim().endsWith('\n\n')) {
      // console.log('\n\n') === br
      lastLineIsEmptyLine = true
    } else {
      // not br
      lastLineIsEmptyLine = false
    }
  }
}

export const isBrLastLine = () => lastLineIsEmptyLine
export const init = () => {
  // stdout
  const originalStdoutWrite = process.stdout.write.bind(process.stdout)
  process.stdout.write = (...args: any[]) => {
    handleOutput(...args)
    // @ts-ignore
    return originalStdoutWrite(...args)
  }

  // stderr
  // keep default: webpackbar use stderr ...
  // const originalStderrWrite = process.stderr.write.bind(process.stderr)
  // process.stderr.write = (...args: any[]) => {
  //   handleOutput(...args)
  //   // @ts-ignore
  //   return originalStderrWrite(...args)
  // }
}
