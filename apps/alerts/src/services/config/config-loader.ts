import * as fs from 'fs'
import * as path from 'path'
import { ConfigData } from './types'

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
