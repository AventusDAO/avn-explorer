import { getProcessor } from '@avn/config'

export const processor = getProcessor()
  .addEvent('NftManager.SingleNftMinted', {
    data: {
      event: {
        args: true,
        call: {
          args: true
        }
      }
    }
  } as const)
  .addEvent('NftManager.BatchNftMinted', {
    data: {
      event: {
        args: true,
        call: {
          args: true
        }
      }
    }
  } as const)
  .addEvent('NftManager.BatchCreated', {
    data: {
      event: {
        args: true,
        call: {
          args: true
        }
      }
    }
  } as const)
  .addEvent('NftManager.FiatNftTransfer', {
    data: {
      event: {
        args: true,
        call: false
      }
    }
  } as const)
  .addEvent('NftManager.EthNftTransfer', {
    data: {
      event: {
        args: true,
        call: false
      }
    }
  } as const)
  .addCall('Migration.migrate_nfts', {
    data: {
      call: {
        args: true
      }
    }
  } as const)
