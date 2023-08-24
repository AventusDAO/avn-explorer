export const reverseEndian = (endian: string): string => {
  const matches = endian.replace('0x', '').match(/../g) ?? []
  return '0x' + matches.reverse().join('')
}

export const uint8ArrToHexStr = (data: Uint8Array): string =>
  `0x${Buffer.from(data).toString('hex')}`
