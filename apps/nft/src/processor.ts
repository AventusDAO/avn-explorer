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
  // NOTE: there are also other related Migration calls, i.e.: 'Migration.migrate_used_external_refs', 'Migration.migrate_nft_infos', 'Migration.migrate_batch_info_ids', 'Migration.migrate_batch_nonces',
  // but we don't need to query them as we're reading the Nft and BatchNft data directly from the appropriate NftManager storages after the migration takes place
  .addCall('Migration.migrate_nfts', {
    data: {
      call: {
        args: true
      }
    }
  } as const)
  .addCall('Migration.migrate_nft_batches', {
    data: {
      call: {
        args: true
      }
    }
  })
