import { u8aToHex } from '@polkadot/util'
import { Keyring } from '@polkadot/api'

/** keyring for avn account type */
const accountKeyring = new Keyring({ type: 'sr25519' })

/** gets hex pk for given ss58 address */
export function decodeAccountToHex(encodedAddress: string): string {
  return u8aToHex(accountKeyring.decodeAddress(encodedAddress))
}

/** gets encoded value for given address */
export function encodeAccountHex(hexAddress: string): string {
  return accountKeyring.encodeAddress(hexAddress)
}

/** checks whether address is valid and if yes, also returns it's hex representation */
export const getAddressPublicKeyAsHex = (address: string): string | null => {
  try {
    const publicKeyAsHex = decodeAccountToHex(address)
    return publicKeyAsHex
  } catch (err) {
    return null
  }
}
