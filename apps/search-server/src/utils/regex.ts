// 1. avnHashRegex (user address, tx or blockhashes): digits and letters A-F (lower/upper case, because user may enter it as he wishes)
//   (lower/upper case, because it matters). Starts with 5 (since the chain is a generic Substrate chain)
// 3. nftIdRegex: just digits, any length
export const avnHashRegex = /^0x[A-Fa-f0-9]{64}$/
// we're not sure about the length (https://github.com/Aventus-Network-Services/block-explorer/pull/19#discussion_r719334128)
export const nftIdRegex = /^[0-9]*$/
