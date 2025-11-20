export const ALERT_TYPES = {
  WARNING: 'warning',
  DANGER: 'danger'
} as const

export const DEFAULT_METRICS_PORT = 3001

export type AlertType = typeof ALERT_TYPES[keyof typeof ALERT_TYPES]
