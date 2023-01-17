import { describe, expect, it } from '@jest/globals'
import { processEncodedMigratedAccountData } from './migratedDataParser'

const ACCOUNT_DATA =
  '0x00000000000000000100000000000000b57fdcf80296ffa70a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
const STORAGE_KEY = `0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da996e89a20bbf023a042e605ec9ad5b694ea055d6f2e2280ecfd691e28f3062047c3904273ea699ec5d05c43a5b8413e55`
const EXPECTED_ACCOUNT_PUBLIC_KEY = `0xea055d6f2e2280ecfd691e28f3062047c3904273ea699ec5d05c43a5b8413e55`
const EXPECTED_FREE_BALANCE = 196572999999999999925n

describe('Parsing migrated data', () => {
  it('should process migrated data and return migrated account with balance', () => {
    const migratedData: [string, string] = [STORAGE_KEY, ACCOUNT_DATA]
    const result = processEncodedMigratedAccountData(migratedData)
    expect(result.publicKey).toEqual(EXPECTED_ACCOUNT_PUBLIC_KEY)
    expect(result.balance.free).toEqual(EXPECTED_FREE_BALANCE)
    expect(result.balance.reserved).toEqual(0n)
  })
})
