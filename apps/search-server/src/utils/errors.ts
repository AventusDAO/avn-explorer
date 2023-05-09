import axios, { AxiosError } from 'axios'
export class BaseError extends Error {
  public readonly name: string
  public readonly httpCode: number
  public readonly isOperational: boolean

  constructor(name: string, httpCode: number, description: string, isOperational: boolean) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}
export class ApiError extends BaseError {
  constructor(
    name: string,
    httpCode = 500,
    description = 'internal server error',
    isOperational = true
  ) {
    super(name, httpCode, description, isOperational)
  }

  static fromAxios(err: AxiosError, status?: number, message?: string): ApiError {
    return new ApiError(
      err.name,
      status !== undefined ? status : err.response?.status,
      message !== undefined ? message : err.message,
      true
    )
  }
}

export function isAxiosError(err: unknown): boolean {
  return axios.isAxiosError(err)
}
