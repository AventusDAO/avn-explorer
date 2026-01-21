import * as fs from 'fs'
import * as path from 'path'
import { ConfigData, BalanceConfig, EventConfigInput, QueueConfig } from './types'

function parseEnvArray<T>(envVar: string | undefined, name: string): T[] | undefined {
  if (!envVar) return undefined
  try {
    const parsed = JSON.parse(envVar)
    if (!Array.isArray(parsed)) {
      throw new Error(`${name} must be a JSON array`)
    }
    return parsed as T[]
  } catch (error) {
    throw new Error(
      `Failed to parse ${name}: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

export function loadConfigFromFile(): ConfigData {
  const getDirname = (): string => {
    if (typeof __dirname !== 'undefined') {
      return __dirname
    }
    try {
      // @ts-ignore
      if (typeof require !== 'undefined' && require.main) {
        // @ts-ignore
        return path.dirname(require.main.filename)
      }
    } catch {
      // Ignore
    }
    return process.cwd()
  }

  // Check for individual env vars (highest priority)
  const envBalances = parseEnvArray<BalanceConfig>(process.env.ALERTS_BALANCES, 'ALERTS_BALANCES')
  const envEvents = parseEnvArray<EventConfigInput>(process.env.ALERTS_EVENTS, 'ALERTS_EVENTS')
  const envQueues = parseEnvArray<QueueConfig>(process.env.ALERTS_QUEUES, 'ALERTS_QUEUES')

  if (envBalances || envEvents || envQueues) {
    return {
      balances: envBalances || [],
      events: envEvents || [],
      queues: envQueues || []
    }
  }

  // Check if config is provided via single JSON environment variable
  if (process.env.ALERTS_CONFIG_JSON) {
    try {
      const parsed = JSON.parse(process.env.ALERTS_CONFIG_JSON)
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('ALERTS_CONFIG_JSON must contain a valid JSON object')
      }
      return parsed as ConfigData
    } catch (error) {
      throw new Error(
        `Failed to parse ALERTS_CONFIG_JSON: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  // Resolve config path: prefer env var, then try multiple locations
  let configPath = process.env.ALERTS_CONFIG_PATH

  if (!configPath) {
    const baseDir = getDirname()

    const possiblePaths = [
      path.join(baseDir, '..', '..', 'config', 'alerts-config.json'),
      path.join(process.cwd(), 'config', 'alerts-config.json'),
      path.join(process.cwd(), 'apps', 'alerts', 'config', 'alerts-config.json')
    ]

    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        configPath = possiblePath
        break
      }
    }

    if (!configPath) {
      configPath = possiblePaths[0]
    }
  }

  if (!fs.existsSync(configPath)) {
    const baseDir = getDirname()
    const triedPaths = [
      path.join(baseDir, '..', '..', 'config', 'alerts-config.json'),
      path.join(process.cwd(), 'config', 'alerts-config.json'),
      path.join(process.cwd(), 'apps', 'alerts', 'config', 'alerts-config.json')
    ]
    throw new Error(
      `Config file not found at: ${configPath}. Tried paths: ${triedPaths.join(', ')}`
    )
  }

  const fileContent = fs.readFileSync(configPath, 'utf-8')
  let parsed: unknown
  try {
    parsed = JSON.parse(fileContent)
  } catch (error) {
    throw new Error(
      `Failed to parse config file: ${error instanceof Error ? error.message : String(error)}`
    )
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Config file must contain a valid JSON object')
  }

  return parsed as ConfigData
}
