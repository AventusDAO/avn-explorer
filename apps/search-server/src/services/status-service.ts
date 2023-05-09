import { config } from '../config'
import { AppStatus } from '../types/status'
import Version from '../version.json'

/** gets health and config status for the appp */
export function getAppStatus(): AppStatus {
  return {
    status: 'ok',
    version: Version.version,
    buildTimestamp: Version.buildTimestamp,
    config
  }
}
