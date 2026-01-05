import {
  validateSS58Address,
  validateBigIntString,
  validatePrometheusTags,
  validateEventName
} from '@avn/processor-common'
import { ConfigData } from './types'

export function validateConfig(config: ConfigData): void {
  if (!config.balances || !Array.isArray(config.balances)) {
    throw new Error('Config must have a balances array')
  }

  if (!config.events || !Array.isArray(config.events)) {
    throw new Error('Config must have an events array')
  }

  if (config.queues && !Array.isArray(config.queues)) {
    throw new Error('Config queues must be an array if provided')
  }

  for (const bc of config.balances) {
    if (!bc.accountAddress || !validateSS58Address(bc.accountAddress)) {
      throw new Error(`Invalid account address: ${bc.accountAddress}`)
    }

    try {
      if (bc.prometheusTags) {
        validatePrometheusTags(bc.prometheusTags)
      } else {
        throw new Error('prometheusTags is required')
      }
    } catch (error) {
      throw new Error(
        `Invalid prometheus tags: ${bc.prometheusTags} - ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }

    try {
      if (bc.warningThreshold) {
        validateBigIntString(bc.warningThreshold, 'warningThreshold')
      } else {
        throw new Error('warningThreshold is required')
      }
    } catch (error) {
      throw new Error(
        `Invalid warning threshold: ${bc.warningThreshold} - ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }

    try {
      if (bc.dangerThreshold) {
        validateBigIntString(bc.dangerThreshold, 'dangerThreshold')
      } else {
        throw new Error('dangerThreshold is required')
      }
    } catch (error) {
      throw new Error(
        `Invalid danger threshold: ${bc.dangerThreshold} - ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }

    if (BigInt(bc.warningThreshold) <= BigInt(bc.dangerThreshold)) {
      throw new Error(
        `Warning threshold (${bc.warningThreshold}) must be greater than danger threshold (${bc.dangerThreshold})`
      )
    }
  }

  for (const ec of config.events) {
    try {
      if (ec.eventName) {
        validateEventName(ec.eventName)
      } else {
        throw new Error('eventName is required')
      }
    } catch (error) {
      throw new Error(
        `Invalid event name: ${ec.eventName} - ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }

    try {
      if (ec.prometheusTags) {
        validatePrometheusTags(ec.prometheusTags)
      } else {
        throw new Error('prometheusTags is required')
      }
    } catch (error) {
      throw new Error(
        `Invalid prometheus tags: ${ec.prometheusTags} - ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }

    if (typeof ec.includeMetadata !== 'boolean') {
      throw new Error('Each event config must have a valid includeMetadata boolean')
    }
  }

  if (config.queues) {
    for (const qc of config.queues) {
      if (!qc.queueName || typeof qc.queueName !== 'string') {
        throw new Error(`Invalid queue name: ${qc.queueName}`)
      }

      try {
        if (qc.prometheusTags) {
          validatePrometheusTags(qc.prometheusTags)
        } else {
          throw new Error('prometheusTags is required')
        }
      } catch (error) {
        throw new Error(
          `Invalid prometheus tags: ${qc.prometheusTags} - ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }

      try {
        if (qc.warningThreshold) {
          if (!/^\d+$/.test(qc.warningThreshold)) {
            throw new Error('warningThreshold must be a non-negative integer')
          }
          const warningValue = parseInt(qc.warningThreshold, 10)
          if (warningValue < 0) {
            throw new Error('warningThreshold must be non-negative')
          }
        } else {
          throw new Error('warningThreshold is required')
        }
      } catch (error) {
        throw new Error(
          `Invalid warning threshold: ${qc.warningThreshold} - ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }

      try {
        if (qc.errorThreshold) {
          if (!/^\d+$/.test(qc.errorThreshold)) {
            throw new Error('errorThreshold must be a non-negative integer')
          }
          const errorValue = parseInt(qc.errorThreshold, 10)
          if (errorValue < 0) {
            throw new Error('errorThreshold must be non-negative')
          }
        } else {
          throw new Error('errorThreshold is required')
        }
      } catch (error) {
        throw new Error(
          `Invalid error threshold: ${qc.errorThreshold} - ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      }

      const warningValue = parseInt(qc.warningThreshold, 10)
      const errorValue = parseInt(qc.errorThreshold, 10)
      if (warningValue >= errorValue) {
        throw new Error(
          `Warning threshold (${qc.warningThreshold}) must be less than error threshold (${qc.errorThreshold})`
        )
      }
    }
  }
}
