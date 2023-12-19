import { getProcessor } from '@avn/config'
const processor = getProcessor()
  .addEvent('TokenManager.TokenTransferred', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('TokenManager.TokenLifted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('TokenManager.TokenLowered', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('TokenManager.AVTLifted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true }
      }
    }
  } as const)
  .addEvent('TokenManager.AvtLowered', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('TokenManager.LowerRequested', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Balances.Endowed', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Balances.Reserved', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Balances.Unreserved', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Balances.ReserveRepatriated', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Balances.Deposit', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Balances.Withdraw', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Balances.Slashed', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Balances.Transfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('NftManager.BatchCreated', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('NftManager.SingleNftMinted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('NftManager.BatchNftMinted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('NftManager.FiatNftTransfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('NftManager.EthNftTransfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          hash: true
        },
        call: { origin: true, args: true }
      }
    }
  } as const)
  .addEvent('Scheduler.Scheduled', {
    data: {
      event: {
        args: true,
        block: {
          events: { args: true, name: true }
        }
      }
    }
  } as const)
  .addEvent('Scheduler.Dispatched', {
    data: {
      event: {
        args: true,
        block: {
          events: { args: true, name: true }
        }
      }
    }
  } as const)
  .addEvent('Scheduler.Canceled', {
    data: {
      event: {
        args: true,
        block: {
          events: { args: true, name: true }
        }
      }
    }
  } as const)

export default processor
