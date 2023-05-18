import { createLogger, format, transports, Logger } from 'winston'
import { config } from '../config'
const { combine, timestamp, printf, ms, cli } = format
const { Console } = transports

const output = printf(
  o =>
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `${o.timestamp} (${o.ms?.padEnd(7) ?? ''}) [${o.level.padEnd(7)}] ${o.obj.padEnd(11)}:` +
    (o.message as string)
)

const formats: any[] = []
if (ms) formats.push(ms())
formats.push(timestamp())
if (config.logging.useColor) formats.push(cli({ all: true }))
formats.push(output)

const parent = createLogger({
  level: config.logging.level,
  transports: [
    new Console({
      format: combine(...formats),
      stderrLevels: ['warn', 'error']
    })
  ]
})

export const globalLogger = parent.child({ obj: 'global' })

globalLogger.info('logger starting')

export function getLogger(obj: string): Logger {
  return globalLogger.child({ obj })
}
