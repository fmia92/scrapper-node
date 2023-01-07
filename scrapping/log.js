import pc from 'picocolors'

const logSymbols = {
  info: pc.blue('ℹ'),
  success: pc.green('✔'),
  warning: pc.yellow('⚠'),
  error: pc.red('✖')
}

export const log = {
  info: (message) => console.log(pc.cyan(`${logSymbols.info} ${message}`)),
  success: (message) => console.log(pc.green(`${logSymbols.success} ${message}`)),
  error: (message) => console.log(pc.red(`${logSymbols.error} ${message}`)),
  warn: (message) => console.log(pc.yellow(`${logSymbols.warning} ${message}`))
}
