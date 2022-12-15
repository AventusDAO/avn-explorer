import { environment } from '@avn/config'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { OverrideVersionedType, OverrideBundleType } from '@polkadot/types/types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const solochainTypes = require('avn-types')

/**
 * Updates all Substrate v2 registry types with `DispatchErrorModule` to be able to decode `ExtrinsicFailed` events with Polkadot API >= v8.
 * The `ErrorModule` type is changed on new Substrate v3 and used by Polkadot API >= v8 as default.
 *
 * NOTE: doing it in the `avn-types` wil break instances using olkder Polkadot API, because it does not know how to use it.
 * It will print "REGISTRY: Unable to resolve type DispatchErrorModuleU8, it will fail on construction" and throw when decoding.
 * Confirmed it by reverting the code before parachain changes where it uses Polkadot API <= v7 and trying to decode `ExtrinsicFailed` events.
 */
const updateSubstrateV2Types = (typesBundle: OverrideBundleType): OverrideBundleType => {
  if (!typesBundle.spec) return typesBundle
  typesBundle.spec.avn.types = typesBundle.spec.avn.types?.map(
    (versionedTypes: OverrideVersionedType) => {
      return {
        minmax: versionedTypes.minmax,
        types: {
          ...versionedTypes.types,
          DispatchErrorModule: 'DispatchErrorModuleU8'
        }
      }
    }
  )
  return typesBundle
}

export const getApi = async (): Promise<ApiPromise> => {
  const { typesBundle: typesBundleFile, endpoint } = environment
  const wsProvider = new WsProvider(endpoint)

  const typesBundle = typesBundleFile ? updateSubstrateV2Types(solochainTypes) : undefined
  const api = await ApiPromise.create({
    provider: wsProvider,
    typesBundle
  })

  return api
}
