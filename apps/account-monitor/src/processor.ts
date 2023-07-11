import { getProcessor } from '@avn/config'
const processor = getProcessor()
  .addEvent('TokenManager.TokenTransferred', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('TokenManager.TokenLifted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('TokenManager.TokenLowered', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('Balances.Transfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('NftManager.BatchCreated', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('NftManager.SingleNftMinted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('NftManager.BatchNftMinted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('NftManager.FiatNftTransfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)

export default processor
