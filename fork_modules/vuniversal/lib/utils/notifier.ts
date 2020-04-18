
// https://github.com/mikaelbr/node-notifier
import notifier from 'node-notifier'
import { VUN_NAME } from '../constants'

export function notify(message: string, title?: string, options?: any) {
  notifier.notify({
    title: title || `${VUN_NAME} message!`,
    message,
    timeout: 2600,
    ...options
    // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
    // sound: true, // Only Notification Center or Windows Toasters
    // wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  })
}

export function success(message: string) {
  notify(`${VUN_NAME} successfuly!`, message, {
    icon: 'xxx'
  })
}