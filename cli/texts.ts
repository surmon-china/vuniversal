export const VUN_COMMND = 'vun'
export const DEV_SERVER_RUN_FAILED = 'Dev server runs failed!'
export const DEV_SERVER_RUN_SUCCESSFULLY = 'Dev server runs successfully!'

export const FAILED_TO_COMPILE = 'Failed to compile!'
export const COMPILED_SUCCESSFULLY = 'Compiled successfully!'
export const FAILED_TO_VALIDATION = 'Failed to validation!'

export function projectIsRunningAt(url: string) {
  return `Project is running at: ${url}`
}

export function compiledSuccessfully(name = '') {
  return `Compiled ${name} successfully`.replace(/\s+/g, ' ')
}

export function compiling(name = '') {
  const text = `${name} compiling...`.replace(/\s+/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
