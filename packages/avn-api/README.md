# Avn Api

API package making it possible to interact with the chain.

## Environment variables

Add these variable to the app using this package:

## Preconfigured repl tool for exploring data programmatically

```
yarn repl
```

### Examples:

#### Get block / extrinsics / events data

```javascript
> let hash = await api.rpc.chain.getBlockHash(88)
> let signedBlock = await api.rpc.chain.getBlock(hash)
> let events = await api.query.system.events.at(hash)
> events[3].toHuman() // print the event you're interested in
```

```javascript
> let hash = await api.rpc.chain.getBlockHash(88)
> let apiAt = await api.at(hash)
> api.query.parachainStaking.staked.toJSON()
```

#### Get ParachainStaking events metadata

```javascript
> let meta = await api.rpc.state.getMetadata()
> meta.toJSON().metadata.v14.pallets.filter(p => p.name=='ParachainStaking')
> meta.toJSON().metadata.v14.lookup.types.filter(i => i.id == 32)[0].type.def.variant.variants
```
