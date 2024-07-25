# solochain

versions-solochain-dev:
	@yarn squid-substrate-metadata-explorer --chain wss://avn.uat.aventus.network --archive https://solo-archive-explorer.dev.aventus.network/graphql --out ./versions-solochain.dev.jsonl

versions-solochain-testnet:
	@yarn squid-substrate-metadata-explorer --chain wss://avn.test.aventus.network --archive https://solo-archive-explorer.public-testnet.aventus.network/graphql --out ./versions-solochain.testnet.jsonl

versions-solochain-mainnet:
	@yarn squid-substrate-metadata-explorer --chain wss://avn.aventus.network --archive https://solo-archive-explorer.mainnet.aventus.network/graphql --out ./versions-solochain.mainnet.jsonl

# parachain

versions-parachain-dev:
	@yarn squid-substrate-metadata-explorer --chain wss://avn-parachain-internal.dev.aventus.network --archive https://archive-explorer.dev.aventus.network/graphql --out ./versions.avn-parachain.dev.jsonl

versions-parachain-testnet:
	@yarn squid-substrate-metadata-explorer --chain wss://avn-parachain-internal.test.aventus.network --archive https://archive-explorer.testnet.aventus.network/graphql --out ./versions.avn-parachain.testnet.jsonl

versions-parachain-mainnet:
	@yarn squid-substrate-metadata-explorer --chain wss://avn-parachain-internal.mainnet.aventus.network --archive https://archive-explorer.mainnet.aventus.network/graphql --out ./versions.avn-parachain.mainnet.jsonl
