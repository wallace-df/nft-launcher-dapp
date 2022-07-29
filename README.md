# NFT Collection Launcher
Frontend implementation for the NFT Collection Launcher using Vue.js.

---

Provides an interface for:

1. Processing, bundling and uploading NFT assets (.json, .png) to IPFS via NFTStorage API (https://nft.storage/). 
2. Automatically deploying the NFT minter contracts to the following networks:
   - StarkNet (testnet)
   - zkSync (testnet)


![NFT Collection Launcher](/nft-collection-launcher.png?raw=true "NFT Collection Launcher")

### Install dependencies

```shell
yarn install
```

### Create the *resources/keys.json* file and set your NFTStorage API Key:

```json
{
    "nftStorage": "<YOUR NFT STORAGE API KEY>"
}
```

### Start development server with hot-reload

```shell
yarn serve
```


### Build

```shell
yarn build
```
