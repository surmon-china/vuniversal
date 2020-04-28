const detect = require('detect-port-alt');
const isRoot = require('is-root');
const isInteractive = process.stdout.isTTY;

// 做命令式交互
// https://github.com/SBoudrias/Inquirer.js

function choosePort(host, defaultPort) {
  return detect(defaultPort, host).then(
    port =>
      new Promise(resolve => {
        if (port === defaultPort) {
          return resolve(port);
        }
        const message =
          process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
            ? `Admin permissions are required to run a server on a port below 1024.`
            : `Something is already running on port ${defaultPort}.`;
        if (isInteractive) {
          clearConsole();
          const existingProcess = getProcessForPort(defaultPort);
          const question = {
            type: 'confirm',
            name: 'shouldChangePort',
            message:
              chalk.yellow(
                message +
                  `${existingProcess ? ` Probably:\n  ${existingProcess}` : ''}`
              ) + '\n\nWould you like to run the app on another port instead?',
            default: true,
          };
          inquirer.prompt(question).then(answer => {
            if (answer.shouldChangePort) {
              resolve(port);
            } else {
              resolve(null);
            }
          });
        } else {
          console.log(chalk.red(message));
          resolve(null);
        }
      }),
    err => {
      throw new Error(
        chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) +
          '\n' +
          ('Network error message: ' + err.message || err) +
          '\n'
      );
    }
  );
}

// Checks if PORT and PORT_DEV are available and suggests alternatives if not
module.exports = async () => {
  const port = (process.env.PORT && parseInt(process.env.PORT)) || 3000;
  const portDev =
    (process.env.PORT_DEV && parseInt(process.env.PORT_DEV)) || port + 1;

  const actualPort = await choosePort(process.env.HOST, port);
  const actualPortDev = await choosePort(process.env.HOST, portDev);

  process.env.PORT = actualPort;
  process.env.PORT_DEV = actualPortDev;
};
