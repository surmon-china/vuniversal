
export const DEV_SERVER_RUN_FAILED = 'Dev server run failed'
export const FAILED_TO_COMPILE = 'Failed to compile'
export const FAILED_TO_BUNDLING = 'Failed to bundling'

export function yourApplicationIsRunningAt(url: string) {
  return `Your application is running at: ${url}`
}

export function compiledSuccessfully(name = '') {
  return `Compiled ${name} successfully`.replace(/\s+/g, ' ')
}

export function compiling(name = '') {
  const text = `${name} compiling...`.replace(/\s+/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
