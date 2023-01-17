import { IBalance } from './types/custom/balance'
import { AddressEncoded } from '@avn/types'

export function decodeBalance(balanceAsHex: string): bigint {
  const match = balanceAsHex.match(/.{2}/g)
  if (!match) return 0n
  const balanceInReversedEndianness = `0x${match.reverse().join('')}`
  return BigInt(balanceInReversedEndianness)
}

export function extractPublicKey(tuple: string): string {
  const parts = tuple.match(/.{64}$/g)
  if (!parts) return ''
  const publicKey = `0x${parts.pop()}`
  return publicKey
}

export function processEncodedMigratedAccountData(
  migratedAccountData: [string, string]
): MigratedAccount {
  const publicKey = extractPublicKey(migratedAccountData[0])
  const cleanBalanceData = migratedAccountData[1].replace(/^0x/, '')
  const free = decodeBalance(cleanBalanceData.slice(32, 64))
  const reserved = decodeBalance(cleanBalanceData.slice(64, 96))

  return {
    publicKey: publicKey,
    balance: {
      free,
      reserved
    }
  }
}

type MigratedAccount = {
  publicKey: AddressEncoded
  balance: IBalance
}
