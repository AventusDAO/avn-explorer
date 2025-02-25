import { registerEnumType } from 'type-graphql'

export enum ErrorCode {
  DATABASE_ERROR = 'DATABASE_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

registerEnumType(ErrorCode, {
  name: 'ErrorCode',
  description: 'Error codes for the application'
})

export class BaseError extends Error {
  constructor(message: string, public code: ErrorCode) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(message, ErrorCode.DATABASE_ERROR)
  }
}

export class InvalidInputError extends BaseError {
  constructor(message: string) {
    super(message, ErrorCode.INVALID_INPUT)
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, ErrorCode.NOT_FOUND)
  }
}
