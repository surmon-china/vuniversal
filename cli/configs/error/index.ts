import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import notifier from '@cli/services/notifier'
import { FAILED_TO_COMPILE } from '@cli/texts'
import { transformer, formatter } from './transformer'

export const createFriendlyErrorsWebpackPlugin = (options?: FriendlyErrorsWebpackPlugin.Options) => {
  return new FriendlyErrorsWebpackPlugin({
    clearConsole: false,
    additionalTransformers: [transformer],
    additionalFormatters: [formatter],
    onErrors: (severity, errors) => {
      if (severity === 'error') {
        const [error] = errors
        const { name, file, webpackError } = error as any
        const { rawMessage } = webpackError
        notifier.notify(
          name
            ? `SEVERITY: ${name}`
            : rawMessage
              ? rawMessage
              : `FILE: ${file}`,
          FAILED_TO_COMPILE
        )
      }
    },
    ...options
  })
}
