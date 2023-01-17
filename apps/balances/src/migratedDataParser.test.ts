import { describe, expect, it } from '@jest/globals'
import {
  processEncodedMigratedAccountData,
  decodeBalance,
  extractPublicKey
} from './migratedDataParser'

const BALANCE_HASH =
  '0x00000000000000000100000000000000b57fdcf80296ffa70a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
const ACCOUNT_HASH = `0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da996e89a20bbf023a042e605ec9ad5b694ea055d6f2e2280ecfd691e28f3062047c3904273ea699ec5d05c43a5b8413e55`

describe('Parsing migrated data', () => {
  it('should decode balance from passed hex', () => {
    const balanceAsHex = BALANCE_HASH

    const cleanBalanceData = balanceAsHex.replace(/^0x/, '')
    const free = decodeBalance(cleanBalanceData.slice(32, 64))
    const reserved = decodeBalance(cleanBalanceData.slice(64, 96))

    expect(free).toEqual(196572999999999999925n)
    expect(reserved).toEqual(0n)
  })
  it('should extract account public key', () => {
    const migratedAccountData = ACCOUNT_HASH
    const result = extractPublicKey(migratedAccountData)
    expect(result).toEqual(`0xea055d6f2e2280ecfd691e28f3062047c3904273ea699ec5d05c43a5b8413e55`)
  })
  it('should process migrated data and return migrated account with balance', () => {
    const migratedData: [string, string] = [ACCOUNT_HASH, BALANCE_HASH]
    const result = processEncodedMigratedAccountData(migratedData)
    expect(result.publicKey).toEqual(
      `0xea055d6f2e2280ecfd691e28f3062047c3904273ea699ec5d05c43a5b8413e55`
    )
    expect(result.balance.free).toEqual(196572999999999999925n)
    expect(result.balance.reserved).toEqual(0n)
  })
})
