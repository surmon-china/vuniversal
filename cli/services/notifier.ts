// https://github.com/mikaelbr/node-notifier
import path from 'path'
import notifier from 'node-notifier'
import { VUN_NAME } from '../paths'

export function notify(message: string, title?: string, options?: any) {
  notifier.notify({
    title: title || `${VUN_NAME} message!`,
    message,
    timeout: 2600,
    icon: path.join(__dirname, '..', '..', 'presses', 'notify.png'),
    sound: true,
    ...options
    // wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  })
}

export function successfully(message: string) {
  notify(`${VUN_NAME} successfully!`, message)
}

export function failed(message: string) {
  notify(`${VUN_NAME} failed!`, message)
}

export default {
  notify,
  successfully,
  failed
}
